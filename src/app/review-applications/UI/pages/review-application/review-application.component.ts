import { Component, inject, OnInit } from '@angular/core';
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
import { ApplicationTemp } from '../../../../applications-recognition/domain/models/applications.model';
import { ApplicationTempManagementUsecase } from '../../../../applications-recognition/domain/usecase/application-temp-management-usecase';
import { AuthService } from '../../../../auth/auth.service';
import { UserManagementUseCase } from '../../../../user-management/domain/usecase/user-management-usecase';
import { StepsReviewApplication } from '../../../../shared/utils/enums/review-applications.enum';
import { FormBodyApplicantTeacherComponent } from '../../../../shared/components/form-body-applicant-teacher/form-body-applicant-teacher.component';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-review-application',
  imports: [CommonModule, ButtonModule, ProgressBarModule, SelectModule, FormsModule, InputTextModule,
    ReactiveFormsModule, RouterModule, ToastModule, ConfirmDialogModule, FormBodyApplicantTeacherComponent,
    RadioButtonModule, TextareaModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './review-application.component.html',
  styleUrl: './review-application.component.css'
})
export class ReviewApplicationComponent implements OnInit {

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

  registerForm!: FormGroup;
  isDisabledNextStep = false;
  userId: number = 0;
  personId: number = 0;
  teacherId: number = 0;
  isUpdate: boolean = false;
  requestBody: Partial<ApplicationTemp> = {};
  applicationTempId: number = 0;

  validationForm!: FormGroup;

  currentStep: StepsReviewApplication = StepsReviewApplication.STEP_1_PERSONAL_INFORMATION_APPLICANT;

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

    });

    //Visto bueno y observaciones
    this.validationForm = this.formBuilder.group({
      approval: [undefined, [Validators.required]],
      observations: ['', []],
    });

  }

  async onSubmit() {
    console.log("onSubmit");

  }

}
