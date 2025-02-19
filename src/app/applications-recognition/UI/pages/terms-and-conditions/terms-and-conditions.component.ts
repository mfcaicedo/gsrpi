import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../../../../auth/auth.service';
import { UserManagementUseCase } from '../../../../user-management/domain/usecase/user-management-usecase';
import { ApplicationTempManagementUsecase } from '../../../domain/usecase/application-temp-management-usecase';
import { ApplicationTemp } from '../../../domain/models/applications.model';
import { filter, firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-terms-and-conditions',
  imports: [CommonModule, ButtonModule, ProgressBarModule, FormsModule, InputTextModule,
    ReactiveFormsModule, RouterModule, ToastModule, ConfirmDialogModule, CheckboxModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './terms-and-conditions.component.html',
  styleUrl: './terms-and-conditions.component.css'
})
export class TermsAndConditionsComponent {

  //TODO: Obtener el nombre del solicitante principal por medio de token o servicio de autenticación
  nameMainApplicant = '';

  userUid = '';
  userId = 0;
  personId = 0;
  teacherId = 0;
  applicationTempId = 0;

  isDisabledNextStep = true;
  termsAndConditionsForm!: FormGroup;

  private readonly formBuilder = inject(FormBuilder);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);
  private readonly authService = inject(AuthService);
  private readonly userManagementUseCase = inject(UserManagementUseCase);
  private readonly applicationTempManagementUsecase = inject(ApplicationTempManagementUsecase);

  async ngOnInit() {

    this.termsAndConditionsForm = this.formBuilder.group({
      termsAndConditions: [undefined, [Validators.required]],
    });

    this.userUid = (await firstValueFrom(this.authService.getSession().pipe(filter(data => !!data)))).user.id as string;
    //1. Consultar usuario por uid 
    await this.getUserByUid();
    //2. Consultar persona por id de usuario
    await this.getPersonByUserId();
    //3. Consultar docente por id de persona
    await this.getTeacherByPersonId();

    await this.getApplicationTempByTeacherId();

  }

  async getUserByUid() {
    return new Promise((resolve) => {
      this.userManagementUseCase.getUserByUid(this.userUid).subscribe({
        next: (response: any) => {
          this.userId = response.userId;
          resolve(true);
        },
        error: (error) => {
          resolve(false);
          console.log("error", error);
        }
      });
    });
  }

  async getPersonByUserId() {
    return new Promise((resolve) => {
      this.userManagementUseCase.getPersonByUserId(this.userId).subscribe({
        next: (response: any) => {
          this.personId = response.personId;
          this.nameMainApplicant = `${response.firstName} ${response.secondName} ${response.firstLastName} ${response.secondLastName ?? ''}`;
          resolve(true);
        },
        error: (error) => {
          resolve(false);
          console.log("error", error);
        }
      });
    });
  }

  async getTeacherByPersonId() {

    return new Promise((resolve) => {
      this.userManagementUseCase.getTeacherByPersonId(this.personId).subscribe({
        next: (response: any) => {
          this.teacherId = response.teacherId;
          resolve(true);
        },
        error: (error) => {
          resolve(false);
          console.log("error", error);
        }
      });
    });

  }

  async getApplicationTempByTeacherId() {

    return new Promise((resolve) => {
      this.applicationTempManagementUsecase.getApplicationTempByTeacherId(this.teacherId).subscribe({
        next: (response: any) => {
          this.applicationTempId = response.applicationTempId;
          if (response.termsAndConditions) {

            this.termsAndConditionsForm.patchValue({
              termsAndConditions: new Array(response.termsAndConditions)
            });
            this.isDisabledNextStep = false;

          }
          resolve(true);
        },
        error: (error) => {
          this.messageService.add(
            {
              severity: 'error',
              summary: 'Ups, algo salió mal',
              detail: 'Tuvimos un problema al consultar la solicitud de reconocimiento. Inténtelo de nuevo en unos minutos.'
            });
          console.error("error", error);
          resolve(false);
        }
      });
    });
  }

  onSubmit() {

    this.termsAndConditionsForm.markAllAsTouched();
    if (this.termsAndConditionsForm.invalid) {
      return;
    }

    //Modal de confirmación de guardar datos 
    this.modalConfirmationSaveData();

  }

  modalConfirmationSaveData() {
    this.confirmationService.confirm({
      target: 'body' as unknown as EventTarget,
      message: '¿Está seguro(a) de guardar la información?',
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
      accept: async () => {
        //Guardar datos
        await this.updateApplicationTemp();
      },
    });
  }

  async updateApplicationTemp() {

    const bodyRequest: ApplicationTemp = {
      applicationTempId: this.applicationTempId,
      termsAndConditions: this.termsAndConditionsForm.value.termsAndConditions[0]
    };

    return new Promise((resolve) => {
      this.applicationTempManagementUsecase.updateApplicationTemp(bodyRequest).subscribe({
        next: (response: any) => {
          //Activo el boton siguiente 
          this.isDisabledNextStep = false;
          //Mensaje de exito 
          this.messageService.add(
            {
              severity: 'success',
              summary: '¡Registro exitoso!',
              detail: 'Los datos de la solicitud se han guardado exitosamente.'
            });
          resolve(true);
        },
        error: (error) => {
          this.messageService.add(
            {
              severity: 'error',
              summary: 'Ups, algo salió mal',
              detail: 'Tuvimos un problema al guardar los datos de la solicitud de reconocimiento. ' +
                'Inténtelo de nuevo en unos minutos.'
            });
          resolve(false);
          console.log("error", error);
        }
      });
    });
  }

}
