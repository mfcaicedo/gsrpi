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
import { PersonRequest } from '../../../domain/models/person.model';
import { CreateInitialConfigurationUsecase } from '../../../domain/usecase/create-initial-configuration-usecase';

@Component({
  selector: 'app-register-cpd-secretary',
  imports: [CommonModule, ButtonModule, ProgressBarModule, SelectModule, FormsModule, InputTextModule,
    ReactiveFormsModule, InputNumberModule, RouterModule, ToastModule, ConfirmDialogModule,
    FormBodyCommitteMemberComponent],
  providers: [ConfirmationService, MessageService],
  templateUrl: './register-cpd-secretary.component.html',
  styleUrl: './register-cpd-secretary.component.css'
})
export class RegisterCpdSecretaryComponent {

  //TODO: Debe ser un servicio que traiga los datos de tipos de identificación
  identificationTypeDataList: KeyValueOption[] = [
    { key: 1, value: 'Cedula' },
    { key: 2, value: 'Tarjeta Identidad' },
    { key: 3, value: 'Cedula extrangera' },
    { key: 4, value: 'Pasaporte' }
  ];

  registerCpdSecretaryForm!: FormGroup;
  userUid = '';

  private readonly formBuilder = inject(FormBuilder);
  private readonly messageService = inject(MessageService);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly createInitialConfigurationUseCase = inject(CreateInitialConfigurationUsecase);

  ngOnInit() {

    this.registerCpdSecretaryForm = this.formBuilder.group({
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

    this.registerCpdSecretaryForm.markAllAsTouched();
    if (this.registerCpdSecretaryForm.invalid) {
      return;
    }
    // obtengo el id de la configuración inicial
    const configurationId = this.authService.configurationId.value;
    //TODO: Enviar datos al servicio para guardar la secretaria del CPD
    //TODO: crear un usuario en supabse con una contraseña por defecto. 
    await this.createUserSupabase();
    //TODO: Crear el objeto de la persona
    const resquestBody: PersonRequest = {
      firstName: this.registerCpdSecretaryForm.value.firstName,
      secondName: this.registerCpdSecretaryForm.value.middleName,
      firstLastName: this.registerCpdSecretaryForm.value.firstLastName,
      secondLastName: this.registerCpdSecretaryForm.value.secondLastName,
      identificationTypeCatId: this.registerCpdSecretaryForm.value.identificationType.key,
      identificationNumber: this.registerCpdSecretaryForm.value.identificationNumber,
      phone: this.registerCpdSecretaryForm.value.cellphone,
      email: this.registerCpdSecretaryForm.value.email,
      configurationId: configurationId,
      user: {
        uid: this.userUid,
        email: this.registerCpdSecretaryForm.value.email,
        password: '',
        userRoles: [
          {
            role: {
              name: 'secretaria-cpd'
            }
          }
        ]
      }
    };

    //TODO: Enviar datos al servicio para guardar la secretaria del CPD
    this.createInitialConfigurationUseCase.createPerson(resquestBody).subscribe({
      next: (response) => {

        this.registerCpdSecretaryForm.reset();
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
            detail: 'Ocurrió un error al crear la secretaria del CPD'
          });
        console.log("error", error);
      }
    });

  }

  createUserSupabase() {
    //TODO: los miembros del CPD deben verificar el correo cuando les llegue la invitación
    return new Promise((resolve) => {
      this.authService.createUser(this.registerCpdSecretaryForm.value.email).subscribe({
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
