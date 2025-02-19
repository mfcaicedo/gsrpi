import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
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
import { KeyValueOption } from '../../../../shared/utils/models/form-builder.model';
import { AuthService } from '../../../../auth/auth.service';
import { ApplicationTempManagementUsecase } from '../../../domain/usecase/application-temp-management-usecase';
import { UserManagementUseCase } from '../../../../user-management/domain/usecase/user-management-usecase';
import { ApplicationTemp, TeacherPersonUnifiedResponse } from '../../../domain/models/applications.model';
import { RadioButtonModule } from 'primeng/radiobutton';
import { filter, firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-register-applicants',
  imports: [CommonModule, ButtonModule, ProgressBarModule, SelectModule, FormsModule, InputTextModule,
    ReactiveFormsModule, InputNumberModule, RouterModule, ToastModule, ConfirmDialogModule, RadioButtonModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './register-applicants.component.html',
  styleUrl: './register-applicants.component.css'
})
export class RegisterApplicantsComponent implements OnInit {

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

  isDisabledNextStep = true;
  registerApplicantForm!: FormGroup;
  userUid = '';
  userId = 0;
  teacherResponse: TeacherPersonUnifiedResponse = {} as TeacherPersonUnifiedResponse;
  applicationTempId: number = 0;

  private readonly formBuilder = inject(FormBuilder);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);
  private readonly authService = inject(AuthService);
  private readonly userManagementUseCase = inject(UserManagementUseCase);
  private readonly applicationTempManagementUsecase = inject(ApplicationTempManagementUsecase);

  async ngOnInit() {

    this.buildFormRegisterApplicant();

    this.userUid = (await firstValueFrom(this.authService.getSession().pipe(filter(data => !!data)))).user.id as string;

    //1. Consultar usuario por uid 
    await this.getUserByUid();
    //2. Consultar persona por id de usuario
    await this.getPersonByUserId();
    //3. Consultar docente por id de persona
    await this.getTeacherByPersonId();

    await this.getApplicationTempByTeacherId();

  }

  buildFormRegisterApplicant() {
    this.registerApplicantForm = this.formBuilder.group({
      totalNumberAuthors: [undefined, [Validators.required]],
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
          this.teacherResponse.person = response;
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
      this.userManagementUseCase.getTeacherByPersonId(this.teacherResponse.person.personId).subscribe({
        next: (response: any) => {
          this.teacherResponse.teacher = response;
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
      this.applicationTempManagementUsecase.getApplicationTempByTeacherId(this.teacherResponse.teacher.teacherId).subscribe({
        next: (response: any) => {
          if (response !== null) {
            //Actualizar la solicitud en la tabla temporal
            this.applicationTempId = response.applicationTempId;
            this.autoCompleteForm(response.numberOfAuthors);
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

  autoCompleteForm(numberOfAuthors: number) {

    this.registerApplicantForm.patchValue({
      firstName: this.teacherResponse.person.firstName,
      middleName: this.teacherResponse.person.secondName,
      firstLastName: this.teacherResponse.person.firstLastName,
      secondLastName: this.teacherResponse.person.secondLastName,
      identificationType: this.teacherResponse.person.identificationTypeCatId,
      identificationNumber: this.teacherResponse.person.identificationNumber,
      cellphone: this.teacherResponse.person.phone,
      email: this.teacherResponse.person.email,
      departmentFaculty: this.teacherResponse.teacher.departmentId,
      typeOfLinkage: this.teacherResponse.teacher.typeOfLinkage,
      totalNumberAuthors: numberOfAuthors !== 0 ? numberOfAuthors : undefined,
    });

    this.registerApplicantForm.disable();
    this.registerApplicantForm.get('totalNumberAuthors')?.enable();

    if (numberOfAuthors !== 0) this.isDisabledNextStep = false;

  }

  onSubmit() {
    this.registerApplicantForm.markAllAsTouched();
    if (this.registerApplicantForm.invalid) {
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
      teacherId: this.teacherResponse.teacher.teacherId,
      numberOfAuthors: this.registerApplicantForm.value.totalNumberAuthors,
      departmentId: this.registerApplicantForm.getRawValue().departmentFaculty,
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
