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
import { AuthService } from '../../../../auth/auth.service';
import { Application } from '../../../../shared/utils/models/applications-common.model';
import { KeyValueOption } from '../../../../shared/utils/models/form-builder.model';
import { CreateInitialConfigurationUsecase } from '../../../../system-configuration/domain/usecase/create-initial-configuration-usecase';
import { ReviewApplicationsManagementUseCase } from '../../../domain/usecase/review-applications-management-usecase';
import { ApplicationStatuses } from '../../../../shared/utils/enums/review-applications.enum';
import { RoleNames } from '../../../../auth/enums/roles.enum';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-list-applications-review-cpd-members',
  imports: [CommonModule, ButtonModule, RouterModule, IconFieldModule, InputIconModule, InputTextModule,
    ToastModule, ConfirmDialogModule, TableModule, MessageModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './list-applications-review-cpd-members.component.html',
  styleUrl: './list-applications-review-cpd-members.component.css'
})
export class ListApplicationsReviewCpdMembersComponent {

  @ViewChild('dt1') dt1!: Table;

  first = 0;
  rows = 5;

  configurationId = 0;
  facultyId = 0;

  applications: Partial<Application>[] = [];

  applicationTypes: KeyValueOption[] = [
    { key: 1, value: 'Base salarial - PM-FO-4-FOR-4' },
    { key: 2, value: 'Bonificación - PM-FO-4-FOR-3' },
  ];

  isCommitteeChairman = false;
  personId = 0;

  private readonly confirmationService = inject(ConfirmationService);
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);
  private readonly authService = inject(AuthService);
  private readonly reviewApplicationsManagementUseCase = inject(ReviewApplicationsManagementUseCase);
  private readonly configurationUseCase = inject(CreateInitialConfigurationUsecase);

  async ngOnInit() {

    this.authService.getConfigurationId().subscribe((id: number) => {
      this.configurationId = id;
    });

    await this.getConfigurationById();

    this.authService.getUserDataSession().subscribe((data: any) => {
      this.personId = data.personId;
      const roles = data.userRoles;
      roles.forEach((role: any) => {
        if (role.role.name == RoleNames.CPD_PRESIDENT) {
          this.isCommitteeChairman = true;
          return;
        }
      });
    });

    if (this.isCommitteeChairman) {
      await this.getAllApplicationsByFacultyId(ApplicationStatuses.REVIEWED_BY_CPD_MEMBER);
      await this.getAllApplicationsByFacultyId(ApplicationStatuses.ENDORSED_BY_PRESIDENT_CPD);

    } else {
      await this.getAllApplicationsByFacultyId(ApplicationStatuses.REVIEWED_BY_CPD_SECRETARY);
    }

  }

  get ApplicationStatuses() {
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

  async getAllApplicationsByFacultyId(applicationStatus: ApplicationStatuses) {
    return new Promise<void>((resolve, reject) => {
      this.reviewApplicationsManagementUseCase.getAllApplicationsByFacultyIdAndSpecificStatus(this.facultyId,
        applicationStatus).subscribe({
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

  viewPdfCertificate(applicationId: number) {

    this.messageService.add(
      {
        severity: 'info',
        summary: 'Muy pronto estará disponible',
        detail: 'Esta funcionalidad estará disponible en la siguiente versión.'
      });

  }

}