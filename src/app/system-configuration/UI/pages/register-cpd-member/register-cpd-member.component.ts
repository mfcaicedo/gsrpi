import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { KeyValueOption } from '../../../../shared/utils/models/form-builder.model';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { Router, RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormBodyCommitteMemberComponent } from '../../shared/components/form-body-committe-member/form-body-committe-member.component';
import { AuthService } from '../../../../auth/auth.service';
import { CreateInitialConfigurationUsecase } from '../../../domain/usecase/create-initial-configuration-usecase';
import { PersonRequest } from '../../../domain/models/person.model';

@Component({
  selector: 'app-register-cpd-member',
  imports: [CommonModule, ButtonModule, ProgressBarModule, SelectModule, FormsModule, InputTextModule,
    ReactiveFormsModule, InputNumberModule, RouterModule, ToastModule, ConfirmDialogModule,
    FormBodyCommitteMemberComponent],
  providers: [ConfirmationService, MessageService],
  templateUrl: './register-cpd-member.component.html',
  styleUrl: './register-cpd-member.component.css'
})
export class RegisterCpdMemberComponent {

  //TODO: Debe ser un servicio que traiga los datos de tipos de identificación
  identificationTypeDataList: KeyValueOption[] = [
    { key: 1, value: 'Cedula' },
    { key: 2, value: 'Tarjeta Identidad' },
    { key: 3, value: 'Cedula extrangera' },
    { key: 4, value: 'Pasaporte' }
  ];

  isDisabledNextStep = true;
  registerCpdMemberForm!: FormGroup;
  userUid = '';

  private readonly formBuilder = inject(FormBuilder);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly createInitialConfigurationUseCase = inject(CreateInitialConfigurationUsecase);

  ngOnInit() {

    this.registerCpdMemberForm = this.formBuilder.group({
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

    this.registerCpdMemberForm.markAllAsTouched();
    if (this.registerCpdMemberForm.invalid) {
      return;
    }

    // obtengo el id de la configuración inicial
    const configurationId = this.authService.configurationId.value;

    //TODO: crear un usuario en supabse con una contraseña por defecto. 
    await this.createUserSupabase();
    //TODO: Crear el objeto de la persona
    const resquestBody: PersonRequest = {
      firstName: this.registerCpdMemberForm.value.firstName,
      secondName: this.registerCpdMemberForm.value.middleName,
      firstLastName: this.registerCpdMemberForm.value.firstLastName,
      secondLastName: this.registerCpdMemberForm.value.secondLastName,
      identificationTypeCatId: this.registerCpdMemberForm.value.identificationType.key,
      identificationNumber: this.registerCpdMemberForm.value.identificationNumber,
      phone: this.registerCpdMemberForm.value.cellphone,
      email: this.registerCpdMemberForm.value.email,
      configurationId: configurationId,
      user: {
        uid: this.userUid,
        email: this.registerCpdMemberForm.value.email,
        password: '',
        userRoles: [
          {
            role: {
              name: 'integrante-cpd'
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
        this.registerCpdMemberForm.reset();
        this.messageService.add(
          {
            severity: 'success',
            summary: '¡Registro exitoso!',
            detail: 'El miembro del CPD se ha creado correctamente'
          });
      },
      error: (error) => {
        this.messageService.add(
          {
            severity: 'error',
            summary: 'Ups, algo salió mal',
            detail: 'Ocurrió un error al crear el miembro del CPD'
          });
        console.log("error", error);
      }
    });

  }

  createUserSupabase() {
    //TODO: los miembros del CPD deben verificar el correo cuando les llegue la invitación
    return new Promise((resolve) => {
      this.authService.createUser(this.registerCpdMemberForm.value.email).subscribe({
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
        this.router.navigate(['configuracion-sistema/registrar-secretaria-cpd']);
      },
      reject: () => {
        console.log("reject button modal");
      },
    });
  }

}

