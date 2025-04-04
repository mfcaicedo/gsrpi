import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { KeyValueOption } from '../../../../shared/utils/models/form-builder.model';
import { AuthService } from '../../../../auth/auth.service';
import { UserManagementUseCase } from '../../../../user-management/domain/usecase/user-management-usecase';
import { ApplicationTempManagementUsecase } from '../../../domain/usecase/application-temp-management-usecase';
import { ApplicationRecognized, ApplicationTemp } from '../../../domain/models/applications.model';
import { ApplicationManagementUseCase } from '../../../domain/usecase/application-management-usecase';
import { Teacher } from '../../../../shared/utils/models/teacher-common.model';
import { filter, firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-register-related-works',
  imports: [CommonModule, ButtonModule, ProgressBarModule, SelectModule, FormsModule, InputTextModule,
    ReactiveFormsModule, InputNumberModule, RouterModule, ToastModule, ConfirmDialogModule, CheckboxModule,
    TextareaModule, RadioButtonModule, DatePickerModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './register-related-works.component.html',
  styleUrl: './register-related-works.component.css'
})
export class RegisterRelatedWorksComponent {

  isDisabledNextStep = true;
  registerRelatedWorksForm!: FormGroup;
  userUid = '';
  userId = 0;
  personId = 0;
  teacherId = 0;
  applicationTempId = 0;
  isUpdate: boolean = false;

  teacherResponse: Teacher = {} as Teacher;
  applicationRecognizedResponse: ApplicationRecognized = {} as ApplicationRecognized;

  private readonly formBuilder = inject(FormBuilder);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);
  private readonly authService = inject(AuthService);
  private readonly userManagementUseCase = inject(UserManagementUseCase);
  private readonly applicationTempManagementUsecase = inject(ApplicationTempManagementUsecase);
  private readonly applicationManagementUseCase = inject(ApplicationManagementUseCase);

  async ngOnInit() {

    this.buildRegisterRelatedWorksForm();

    this.userUid = (await firstValueFrom(this.authService.getSession().pipe(filter(data => !!data)))).user.id as string;
    //1. Consultar usuario por uid 
    await this.getUserByUid();
    //2. Consultar persona por id de usuario
    await this.getPersonByUserId();
    //3. Consultar docente por id de persona
    await this.getTeacherByPersonId();

    await this.getApplicationTempByTeacherId();

    await this.getApplicationRecognizedByApplicationId();

  }

  buildRegisterRelatedWorksForm() {
    this.registerRelatedWorksForm = this.formBuilder.group({
      productionName: ['', [Validators.required]],
      resolution: ['', []],
      date: [undefined, [Validators.required]],
      authors: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],
    });
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
          this.teacherResponse = response;
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
          if (response !== null) {
            //Actualizar la solicitud en la tabla temporal
            this.applicationTempId = response.applicationTempId;
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

  async getApplicationRecognizedByApplicationId() {

    return new Promise((resolve) => {
      this.applicationManagementUseCase.getApplicationRecognizedByApplicationId(this.applicationTempId).subscribe({
        next: (response: any) => {
          if (response !== null) {
            this.applicationRecognizedResponse = response;
            this.isUpdate = true;
            this.isDisabledNextStep = false;
            this.autoCompleteForm();
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

  autoCompleteForm() {
    this.registerRelatedWorksForm.patchValue({
      productionName: this.applicationRecognizedResponse.title,
      resolution: this.applicationRecognizedResponse.resolutionName,
      date: new Date(this.applicationRecognizedResponse.date),
      authors: this.applicationRecognizedResponse.authors
    });
  }

  onSubmit() {

    this.registerRelatedWorksForm.markAllAsTouched();
    if (this.registerRelatedWorksForm.invalid) {
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
        if (this.isUpdate) {
          await this.updateApplicationRecognized();
        } else {
          await this.createApplicationRecognized();
        }
      },
    });

  }

  async createApplicationRecognized() {

    const bodyRequest: ApplicationRecognized = {
      title: this.registerRelatedWorksForm.value.productionName,
      resolutionName: this.registerRelatedWorksForm.value.resolution,
      date: this.registerRelatedWorksForm.value.date,
      authors: this.registerRelatedWorksForm.value.authors,
      applicationId: this.applicationTempId,
      teacher: this.teacherResponse
    };

    return new Promise((resolve) => {
      this.applicationManagementUseCase.createApplicationRecognized(bodyRequest).subscribe({
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

  async updateApplicationRecognized() {

    const bodyRequest: ApplicationRecognized = {
      applicationRecognizedId: this.applicationRecognizedResponse.applicationRecognizedId,
      title: this.registerRelatedWorksForm.value.productionName,
      resolutionName: this.registerRelatedWorksForm.value.resolution,
      date: this.registerRelatedWorksForm.value.date,
      authors: this.registerRelatedWorksForm.value.authors,
      applicationId: this.applicationTempId,
      teacher: this.teacherResponse
    };

    return new Promise((resolve) => {
      this.applicationManagementUseCase.updateApplicationRecognized(bodyRequest).subscribe({
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
