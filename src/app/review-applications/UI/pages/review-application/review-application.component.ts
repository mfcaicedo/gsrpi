import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { KeyValueOption } from '../../../../shared/utils/models/form-builder.model';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { ApplicationRecognized, ApplicationTemp } from '../../../../applications-recognition/domain/models/applications.model';
import { ApplicationTempManagementUsecase } from '../../../../applications-recognition/domain/usecase/application-temp-management-usecase';
import { AuthService } from '../../../../auth/auth.service';
import { UserManagementUseCase } from '../../../../user-management/domain/usecase/user-management-usecase';
import { StepsReviewApplication } from '../../../../shared/utils/enums/review-applications.enum';
import { FormBodyApplicantTeacherComponent } from '../../../../shared/components/form-body-applicant-teacher/form-body-applicant-teacher.component';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TextareaModule } from 'primeng/textarea';
import { FormBodyGeneralProductionDataComponent } from '../../../../shared/components/form-body-general-production-data/form-body-general-production-data.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormBodySpecificProductionDataMagazineComponent } from '../../../../shared/components/form-body-specific-production-data-magazine/form-body-specific-production-data-magazine.component';
import { Table, TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

@Component({
  selector: 'app-review-application',
  imports: [CommonModule, ButtonModule, ProgressBarModule, SelectModule, FormsModule, InputTextModule,
    ReactiveFormsModule, RouterModule, ToastModule, ConfirmDialogModule, FormBodyApplicantTeacherComponent,
    RadioButtonModule, TextareaModule, FormBodyGeneralProductionDataComponent, InputNumberModule,
    FormBodySpecificProductionDataMagazineComponent, TableModule, IconFieldModule, InputIconModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './review-application.component.html',
  styleUrl: './review-application.component.css'
})
export class ReviewApplicationComponent implements OnInit {

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
    { key: 1, value: 'Artículo tradicional "Full paper", completo y autónimo en su temática' },
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

  first = 0;
  rows = 5;
  applicationsRecognized: ApplicationRecognized[] = [];

  registerForm!: FormGroup;
  isDisabledNextStep = true;
  userId: number = 0;
  personId: number = 0;
  teacherId: number = 0;
  isUpdate: boolean = false;
  requestBody: Partial<ApplicationTemp> = {};
  applicationTempId: number = 0;

  validationForm!: FormGroup;

  currentStep: StepsReviewApplication = StepsReviewApplication.STEP_5_DOCUMENTS;

  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router)
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);
  private readonly applicationTempManagementUseCase = inject(ApplicationTempManagementUsecase);
  private readonly userManagementUseCase = inject(UserManagementUseCase);
  private readonly authService = inject(AuthService);

  get StepsReviewApplication() {
    return StepsReviewApplication;
  }

  async ngOnInit() {

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

    //Visto bueno y observaciones
    this.validationForm = this.formBuilder.group({
      approval: [undefined, [Validators.required]],
      observations: ['', []],
    });

  }

  async onSubmit() {
    console.log("onSubmit");
    this.isDisabledNextStep = false;

  }

  enableNextValidation() {
    console.log("enableNextValidation");
    this.currentStep = StepsReviewApplication.STEP_2_APPLICATION_RECOGNITION;
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


}
