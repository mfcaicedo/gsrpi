import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { FormBodyCommitteMemberComponent } from '../../shared/components/form-body-committe-member/form-body-committe-member.component';
import { KeyValueOption } from '../../../../shared/utils/models/form-builder.model';
import { AuthService } from '../../../../auth/auth.service';
import { CreateInitialConfigurationUsecase } from '../../../domain/usecase/create-initial-configuration-usecase';
import { PersonRequest } from '../../../domain/models/person.model';

@Component({
  selector: 'app-register-ciarp-member',
  imports: [CommonModule, ButtonModule, ProgressBarModule, SelectModule, FormsModule, InputTextModule,
    ReactiveFormsModule, InputNumberModule, RouterModule, ToastModule, ConfirmDialogModule,
    FormBodyCommitteMemberComponent],
  providers: [ConfirmationService, MessageService],
  templateUrl: './register-ciarp-member.component.html',
  styleUrl: './register-ciarp-member.component.css'
})
export class RegisterCiarpMemberComponent {

  //TODO: Debe ser un servicio que traiga los datos de tipos de identificación
  identificationTypeDataList: KeyValueOption[] = [
    { key: 1, value: 'Cedula' },
    { key: 2, value: 'Tarjeta Identidad' },
    { key: 3, value: 'Cedula extrangera' },
    { key: 4, value: 'Pasaporte' }
  ];

  isDisabledNextStep = true;
  registerCiarpMemberForm!: FormGroup;
  userUid = '';

  private readonly formBuilder = inject(FormBuilder);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly createInitialConfigurationUseCase = inject(CreateInitialConfigurationUsecase);

  ngOnInit() {

    this.registerCiarpMemberForm = this.formBuilder.group({
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
    
    this.registerCiarpMemberForm.markAllAsTouched();
    if (this.registerCiarpMemberForm.invalid) {
      return;
    }

    // obtengo el id de la configuración inicial
    const configurationId = this.authService.configurationId.value;

    //TODO: crear un usuario en supabse con una contraseña por defecto. 
    await this.createUserSupabase();
    //TODO: Crear el objeto de la persona
    const resquestBody: PersonRequest = {
      firstName: this.registerCiarpMemberForm.value.firstName,
      secondName: this.registerCiarpMemberForm.value.middleName,
      firstLastName: this.registerCiarpMemberForm.value.firstLastName,
      secondLastName: this.registerCiarpMemberForm.value.secondLastName,
      identificationTypeCatId: this.registerCiarpMemberForm.value.identificationType.key,
      identificationNumber: this.registerCiarpMemberForm.value.identificationNumber,
      phone: this.registerCiarpMemberForm.value.cellphone,
      email: this.registerCiarpMemberForm.value.email,
      configurationId: configurationId,
      user: {
        uid: this.userUid,
        email: this.registerCiarpMemberForm.value.email,
        password: '',
        userRoles: [
          {
            role: {
              name: 'integrante-ciarp'
            }
          }
        ]
      }
    };

    //TODO: Enviar datos al servicio para guardar el miembro del CPD
    this.createInitialConfigurationUseCase.createPerson(resquestBody).subscribe({
      next: (response) => {
        //Activo el boton siguiente 
        this.isDisabledNextStep = false;
        this.registerCiarpMemberForm.reset();
        this.messageService.add(
          {
            severity: 'success',
            summary: '¡Registro exitoso!',
            detail: 'El miembro del CIARP se ha creado exitosamente'
          });
      },
      error: (error) => {
        this.messageService.add(
          {
            severity: 'error',
            summary: 'Ups, algo salió mal',
            detail: 'Ocurrió un error al crear el miembro del CIARP'
          });
        console.log("error", error);
      }
    });

  }

  createUserSupabase() {
    //TODO: los miembros del CPD deben verificar el correo cuando les llegue la invitación
    return new Promise((resolve) => {
      this.authService.createUser(this.registerCiarpMemberForm.value.email).subscribe({
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

  modalNewCpdMemberOrNextStep(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: '¿Desea continuar con el siguiente paso?',
      header: 'Confirmación',
      closable: true,
      closeOnEscape: true,
      icon: 'pi pi-info-circle',
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'secondary',
        outlined: true,

      },
      acceptButtonProps: {
        label: 'Aceptar',
      },
      accept: () => {
        console.log("acept button modal");
        this.router.navigate(['configuracion-sistema/registrar-secretaria-ciarp']);
      },
      reject: () => {
        console.log("reject button modal");
      },
    });
  }

}
