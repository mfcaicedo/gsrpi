import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { KeyValueOption } from '../../../../shared/utils/models/form-builder.model';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DatePickerModule } from 'primeng/datepicker';
import { AuthService } from '../../../../auth/auth.service';
import { UserManagementUseCase } from '../../../../user-management/domain/usecase/user-management-usecase';
import { ApplicationTempManagementUsecase } from '../../../domain/usecase/application-temp-management-usecase';
import { ApplicationTypeJsonStructureResponse } from '../../../domain/models/applications.model';
import { ApplicationManagementUseCase } from '../../../domain/usecase/application-management-usecase';
import { filter, firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-register-specific-production-data',
  imports: [CommonModule, ButtonModule, ProgressBarModule, SelectModule, FormsModule, InputTextModule,
    ReactiveFormsModule, InputNumberModule, RouterModule, ToastModule, ConfirmDialogModule, CheckboxModule,
    TextareaModule, RadioButtonModule, DatePickerModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './register-specific-production-data.component.html',
  styleUrl: './register-specific-production-data.component.css'
})
export class RegisterSpecificProductionDataComponent {

  articleTypeDataList: KeyValueOption[] = [
    { key: 1, value: 'Artículo tradicional "Full paper", completo y autónomo en su temática' },
    { key: 2, value: 'Comunicación corta "artículo corto"' },
    { key: 3, value: 'Reporte de caso' },
    { key: 4, value: 'Revisiones de tema' },
    { key: 5, value: 'Cartas Editor' },
    { key: 6, value: 'Editoriales' },
  ];

  magazineTypeDataList: KeyValueOption[] = [
    { key: 1, value: 'Internacional' },
    { key: 2, value: 'Nacional' },
  ];

  publindexCategoryDataList: KeyValueOption[] = [
    { key: 1, value: 'A1' },
    { key: 2, value: 'A2' },
    { key: 3, value: 'B' },
    { key: 4, value: 'C' },
  ];

  isDisabledNextStep = true;
  registerSpecificProductionDataForm!: FormGroup;
  userUid = '';
  userId = 0;
  personId = 0;
  teacherId = 0;
  applicationTempId = 0;
  productionTypeId = 0;

  applicationTypeJsonStructureResponse: ApplicationTypeJsonStructureResponse = {} as ApplicationTypeJsonStructureResponse;

  private readonly formBuilder = inject(FormBuilder);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);
  private readonly authService = inject(AuthService);
  private readonly userManagementUseCase = inject(UserManagementUseCase);
  private readonly applicationTempManagementUsecase = inject(ApplicationTempManagementUsecase);
  private readonly applicationManagementUseCase = inject(ApplicationManagementUseCase);

  async ngOnInit() {

    this.buildRegisterSpecificProductionDataForm();

    this.userUid = (await firstValueFrom(this.authService.getSession().pipe(filter(data => !!data)))).user.id as string;
    //1. Consultar usuario por uid 
    await this.getUserByUid();
    //2. Consultar persona por id de usuario
    await this.getPersonByUserId();
    //3. Consultar docente por id de persona
    await this.getTeacherByPersonId();

    await this.getApplicationTempByTeacherId();

    await this.getProductionTypeById();

  }

  buildRegisterSpecificProductionDataForm() {
    this.registerSpecificProductionDataForm = this.formBuilder.group({
      magazineType: [undefined, [Validators.required]],
      doi: [undefined, []],
      issn: [undefined, [Validators.required]],
      publindexCategory: [undefined, [Validators.required]],
      startDate: [undefined, [Validators.required]],
      endDate: [undefined, [Validators.required]],
      articleType: [undefined, [Validators.required]],
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
            this.productionTypeId = response.productionTypeId;
            this.autoCompleteForm(response.productionJsonData);
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

  async getProductionTypeById() {
    return new Promise((resolve) => {
      this.applicationManagementUseCase.getProductionTypeJsonStructureById(this.productionTypeId).subscribe({
        next: (response: any) => {
          this.applicationTypeJsonStructureResponse.jsonStructure = response.jsonStructure;
          resolve(true);
        },
        error: (error) => {
          resolve(false);
          console.log("error", error);
        }
      });
    });
  }

  autoCompleteForm(response: any) {

    if (response) {
      const data = JSON.parse(response);
      this.registerSpecificProductionDataForm.patchValue({
        magazineType: data.magazineType,
        doi: data.doi,
        issn: data.issn,
        publindexCategory: data.publindexCategory,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        articleType: data.articleType,
      });
      this.isDisabledNextStep = false;
    }

  }

  onSubmit() {

    this.registerSpecificProductionDataForm.markAllAsTouched();
    if (this.registerSpecificProductionDataForm.invalid) {
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

    const bodyRequest = JSON.parse(this.applicationTypeJsonStructureResponse.jsonStructure);
    bodyRequest.magazineType = this.registerSpecificProductionDataForm.value.magazineType;
    bodyRequest.doi = this.registerSpecificProductionDataForm.value.doi;
    bodyRequest.issn = this.registerSpecificProductionDataForm.value.issn;
    bodyRequest.publindexCategory = this.registerSpecificProductionDataForm.value.publindexCategory;
    bodyRequest.startDate = this.registerSpecificProductionDataForm.value.startDate;
    bodyRequest.endDate = this.registerSpecificProductionDataForm.value.endDate;
    bodyRequest.articleType = this.registerSpecificProductionDataForm.value.articleType;

    return new Promise((resolve) => {
      this.applicationTempManagementUsecase.updateApplicationTemp(
        {
          applicationTempId: this.applicationTempId,
          productionJsonData: JSON.stringify(bodyRequest)
        }
      ).subscribe({
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
