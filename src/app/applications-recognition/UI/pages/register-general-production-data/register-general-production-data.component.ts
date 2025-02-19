import { Component, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { KeyValueOption } from '../../../../shared/utils/models/form-builder.model';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { CheckboxModule } from 'primeng/checkbox';
import { TextareaModule } from 'primeng/textarea';
import { AuthService } from '../../../../auth/auth.service';
import { UserManagementUseCase } from '../../../../user-management/domain/usecase/user-management-usecase';
import { ApplicationTempManagementUsecase } from '../../../domain/usecase/application-temp-management-usecase';
import { ApplicationTemp } from '../../../domain/models/applications.model';
import { filter, firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-register-general-production-data',
  imports: [CommonModule, ButtonModule, ProgressBarModule, SelectModule, FormsModule, InputTextModule,
    ReactiveFormsModule, InputNumberModule, RouterModule, ToastModule, ConfirmDialogModule, CheckboxModule,
    TextareaModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './register-general-production-data.component.html',
  styleUrl: './register-general-production-data.component.css'
})
export class RegisterGeneralProductionDataComponent {

  publicationMechanismsDataList: KeyValueOption[] = [
    { key: 1, value: 'Revista' },
    { key: 2, value: 'Internet' },
    { key: 3, value: 'Vídeo' },
    { key: 4, value: 'Producción cinematográfica' },
    { key: 5, value: 'Fonografía' },
    { key: 6, value: 'Discografía' },
    { key: 7, value: 'CD' },
    { key: 8, value: 'Medio magnético' }
  ];

  isDisabledNextStep = true;
  registerGeneralProductionDataForm!: FormGroup;
  userUid = '';
  userId = 0;
  personId = 0;
  teacherId = 0;
  applicationTempId = 0;

  applicationTempResponse = {} as ApplicationTemp;

  private readonly formBuilder = inject(FormBuilder);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);
  private readonly authService = inject(AuthService);
  private readonly userManagementUseCase = inject(UserManagementUseCase);
  private readonly applicationTempManagementUsecase = inject(ApplicationTempManagementUsecase);

  async ngOnInit() {

    this.buildFormRegisterGeneralProductionData();

    this.userUid = (await firstValueFrom(this.authService.getSession().pipe(filter(data => !!data)))).user.id as string;
    //1. Consultar usuario por uid 
    await this.getUserByUid();
    //2. Consultar persona por id de usuario
    await this.getPersonByUserId();
    //3. Consultar docente por id de persona
    await this.getTeacherByPersonId();

    await this.getApplicationTempByTeacherId();

  }

  buildFormRegisterGeneralProductionData() {
    this.registerGeneralProductionDataForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      disciplinaryArea: ['', [Validators.required]],
      numberPages: [undefined, [Validators.required]],
      firstPage: [undefined, [Validators.required]],
      finalPage: [undefined, [Validators.required]],
      publicationMechanisms: [[], [Validators.required]],
      observations: ['', [Validators.minLength(3), Validators.maxLength(200)]],

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
            this.applicationTempResponse = response;
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

    this.registerGeneralProductionDataForm.patchValue({
      title: this.applicationTempResponse.productionTitle,
      disciplinaryArea: this.applicationTempResponse.productionDisciplinaryArea,
      numberPages: this.applicationTempResponse.productionNumberOfPages === 0 ? undefined :
        this.applicationTempResponse.productionNumberOfPages,
      firstPage: this.applicationTempResponse.productionStartPage === 0 ? undefined :
        this.applicationTempResponse.productionStartPage,
      finalPage: this.applicationTempResponse.productionEndPage === 0 ? undefined :
        this.applicationTempResponse.productionEndPage,
      publicationMechanisms: this.applicationTempResponse.productionPublicationMechanisms ?
        JSON.parse(this.applicationTempResponse.productionPublicationMechanisms) : [],
      observations: this.applicationTempResponse.productionObservations
    });

    if(this.applicationTempResponse.productionTitle) { //Valido con un campo obligatorio
      this.isDisabledNextStep = false;
    }

  }

  onSubmit() {

    this.registerGeneralProductionDataForm.markAllAsTouched();
    if (this.registerGeneralProductionDataForm.invalid) {
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
      productionTitle: this.registerGeneralProductionDataForm.value.title,
      productionDisciplinaryArea: this.registerGeneralProductionDataForm.value.disciplinaryArea,
      productionNumberOfPages: this.registerGeneralProductionDataForm.value.numberPages,
      productionStartPage: this.registerGeneralProductionDataForm.value.firstPage,
      productionEndPage: this.registerGeneralProductionDataForm.value.finalPage,
      productionPublicationMechanisms: JSON.stringify(this.registerGeneralProductionDataForm.value.publicationMechanisms),
      productionObservations: this.registerGeneralProductionDataForm.value.observations
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
