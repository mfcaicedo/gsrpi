import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { KeyValueOption } from '../../../../shared/utils/models/form-builder.model';
import { Application } from '../../../../shared/utils/models/applications-common.model';
import { AuthService } from '../../../../auth/auth.service';
import { ReviewApplicationsManagementUseCase } from '../../../domain/usecase/review-applications-management-usecase';
import { CreateInitialConfigurationUsecase } from '../../../../system-configuration/domain/usecase/create-initial-configuration-usecase';
import { ApplicationStatuses } from '../../../../shared/utils/enums/review-applications.enum';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-list-applications-review',
  imports: [CommonModule, ButtonModule, RouterModule, IconFieldModule, InputIconModule, InputTextModule,
    ToastModule, ConfirmDialogModule, TableModule, MessageModule, SelectModule, FormsModule, ReactiveFormsModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './list-applications-review.component.html',
  styleUrl: './list-applications-review.component.css'
})
export class ListApplicationsReviewComponent {

  @ViewChild('dt1') dt1!: Table;

  first = 0;
  rows = 5;

  configurationId: number = 0;
  facultyId: number = 0;

  applications: Partial<Application>[] = [];

  applicationTypes: KeyValueOption[] = [
    { key: 1, value: 'Base salarial - PM-FO-4-FOR-4' },
    { key: 2, value: 'Bonificación - PM-FO-4-FOR-3' },
  ];

  productionTypeDataList: KeyValueOption[] = [
    { key: 1, value: 'Trabajo, ensayo o artículo, de carácter científico,' },
  ];

  applicationStatusDataList: KeyValueOption[] = [
    {key: 1, value: ApplicationStatuses.SENT_TO_CPD},
    {key: 2, value: ApplicationStatuses.REVIEWED_BY_CPD_SECRETARY},
    {key: 3, value: ApplicationStatuses.RETURNED_IN_CPD},
    {key: 4, value: ApplicationStatuses.REVIEWED_BY_CPD_MEMBER},
    {key: 5, value: ApplicationStatuses.ENDORSED_BY_PRESIDENT_CPD},
    {key: 6, value: ApplicationStatuses.SEND_TO_CIARP},
  ];

  filterForm!: FormGroup;

  private readonly confirmationService = inject(ConfirmationService);
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);
  private readonly authService = inject(AuthService);
  private readonly reviewApplicationsManagementUseCase = inject(ReviewApplicationsManagementUseCase);
  private readonly configurationUseCase = inject(CreateInitialConfigurationUsecase);
  private readonly formBuilder = inject(FormBuilder);

  constructor() { 
    this.filterForm = this.formBuilder.group({});
  }

  async ngOnInit() {

    this.authService.getConfigurationId().subscribe((id: number) => {
      this.configurationId = id;
    });

    this.filterForm = this.formBuilder.group({
      applicationType: [null],
      productionType: [null],
      applicationStatus: [null],
    });

    await this.getConfigurationById();

    await this.getAllApplicationsByFacultyId();

  }

  get ApplicationStatus() {
    return ApplicationStatuses;
  }

  async getConfigurationById() {
    return new Promise<void>((resolve, reject) => {
      this.configurationUseCase.getConfigurationById(this.configurationId).subscribe({
        next: (response: any) => {
          this.facultyId = response.faculty.facultyId;
          resolve();
        },
        error: (error) => {
          this.messageService.add(
            {
              severity: 'error',
              summary: 'Error',
              detail: 'Ocurrió un error al obtener la configuración'
            });
          resolve();
        }
      });
    });
  }

  async getAllApplicationsByFacultyId() {
    return new Promise<void>((resolve, reject) => {
      this.reviewApplicationsManagementUseCase.getAllApplicationsByFacultyId(this.facultyId).subscribe({
        next: (response: any) => {
          if (response) {
            response.forEach((application: any) => {
              this.applications.push({
                applicationId: application.applicationId,
                applicationTypeCatId: application.applicationTypeCatId,
                applicationTypeName: String(this.applicationTypes.find(x => x.key === application.applicationTypeCatId)?.value || ''),
                createAt: application.createAt,
                department: application.department,
                production: application.production,
                applicationStatus: application.applicationStatus,
                teacherApplications: application.teacherApplications,
                nombresSolicitante: application.teacherApplications[0].teacher.person.firstName + ' ' +
                  application.teacherApplications[0].teacher.person.secondName +
                  ' ' + application.teacherApplications[0].teacher.person.firstLastName + ' ' +
                  application.teacherApplications[0].teacher.person.secondLastName,
              });
            });
          }
          resolve();
        },
        error: (error) => {
          this.messageService.add(
            {
              severity: 'error',
              summary: 'Error',
              detail: 'Ocurrió un error al obtener las solicitudes'
            });
          resolve();
        }

      });
    });

  }

  onSubmit() {

    const applicationType = this.filterForm.get('applicationType')?.value;
    const productionType = this.filterForm.get('productionType')?.value;
    const applicationStatus = this.filterForm.get('applicationStatus')?.value;

    if (applicationType) {
      this.dt1.filter(applicationType, 'applicationTypeName', 'equals');
    }
    if (productionType) {
      this.dt1.filter(productionType, 'production.productionType.name', 'contains');
    }
    if (applicationStatus) {
      this.dt1.filter(applicationStatus, 'applicationStatus.name', 'equals');
    }

  }

  cleanFilters() {
    this.filterForm.reset();
    this.dt1.filterGlobal('', 'contains');
    //reseteo de los filtros
    this.dt1.filters = {};
    this.dt1.clear();


  }

  next() {
    this.first = this.first + this.rows;
  }

  prev() {
    this.first = this.first - this.rows;
  }

  reset() {
    this.first = 0;
  }

  pageChange(event: { first: number; rows: number; }) {
    this.first = event.first;
    this.rows = event.rows;
  }

  isLastPage(): boolean {
    return this.applications ? this.first + this.rows >= this.applications.length : true;
  }

  isFirstPage(): boolean {
    return this.applications ? this.first === 0 : true;
  }

  search(event: Event) {
    const target = event.target as HTMLInputElement | null;
    if (target) {
      this.dt1.filterGlobal(target.value, 'contains');
    }
  }

  viewApplication(applicationId: number) {

    this.messageService.add(
      {
        severity: 'info',
        summary: 'Muy pronto estará disponible',
        detail: 'Esta funcionalidad estará disponible en la siguiente versión.'
      });

  }

  editApplication(applicationId: number) {

    this.messageService.add(
      {
        severity: 'info',
        summary: 'Muy pronto estará disponible',
        detail: 'Esta funcionalidad estará disponible en la siguiente versión.'
      });

  }

  deleteApplication(applicationId: number) {

    this.confirmationService.confirm({
      target: 'body' as unknown as EventTarget,
      message: '¿Está seguro(a) de eliminar la solicitud?',
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
        //Llamar al servicio para eliminar la solicitud
      },
    });

  }

  viewPdfCertificate(applicationId: number) {

    this.messageService.add(
      {
        severity: 'info',
        summary: 'Muy pronto estará disponible',
        detail: 'Esta funcionalidad estará disponible en la siguiente versión.'
      });

  }

  submitApplication(applicationId: number) {

    this.confirmationService.confirm({
      target: 'body' as unknown as EventTarget,
      message: '¿Está seguro(a) de remitir la solicitud?',
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
        //Llamar al servicio para enviar la solicitud
        await this.updateApplicationState(applicationId, ApplicationStatuses.SEND_TO_CIARP);
        await this.getAllApplicationsByFacultyId();
      },  
    });
  }

  async updateApplicationState(applicationId: number, applicationStatus: ApplicationStatuses) {

    return new Promise<void>((resolve, reject) => {

      this.reviewApplicationsManagementUseCase.updateApplicationState(applicationId,
        applicationStatus).subscribe({
          next: (response: any) => {
            //Mensaje de exito
            this.messageService.add({
              severity: 'success',
              summary: '¡Solicitud remitida!',
              detail: 'La solicitud ha sido remitida exitosamente.'
            });
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

}
