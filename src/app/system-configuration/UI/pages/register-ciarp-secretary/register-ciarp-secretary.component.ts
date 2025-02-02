import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { KeyValueOption } from '../../../../shared/utils/models/form-builder.model';
import { FormBodyCommitteMemberComponent } from '../../shared/components/form-body-committe-member/form-body-committe-member.component';
import { AuthService } from '../../../../auth/auth.service';
import { CreateInitialConfigurationUsecase } from '../../../domain/usecase/create-initial-configuration-usecase';
import { PersonRequest } from '../../../domain/models/person.model';

@Component({
  selector: 'app-register-ciarp-secretary',
  imports: [CommonModule, ButtonModule, ProgressBarModule, SelectModule, FormsModule, InputTextModule,
    ReactiveFormsModule, InputNumberModule, RouterModule, ToastModule, ConfirmDialogModule,
    FormBodyCommitteMemberComponent],
  providers: [ConfirmationService, MessageService],
  templateUrl: './register-ciarp-secretary.component.html',
  styleUrl: './register-ciarp-secretary.component.css'
})
export class RegisterCiarpSecretaryComponent {

  //TODO: Debe ser un servicio que traiga los datos de tipos de identificación
  identificationTypeDataList: KeyValueOption[] = [
    { key: 1, value: 'Cedula' },
    { key: 2, value: 'Tarjeta Identidad' },
    { key: 3, value: 'Cedula extrangera' },
    { key: 4, value: 'Pasaporte' }
  ];

  registerCiarpSecretaryForm!: FormGroup;
  userUid = '';

  private readonly formBuilder = inject(FormBuilder);
  private readonly messageService = inject(MessageService);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly createInitialConfigurationUseCase = inject(CreateInitialConfigurationUsecase);

  ngOnInit() {

    this.registerCiarpSecretaryForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      middleName: ['', []],
      firstLastName: ['', [Validators.required]],
      secondLastName: ['', []],
      identificationType: [undefined, [Validators.required]],
      identificationNumber: [undefined, [Validators.required]],
      cellphone: [undefined, [Validators.required]],
      email: ['', [Validators.required, Validators.email]],

    });

  }

  async onSubmit() {
    console.log("values", this.registerCiarpSecretaryForm.value);
    this.registerCiarpSecretaryForm.markAllAsTouched();
    if (this.registerCiarpSecretaryForm.invalid) {
      return;
    }
    // obtengo el id de la configuración inicial
    const configurationId = this.authService.configurationId.value;
    //TODO: Enviar datos al servicio para guardar la secretaria del CIARP 
    //TODO: crear un usuario en supabse con una contraseña por defecto. 
    await this.createUserSupabase();
    //TODO: Crear el objeto de la persona
    const resquestBody: PersonRequest = {
      firstName: this.registerCiarpSecretaryForm.value.firstName,
      secondName: this.registerCiarpSecretaryForm.value.middleName,
      firstLastName: this.registerCiarpSecretaryForm.value.firstLastName,
      secondLastName: this.registerCiarpSecretaryForm.value.secondLastName,
      identificationTypeCatId: this.registerCiarpSecretaryForm.value.identificationType.key,
      identificationNumber: this.registerCiarpSecretaryForm.value.identificationNumber,
      phone: this.registerCiarpSecretaryForm.value.cellphone,
      email: this.registerCiarpSecretaryForm.value.email,
      configurationId: configurationId,
      user: {
        uid: this.userUid,
        email: this.registerCiarpSecretaryForm.value.email,
        password: '',
        userRoles: [
          {
            role: {
              name: 'secretaria-ciarp'
            }
          }
        ]
      }
    };

    //TODO: Enviar datos al servicio para guardar la secretaria del CPD
    this.createInitialConfigurationUseCase.createPerson(resquestBody).subscribe({
      next: (response) => {

        this.registerCiarpSecretaryForm.reset();
        this.messageService.add(
          {
            severity: 'success',
            summary: '¡Registro exitoso!',
            detail: 'La secretaria del CIARP fue creada exitosamente'
          });
        setTimeout(() => {
          this.router.navigate(['/'])
        }, 3000);
      },
      error: (error) => {
        this.messageService.add(
          {
            severity: 'error',
            summary: 'Ups, algo salió mal',
            detail: 'Tuvimos un problema al registrar la secretaria del CIARP. Inténtelo de nuevo en unos minutos.'
          });
        console.log("error", error);
      }
    });

  }

  createUserSupabase() {
    //TODO: los miembros del CPD deben verificar el correo cuando les llegue la invitación
    return new Promise((resolve) => {
      this.authService.createUser(this.registerCiarpSecretaryForm.value.email).subscribe({
        next: (response) => {
          this, this.userUid = response.data.user.id;
          resolve(true);
        },
        error: (error) => {
          resolve(false)
          console.log("error", error);
        }
      });
    });

  }

}
