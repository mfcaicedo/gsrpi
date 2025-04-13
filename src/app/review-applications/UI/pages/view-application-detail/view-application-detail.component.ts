import { Component, inject, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { lastValueFrom } from 'rxjs';
import ENVIRONMENTS from '../../../../../environments/config';
import { ApplicationRecognized } from '../../../../applications-recognition/domain/models/applications.model';
import { ApplicationManagementUseCase } from '../../../../applications-recognition/domain/usecase/application-management-usecase';
import { AuthService } from '../../../../auth/auth.service';
import { RoleNames } from '../../../../auth/enums/roles.enum';
import { StepsReviewApplication, ApplicationStatuses, ValidationTypes } from '../../../../shared/utils/enums/review-applications.enum';
import { Application } from '../../../../shared/utils/models/applications-common.model';
import { KeyValueOption } from '../../../../shared/utils/models/form-builder.model';
import { UserManagementUseCase } from '../../../../user-management/domain/usecase/user-management-usecase';
import { ValidationApplication } from '../../../domain/models/validation.model';
import { ReviewApplicationsManagementUseCase } from '../../../domain/usecase/review-applications-management-usecase';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { FormBodyApplicantTeacherComponent } from '../../../../shared/components/form-body-applicant-teacher/form-body-applicant-teacher.component';
import { FormBodyGeneralProductionDataComponent } from '../../../../shared/components/form-body-general-production-data/form-body-general-production-data.component';
import { FormBodySpecificProductionDataMagazineComponent } from '../../../../shared/components/form-body-specific-production-data-magazine/form-body-specific-production-data-magazine.component';
import { ViewValidationDetailComponent } from '../../shared/components/view-validation-detail/view-validation-detail.component';
import { StepperModule } from 'primeng/stepper';
import { DynamicStepperComponent } from '../../shared/components/dynamic-stepper/dynamic-stepper.component';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-view-application-detail',
  imports: [CommonModule, ButtonModule, ProgressBarModule, SelectModule, FormsModule, InputTextModule,
    ReactiveFormsModule, RouterModule, ToastModule, ConfirmDialogModule, FormBodyApplicantTeacherComponent,
    RadioButtonModule, TextareaModule, FormBodyGeneralProductionDataComponent, InputNumberModule,
    FormBodySpecificProductionDataMagazineComponent, TableModule, IconFieldModule, InputIconModule, DialogModule,
    ViewValidationDetailComponent, StepperModule, DynamicStepperComponent, MessageModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './view-application-detail.component.html',
  styleUrl: './view-application-detail.component.css'
})
export class ViewApplicationDetailComponent {

  @ViewChild('dt1') dt1!: Table;

  applicationTypes: KeyValueOption[] = [
    { key: 1, value: 'Base salarial - PM-FO-4-FOR-4' },
    { key: 2, value: 'Bonificación - PM-FO-4-FOR-3' },
  ];

  //TODO: Debe ser un servicio que traiga los datos de tipos de identificación
  identificationTypeDataList: KeyValueOption[] = [
    { key: 1, value: 'Cedula' },
    { key: 2, value: 'Tarjeta Identidad' },
    { key: 3, value: 'Cedula extrangera' },
    { key: 4, value: 'Pasaporte' }
  ];

  departmentDataList: KeyValueOption[] = [
    { key: 1, value: 'Ingeniería de Sistemas' },
    { key: 2, value: 'Ingenería Automática Industrial' },
    { key: 3, value: 'Ingeniería Electrónica y Telecomunicaciones' },
    { key: 4, value: 'Telemática' }
  ];

  typeOfLinkageDataList: KeyValueOption[] = [
    { key: 1, value: 'Planta' },
    { key: 2, value: 'Ocasional' },
    // { key: 3, value: 'Catedra' },
  ];

  approvalDataList: KeyValueOption[] = [
    { key: 'true', value: 'Correcta' },
    { key: 'false', value: 'Incorrecta' },
  ];

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

  productionTypeDataList: KeyValueOption[] = [
    { key: 1, value: 'Trabajo, ensayo o artículo, de carácter científico, técnico, ...' },
  ];

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

  //Consultar de la base de datos
  validationTypesDataList: KeyValueOption[] = [
    { key: 1, value: 'validacion_datos_personales_solicitante' },
    { key: 2, value: 'validacion_solicitud_reconocimiento' },
    { key: 3, value: 'validacion_produccion_dependiente_tipo' },
    { key: 4, value: 'validacion_solicitudes_reconocidas_relacionadas_solicitud_actual' },
    { key: 5, value: 'validacion_archivos_produccion' },
  ];

  first = 0;
  rows = 5;
  applicationsRecognized: ApplicationRecognized[] = [];

  registerForm!: FormGroup;
  isDisabledNextStep = true;
  isValidFormInStep = false;
  userId: number = 0;
  personId: number = 0;
  teacherId: number = 0;
  isUpdate: boolean = false;
  responseBodyApplication: Partial<Application> = {};
  applicationId: number = 0;

  validationForm!: FormGroup;
  requestValidation: Partial<ValidationApplication> = {};
  validationsResponse: Partial<ValidationApplication[]> = [];

  stepMap = new Map([
    [StepsReviewApplication.STEP_1_PERSONAL_INFORMATION_APPLICANT, StepsReviewApplication.STEP_2_APPLICATION_RECOGNITION],
    [StepsReviewApplication.STEP_2_APPLICATION_RECOGNITION, StepsReviewApplication.STEP_3_PRODUCTION_BY_TYPE],
    [StepsReviewApplication.STEP_3_PRODUCTION_BY_TYPE, StepsReviewApplication.STEP_4_APPLICATON_RECOGNIZED],
    [StepsReviewApplication.STEP_4_APPLICATON_RECOGNIZED, StepsReviewApplication.STEP_5_DOCUMENTS]
  ]);
  beforeStepMap = new Map([
    [StepsReviewApplication.STEP_2_APPLICATION_RECOGNITION, StepsReviewApplication.STEP_1_PERSONAL_INFORMATION_APPLICANT],
    [StepsReviewApplication.STEP_3_PRODUCTION_BY_TYPE, StepsReviewApplication.STEP_2_APPLICATION_RECOGNITION],
    [StepsReviewApplication.STEP_4_APPLICATON_RECOGNIZED, StepsReviewApplication.STEP_3_PRODUCTION_BY_TYPE],
    [StepsReviewApplication.STEP_5_DOCUMENTS, StepsReviewApplication.STEP_4_APPLICATON_RECOGNIZED]
  ]);
  currentStep: StepsReviewApplication = StepsReviewApplication.STEP_1_PERSONAL_INFORMATION_APPLICANT;

  isDialogVisible = false;
  pdfPath: SafeResourceUrl = '';
  fileBlobProduct: any;
  fileBlobHomologation: any;
  pdfTitle = '';

  applicationStatus: ApplicationStatuses = ApplicationStatuses.NONE;
  isCorrectValidation = false;
  disabledButtonAcceptApplication = true;

  role: string = '';

  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router)
  private readonly activedRoute = inject(ActivatedRoute);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);
  private readonly applicationManagementUseCase = inject(ApplicationManagementUseCase);
  private readonly reviewApplicationsManagementUseCase = inject(ReviewApplicationsManagementUseCase);
  private readonly userManagementUseCase = inject(UserManagementUseCase);
  private readonly authService = inject(AuthService);
  private readonly sanitizer = inject(DomSanitizer);

  get StepsReviewApplication() {
    return StepsReviewApplication;
  }

  get ValidationTypes() {
    return ValidationTypes;
  }

  get RoleNames() {
    return RoleNames;
  }

  async ngOnInit() {

    this.activedRoute.params.subscribe(async params => {
      this.applicationId = params['id'] ?? 0;
    });

    this.registerForm = this.formBuilder.group({
      applicationType: [undefined, [Validators.required]],
      totalNumberAuthors: [undefined, [Validators.required]],
      //Applicant Information - step 1
      firstName: ['', [Validators.required]],
      middleName: ['', []],
      firstLastName: ['', [Validators.required]],
      secondLastName: ['', []],
      identificationType: [undefined, [Validators.required]],
      identificationNumber: [undefined, [Validators.required]],
      cellphone: [undefined, [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      departmentFaculty: [undefined, [Validators.required]],
      typeOfLinkage: [undefined, [Validators.required]],

      //General Production Data - step 2 
      title: ['', [Validators.required]],
      disciplinaryArea: ['', [Validators.required]],
      numberPages: [undefined, [Validators.required]],
      firstPage: [undefined, [Validators.required]],
      finalPage: [undefined, [Validators.required]],
      publicationMechanisms: [[], [Validators.required]],
      observations: ['', [Validators.minLength(3), Validators.maxLength(200)]],

      //Specific Production Data - step 3
      productionType: [undefined, [Validators.required]],
      magazineType: [undefined, [Validators.required]],
      doi: [undefined, []],
      issn: [undefined, [Validators.required]],
      publindexCategory: [undefined, [Validators.required]],
      startDate: [undefined, [Validators.required]],
      endDate: [undefined, [Validators.required]],
      articleType: [undefined, [Validators.required]],

    });

    //Visto bueno y observaciones step 1 - applicant information
    this.validationForm = this.formBuilder.group({
      approvalStep1: [undefined, [Validators.required]],
      observationsStep1: ['', []],
      approvalStep2: [undefined, [Validators.required]],
      observationsStep2: ['', [Validators.required]],
      approvalStep3: [undefined, [Validators.required]],
      observationsStep3: ['', [Validators.required]],
      approvalStep4: [undefined, [Validators.required]],
      observationsStep4: ['', []],
      approvalStep5: [undefined, [Validators.required]],
      observationsStep5: ['', []],

    });

    this.authService.getUserDataSession().subscribe((data: any) => {
      this.personId = data.personId;
      const roles = data.userRoles;
      this.role = roles[0].role.name;
    });

    //Cargamos informacion de la solicitud
    await this.getApplicationReviewById(this.applicationId);
    if (this.responseBodyApplication.production?.productionFiles?.[0]) {
      this.responseBodyApplication.production.productionFiles[0].fileMetadata = await this.getFileById(this.responseBodyApplication.production.productionFiles[0].fileId ?? 0);
    }
    if (this.responseBodyApplication.production?.productionFiles?.[1]) {
      this.responseBodyApplication.production.productionFiles[1].fileMetadata = await this.getFileById(this.responseBodyApplication.production.productionFiles[1].fileId ?? 0);
    }

    //Cargar todas las validaciones de la solicitud
    await this.getApplicationReviewByApplicationId();
    this.autoCompleteFormValidation();

  }

  async getApplicationReviewById(applicationId: number) {

    return new Promise<void>((resolve, reject) => {
      this.applicationManagementUseCase.getApplicationById(applicationId).subscribe({
        next: (response: any) => {
          this.responseBodyApplication = response;
          this.autoCompleteFormApplication();
          this.currentStep = StepsReviewApplication.STEP_1_PERSONAL_INFORMATION_APPLICANT;

          resolve();
        },
        error: (error) => {
          console.error("error", error);
          reject();
        }
      });
    });

  }

  autoCompleteFormValidation() {

    this.validationForm.patchValue({
      approvalStep1: this.validationsResponse.find(
        (item) => item?.validationType?.validationTypeName === ValidationTypes.VALIDATION_PERSONAL_INFORMATION_APPLICANT)?.validationState.toString(),
      observationsStep1: this.validationsResponse.find(
        (item) => item?.validationType?.validationTypeName === ValidationTypes.VALIDATION_PERSONAL_INFORMATION_APPLICANT)?.observations,
      approvalStep2: this.validationsResponse.find(
        (item) => item?.validationType?.validationTypeName === ValidationTypes.VALIDATION_APPLICATION_RECOGNITION)?.validationState.toString(),
      observationsStep2: this.validationsResponse.find(
        (item) => item?.validationType?.validationTypeName === ValidationTypes.VALIDATION_APPLICATION_RECOGNITION)?.observations,
      approvalStep3: this.validationsResponse.find(
        (item) => item?.validationType?.validationTypeName === ValidationTypes.VALIDATION_DEPENDENT_PRODUCTION_TYPE)?.validationState.toString(),
      observationsStep3: this.validationsResponse.find(
        (item) => item?.validationType?.validationTypeName === ValidationTypes.VALIDATION_DEPENDENT_PRODUCTION_TYPE)?.observations,
      approvalStep4: this.validationsResponse.find(
        (item) => item?.validationType?.validationTypeName === ValidationTypes.VALIDATION_RECOGNIZED_APPLICATIONS_RELATED_TO_CURRENT_APPLICATION)?.validationState.toString(),
      observationsStep4: this.validationsResponse.find(
        (item) => item?.validationType?.validationTypeName === ValidationTypes.VALIDATION_RECOGNIZED_APPLICATIONS_RELATED_TO_CURRENT_APPLICATION)?.observations,
      approvalStep5: this.validationsResponse.find(
        (item) => item?.validationType?.validationTypeName === ValidationTypes.VALIDATION_PRODUCTION_FILES)?.validationState.toString(),
      observationsStep5: this.validationsResponse.find(
        (item) => item?.validationType?.validationTypeName === ValidationTypes.VALIDATION_PRODUCTION_FILES)?.observations,
    });

    this.validationForm.disable();
  }

  autoCompleteFormApplication() {

    const jsonDataSpecificProductionData = JSON.parse(this.responseBodyApplication.production?.dataJson ?? '{}');

    this.registerForm.patchValue({
      applicationType: this.responseBodyApplication.applicationTypeCatId,
      totalNumberAuthors: this.responseBodyApplication.numberOfAuthors,
      //Applicant Information - step 1
      firstName: this.responseBodyApplication.teacherApplications?.[0].teacher?.person?.firstName,
      middleName: this.responseBodyApplication.teacherApplications?.[0].teacher?.person?.secondName,
      firstLastName: this.responseBodyApplication.teacherApplications?.[0].teacher?.person?.firstLastName,
      secondLastName: this.responseBodyApplication.teacherApplications?.[0].teacher?.person?.secondLastName,
      identificationType: this.responseBodyApplication.teacherApplications?.[0].teacher?.person?.identificationTypeCatId,
      identificationNumber: this.responseBodyApplication.teacherApplications?.[0].teacher?.person?.identificationNumber,
      cellphone: this.responseBodyApplication.teacherApplications?.[0].teacher?.person?.phone,
      email: this.responseBodyApplication.teacherApplications?.[0].teacher?.person?.email,
      departmentFaculty: this.responseBodyApplication.department?.departmentId,
      typeOfLinkage: this.responseBodyApplication.teacherApplications?.[0].teacher?.typeOfLinkage,

      //General Production Data - step 2 
      title: this.responseBodyApplication.production?.workTitle,
      disciplinaryArea: this.responseBodyApplication.production?.disciplinaryArea,
      numberPages: this.responseBodyApplication.production?.numberOfPages,
      firstPage: this.responseBodyApplication.production?.startPage,
      finalPage: this.responseBodyApplication.production?.endPage,
      publicationMechanisms: this.responseBodyApplication.production?.publicationMechanism ?
        JSON.parse(this.responseBodyApplication.production?.publicationMechanism) : [],
      observations: this.responseBodyApplication.production?.observations,

      //Specific Production Data - step 3
      productionType: this.responseBodyApplication.production?.productionType?.typeProductionId,
      magazineType: jsonDataSpecificProductionData.magazineType,
      doi: jsonDataSpecificProductionData.doi,
      issn: jsonDataSpecificProductionData.issn,
      publindexCategory: jsonDataSpecificProductionData.publindexCategory,
      startDate: new Date(jsonDataSpecificProductionData.startDate),
      endDate: new Date(jsonDataSpecificProductionData.endDate),
      articleType: jsonDataSpecificProductionData.articleType,
    });

    this.registerForm.disable();
  }

  onSubmit() {

  }

  async getFileById(fileId: number) {

    return new Promise<any>((resolve, reject) => {
      this.reviewApplicationsManagementUseCase.getFileById(fileId).subscribe({
        next: (response: any) => {
          resolve(response);
        },
        error: (error) => {
          console.error("error", error);
          resolve({});
        }
      });
    });

  }

  async getApplicationReviewByApplicationId() {

    return new Promise<void>((resolve, reject) => {
      this.reviewApplicationsManagementUseCase.getApplicationReviewByApplicationId(this.applicationId).subscribe({
        next: (response: any) => {
          this.validationsResponse = response;
          resolve();
        },
        error: (error) => {
          console.error("error", error);
          reject();
        }
      });
    });
  }

  getValidationsStep(step: StepsReviewApplication) {

    switch (step) {
      case StepsReviewApplication.STEP_1_PERSONAL_INFORMATION_APPLICANT:
        return this.validationsResponse.filter(
          (item) => item?.validationType?.validationTypeName === ValidationTypes.VALIDATION_PERSONAL_INFORMATION_APPLICANT
        );
      case StepsReviewApplication.STEP_2_APPLICATION_RECOGNITION:
        return this.validationsResponse.filter(
          (item) => item?.validationType?.validationTypeName === ValidationTypes.VALIDATION_APPLICATION_RECOGNITION
        );
      case StepsReviewApplication.STEP_3_PRODUCTION_BY_TYPE:
        return this.validationsResponse.filter(
          (item) => item?.validationType?.validationTypeName === ValidationTypes.VALIDATION_DEPENDENT_PRODUCTION_TYPE
        );
      case StepsReviewApplication.STEP_4_APPLICATON_RECOGNIZED:
        return this.validationsResponse.filter(
          (item) => item?.validationType?.validationTypeName === ValidationTypes.VALIDATION_RECOGNIZED_APPLICATIONS_RELATED_TO_CURRENT_APPLICATION
        );
      case StepsReviewApplication.STEP_5_DOCUMENTS:
        return this.validationsResponse.filter(
          (item) => item?.validationType?.validationTypeName === ValidationTypes.VALIDATION_PRODUCTION_FILES
        );
      default:
        return [];
    }
  }

  enableNextValidation() {

    const nextStep = this.stepMap.get(this.currentStep);

    if (nextStep) {
      this.currentStep = nextStep;
      //Si se ha cargado la validacion de la solicitud isValidFormInStep es true y isDisabledNextStep es false
      if (this.isValidFormInStepMethod()) {
        this.isDisabledNextStep = false;
        this.isValidFormInStep = true;
      } else {
        //Deshabilito el boton de siguiente
        this.isDisabledNextStep = true;
        this.isValidFormInStep = false;
      }
    }

  }

  isValidFormInStepMethod(): boolean {

    switch (this.currentStep) {
      case StepsReviewApplication.STEP_1_PERSONAL_INFORMATION_APPLICANT:
        return this.validationForm.get('approvalStep1')?.value ? true : false;
      case StepsReviewApplication.STEP_2_APPLICATION_RECOGNITION:
        return this.validationForm.get('approvalStep2')?.value ? true : false;
      case StepsReviewApplication.STEP_3_PRODUCTION_BY_TYPE:
        return this.validationForm.get('approvalStep3')?.value ? true : false;
      case StepsReviewApplication.STEP_4_APPLICATON_RECOGNIZED:
        return this.validationForm.get('approvalStep4')?.value ? true : false;
      case StepsReviewApplication.STEP_5_DOCUMENTS:
        return this.validationForm.get('approvalStep5')?.value ? true : false;
    }
  }

  enableBeforeValidation() {

    //Si está en la validacion 1 de información personal del solicitante debe volver a la lista de solicitudes
    if (this.currentStep === StepsReviewApplication.STEP_1_PERSONAL_INFORMATION_APPLICANT) {
      switch (this.role) {
        case RoleNames.CPD_SECRETARY:
          this.router.navigate(['/revision-solicitudes/listar-solicitudes-revision']);
          return;
        case RoleNames.TEACHER:
          this.router.navigate(['/solicitudes-reconocimiento/listar-solicitudes']);
          return;
        case RoleNames.CPD_MEMBER:
          this.router.navigate(['/revision-solicitudes/listar-solicitudes-revision-comite']);
          return;
        case RoleNames.CIARP_MEMBER:
          this.router.navigate(['/revision-solicitudes/listar-solicitudes-revision-comite-ciarp']);
          return;
        case RoleNames.CIARP_SECRETARY:
          this.router.navigate(['/revision-solicitudes/listar-solicitudes-revision-ciarp']);
          return;
      }
    }

    const beforeStep = this.beforeStepMap.get(this.currentStep);

    if (beforeStep) {
      this.currentStep = beforeStep;
      //Si se ha cargado la validacion de la solicitud isValidFormInStep es true y isDisabledNextStep es false
      if (this.isValidFormInStepMethod()) {
        this.isDisabledNextStep = false;
        this.isValidFormInStep = true;
      } else {
        //Deshabilito el boton de siguiente
        this.isDisabledNextStep = true;
        this.isValidFormInStep = false;
      }
    }

  }

  async updateApplicationState(applicationStatus: ApplicationStatuses) {

    return new Promise<void>((resolve, reject) => {

      this.reviewApplicationsManagementUseCase.updateApplicationState(this.applicationId,
        applicationStatus).subscribe({
          next: (response: any) => {
            //Mensaje de exito
            this.messageService.add({
              severity: 'success',
              summary: '¡Solicitud avalada!',
              detail: 'La solicitud de reconocimiento ha sido avalada exitosamente.'
            });
            setTimeout(() => {
              this.router.navigate(['/revision-solicitudes/listar-solicitudes-revision-comite']);
            }, 3000);
            resolve();
          },
          error: (error) => {
            console.error("error", error);
            //Mensaje de error
            this.messageService.add({
              severity: 'error',
              summary: 'Ups, algo salió mal',
              detail: 'Tuvimos un problema al actualizar la solicitud de reconocimiento. Inténtelo de nuevo en unos minutos.'
            });
            resolve();
          }
        });

    });
  }

  async viewDetailPdf(name: string) {

    if (name === 'producto') {
      //Consulto el pdf del producto
      if (this.fileBlobProduct === undefined) {
        this.fileBlobProduct = await lastValueFrom(this.authService.getFile(ENVIRONMENTS.BUCKED_NAME,
          this.responseBodyApplication.production?.productionFiles?.[0]?.fileMetadata?.path ?? ''))
      }
      const url = URL.createObjectURL(this.fileBlobProduct.data ?? new Blob());
      this.pdfPath = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      this.pdfTitle = 'Producto';
      //Muestro el pdf
      this.isDialogVisible = true;

    } else if (name === 'copia-homologacion') {
      //Consulto el pdf de la copia de homologacion
      if (this.fileBlobHomologation === undefined) {
        this.fileBlobHomologation = await lastValueFrom(this.authService.getFile(ENVIRONMENTS.BUCKED_NAME,
          this.responseBodyApplication.production?.productionFiles?.[1]?.fileMetadata?.path ?? ''))
      }
      const url = URL.createObjectURL(this.fileBlobHomologation.data ?? new Blob());
      this.pdfPath = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      this.pdfTitle = 'Copia de clasificación/homologación';
      //Muestro el pdf 
      this.isDialogVisible = true;

    }

  }

  async downloadPdf(name: string) {

    if (name === 'producto') {
      //Validamos si el archivo existe 
      if (this.fileBlobProduct === undefined) {
        //consultamos el archivo
        this.fileBlobProduct = await lastValueFrom(this.authService.getFile(ENVIRONMENTS.BUCKED_NAME,
          this.responseBodyApplication.production?.productionFiles?.[0]?.fileMetadata?.path ?? ''));
      }
      const url = window.URL.createObjectURL(this.fileBlobProduct.data);
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.href = url;
      a.download = this.responseBodyApplication.production?.productionFiles?.[0]?.fileMetadata?.name ?? 'producto.pdf';
      a.click();
      window.URL.revokeObjectURL(url);
    } else if (name === 'copia-homologacion') {
      //Validamos si el archivo existe
      if (this.fileBlobHomologation === undefined) {
        //consultamos el archivo
        this.fileBlobHomologation = await lastValueFrom(this.authService.getFile(ENVIRONMENTS.BUCKED_NAME,
          this.responseBodyApplication.production?.productionFiles?.[1]?.fileMetadata?.path ?? ''));
      }
      const url = window.URL.createObjectURL(this.fileBlobHomologation.data);
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.href = url;
      a.download = this.responseBodyApplication.production?.productionFiles?.[1]?.fileMetadata?.name ?? 'copia-homologacion.pdf';
      a.click();
      window.URL.revokeObjectURL(url);
    }

  }

  pageChange(event: { first: number; rows: number; }) {
    this.first = event.first;
    this.rows = event.rows;
  }

  search(event: Event) {
    const target = event.target as HTMLInputElement | null;
    if (target) {
      this.dt1.filterGlobal(target.value, 'contains');
    }
  }

  endorseApplication() {

    this.confirmationService.confirm({
      target: 'body' as unknown as EventTarget,
      message: '¿Está seguro(a) de avalar la solicitud?',
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
        await this.updateApplicationState(ApplicationStatuses.ENDORSED_BY_PRESIDENT_CPD);
        //TODO: Se debe generar un oficio del aval de la solicitud en pdf y guardarlo en el bucket y asociarlo 
        //a la solicitud de reconocimiento
        //Esta acta la podrá ver y descargar el presidente y secretaria haciendo clic en ver acta
      },
    });

  }



}
