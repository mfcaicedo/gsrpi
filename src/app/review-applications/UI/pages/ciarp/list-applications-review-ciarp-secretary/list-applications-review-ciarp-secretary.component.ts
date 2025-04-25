import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule, Table } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../../../../../auth/auth.service';
import { ApplicationStatuses } from '../../../../../shared/utils/enums/review-applications.enum';
import { Application } from '../../../../../shared/utils/models/applications-common.model';
import { KeyValueOption } from '../../../../../shared/utils/models/form-builder.model';
import { CreateInitialConfigurationUsecase } from '../../../../../system-configuration/domain/usecase/create-initial-configuration-usecase';
import { ReviewApplicationsManagementUseCase } from '../../../../domain/usecase/review-applications-management-usecase';
import { MessageModule } from 'primeng/message';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { ListFacultiesUsecase } from '../../../../../system-configuration/domain/usecase/list-faculties-usecase';
import { RoleNames } from '../../../../../auth/enums/roles.enum';

@Component({
  selector: 'app-list-applications-review-ciarp-secretary',
  imports: [CommonModule, ButtonModule, RouterModule, IconFieldModule, InputIconModule, InputTextModule,
    ToastModule, ConfirmDialogModule, TableModule, MessageModule, SelectModule, FormsModule, ReactiveFormsModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './list-applications-review-ciarp-secretary.component.html',
  styleUrl: './list-applications-review-ciarp-secretary.component.css'
})
export class ListApplicationsReviewCiarpSecretaryComponent {

  @ViewChild('dt1') dt1!: Table;

  first = 0;
  rows = 5;

  applications: Partial<Application>[] = [];

  applicationTypes: KeyValueOption[] = [
    { key: 1, value: 'Base salarial - PM-FO-4-FOR-4' },
    { key: 2, value: 'Bonificación - PM-FO-4-FOR-3' },
  ];

  productionTypeDataList: KeyValueOption[] = [
    { key: 1, value: 'Trabajo, ensayo o artículo, de carácter científico, técnico, ...' },
  ];

  facultiesList: KeyValueOption[] = [];

  applicationStatus: ApplicationStatuses = ApplicationStatuses.SEND_TO_CIARP;

  filterForm!: FormGroup;

  // role = '';

  private readonly confirmationService = inject(ConfirmationService);
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);
  private readonly authService = inject(AuthService);
  private readonly reviewApplicationsManagementUseCase = inject(ReviewApplicationsManagementUseCase);
  private readonly configurationUseCase = inject(CreateInitialConfigurationUsecase);
  private readonly formBuilder = inject(FormBuilder);
  private readonly listFacultiesUseCase = inject(ListFacultiesUsecase);

  constructor() {
    this.filterForm = this.formBuilder.group({});
  }

  get ApplicationStatus() {
    return ApplicationStatuses;
  }

  // get RoleNames() {
  //   return RoleNames;
  // }

  async ngOnInit() {

    this.filterForm = this.formBuilder.group({
      applicationType: [null],
      productionType: [null],
      faculty: [null],
    });

    // this.authService.getUserDataSession().subscribe((data: any) => {
    //   const roles = data.userRoles;
    //   this.role = roles[0].role.name;
    // })

    this.getAllFaculties();

    await this.getAllApplicationsBySpecificStatus();
    await this.getAllApplicationsBySpecificStatus(ApplicationStatuses.REVIEWED_BY_CIARP_SECRETARY);
    await this.getAllApplicationsBySpecificStatus(ApplicationStatuses.REVIEWED_BY_CIARP_MEMBER);
    await this.getAllApplicationsBySpecificStatus(ApplicationStatuses.ENDORSED_CIARP);
    await this.getAllApplicationsBySpecificStatus(ApplicationStatuses.REJECTED_CIARP);

  }

  getAllFaculties() {

    this.listFacultiesUseCase.getAllFaculties().subscribe({
      next: (response) => {
        this.facultiesList = response.map((faculty) => {
          return { key: faculty.facultyId, value: faculty.name };
        });
      },
      error: (error) => {
        console.error(error);
      }
    });

  }

  async getAllApplicationsBySpecificStatus(applicationStatus: ApplicationStatuses = ApplicationStatuses.SEND_TO_CIARP) {
    return new Promise<void>((resolve, reject) => {
      this.reviewApplicationsManagementUseCase.getAllApplicationsBySpecificStatus(applicationStatus).subscribe({
        next: (response: any) => {
          if (response) {
            response.forEach((application: any) => {
              this.applications.push({
                applicationId: application.applicationId,
                applicationTypeCatId: application.applicationTypeCatId,
                applicationTypeName: String(this.applicationTypes.find(x => x.key === application.applicationTypeCatId)?.value || ''),
                createAt: application.createAt,
                ciarpSendDate: application.ciarpSendDate,
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
    // console.log("form", this.filterForm.value);
    //TODO: Llamar al servicio para filtrar las solicitudes (Por el momento no hay datos para diferentes 
    // para filtrar) 

  }

  cleanFilters() {
    this.filterForm.reset();
    // this.getAllApplicationsBySpecificStatus();
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
        await this.getAllApplicationsBySpecificStatus();
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
