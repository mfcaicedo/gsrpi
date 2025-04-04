import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';
import { SelectModule } from 'primeng/select';
import { KeyValueOption } from '../../../../shared/utils/models/form-builder.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ApplicationTempManagementUsecase } from '../../../domain/usecase/application-temp-management-usecase';
import { ApplicationTemp } from '../../../domain/models/applications.model';
import { UserManagementUseCase } from '../../../../user-management/domain/usecase/user-management-usecase';
import { AuthService } from '../../../../auth/auth.service';
import { ApplicationManagementUseCase } from '../../../domain/usecase/application-management-usecase';
import { filter, firstValueFrom, take } from 'rxjs';

@Component({
  selector: 'app-create-application',
  imports: [CommonModule, ButtonModule, ProgressBarModule, SelectModule, FormsModule, InputTextModule,
    ReactiveFormsModule, RouterModule, ToastModule, ConfirmDialogModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './create-application.component.html',
  styleUrl: './create-application.component.css'
})
export class CreateApplicationComponent {

  applicationTypes: KeyValueOption[] = [
    { key: 1, value: 'Base salarial - PM-FO-4-FOR-4' },
    { key: 2, value: 'Bonificación - PM-FO-4-FOR-3' },
  ];

  registerForm!: FormGroup;
  isDisabledNextStep = false;
  userUid: string = '';
  userId: number = 0;
  personId: number = 0;
  teacherId: number = 0;
  isUpdate: boolean = false;
  requestBody: Partial<ApplicationTemp> = {};
  applicationTempId: number = 0;

  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router)
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);
  private readonly applicationTempManagementUseCase = inject(ApplicationTempManagementUsecase);
  private readonly userManagementUseCase = inject(UserManagementUseCase);
  private readonly authService = inject(AuthService);

  async ngOnInit() {

    this.registerForm = this.formBuilder.group({
      applicationType: [undefined, [Validators.required]]
    });

    this.authService.getUserDataSession().subscribe(data => {
      this.userId = data.userId as number;
      this.personId = data.personId as number;
      this.teacherId = data.teacherId as number;
    });

    this.userUid = (await firstValueFrom(this.authService.getSession().pipe(filter(data => !!data)))).user.id as string;

    //Consulto el docente que hace la solicitud
    if (this.userId === 0) await this.getUserByUid();
    if (this.personId === 0) await this.getPersonByUserId();
    if (this.teacherId === 0) await this.getTeacherByPersonId();

    await this.getApplicationTempByTeacherId();


  }

  async onSubmit() {

    this.registerForm.markAllAsTouched();
    if (this.registerForm.invalid) {
      return;
    }

    if (this.teacherId === 0) {
      this.messageService.add(
        {
          severity: 'error',
          summary: 'Ups, algo salió mal',
          detail: 'No se encontró el docente que realiza la solicitud. Inténtelo de nuevo en unos minutos.'
        });
      return;
    }

    //Modal de confirmación de guardar datos 
    this.modalConfirmationSaveData();

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
      this.applicationTempManagementUseCase.getApplicationTempByTeacherId(this.teacherId).subscribe({
        next: (response: any) => {
          if (response !== null) {
            //Actualizar la solicitud en la tabla temporal
            this.isUpdate = true;
            this.applicationTempId = response.applicationTempId;
            this.autoCompleteForm(response.applicationTypeCatId);
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

  autoCompleteForm(applicationTypeCatId: number) {

    this.registerForm.patchValue({
      applicationType: this.applicationTypes.find(x => x.key === applicationTypeCatId)
    });
    this.isDisabledNextStep = true;

  }

  async saveApplicationTemp() {
    //TODO: Guardar en la tabla temporal por medio del serviicio back
    this.requestBody = {
      applicationTypeCatId: this.registerForm.value.applicationType.key,
      teacherId: this.teacherId,
    }

    return new Promise((resolve) => {
      this.applicationTempManagementUseCase.saveApplicationTemp(this.requestBody).subscribe({
        next: (response) => {

          this.messageService.add(
            {
              severity: 'success',
              summary: '¡Registro exitoso!',
              detail: 'Solicitud de reconocimiento creada exitosamente.'
            });
          resolve(true);
        },
        error: (error) => {
          this.messageService.add(
            {
              severity: 'error',
              summary: 'Ups, algo salió mal',
              detail: 'Tuvimos un problema al registrar la solicitud de reconocimiento. Inténtelo de nuevo en unos minutos.'
            });
          resolve(false);
          console.error("error", error);
        }
      });
    });
  }

  async updateApplicationTemp() {

    this.requestBody = {
      applicationTempId: this.applicationTempId,
      applicationTypeCatId: this.registerForm.value.applicationType.key,
    }

    return new Promise((resolve) => {
      this.applicationTempManagementUseCase.updateApplicationTemp(this.requestBody).subscribe({
        next: (response) => {
          this.registerForm.reset();

          this.messageService.add(
            {
              severity: 'success',
              summary: '¡Actualización exitosa!',
              detail: 'Solicitud de reconocimiento actualizada exitosamente.'
            });
          resolve(true);
        },
        error: (error) => {
          this.messageService.add(
            {
              severity: 'error',
              summary: 'Ups, algo salió mal',
              detail: 'Tuvimos un problema al actualizar la solicitud de reconocimiento. Inténtelo de nuevo en unos minutos.'
            });
          resolve(false);
          console.error("error", error);
        }
      });
    });
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
        //Guardar la solicitud en la tabla temporal
        if (this.isUpdate) {
          //Actualizar la solicitud en la tabla temporal
          await this.updateApplicationTemp();
        } else {
          //Guardar la solicitud en la tabla temporal
          await this.saveApplicationTemp();
        }
        //Habilitar el boton de siguiente paso
        this.isDisabledNextStep = true;
      },
    });
  }

}
