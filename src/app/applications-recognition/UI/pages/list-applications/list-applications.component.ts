import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { AuthService } from '../../../../auth/auth.service';
import { ApplicationManagementUseCase } from '../../../domain/usecase/application-management-usecase';
import { KeyValueOption } from '../../../../shared/utils/models/form-builder.model';
import { Application } from '../../../../shared/utils/models/applications-common.model';
import { RoleNames } from '../../../../auth/enums/roles.enum';
import { ApplicationStatuses } from '../../../../shared/utils/enums/review-applications.enum';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-list-applications',
  imports: [CommonModule, ButtonModule, RouterModule, IconFieldModule, InputIconModule, InputTextModule,
    ToastModule, ConfirmDialogModule, TableModule, MessageModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './list-applications.component.html',
  styleUrl: './list-applications.component.css'
})
export class ListApplicationsComponent {

  @ViewChild('dt1') dt1!: Table;

  first = 0;
  rows = 5;

  teacherId: number = 0;

  applications: Partial<Application>[] = [];

  applicationTypes: KeyValueOption[] = [
    { key: 1, value: 'Base salarial - PM-FO-4-FOR-4' },
    { key: 2, value: 'Bonificación - PM-FO-4-FOR-3' },
  ];

  role = '';

  private readonly confirmationService = inject(ConfirmationService);
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);
  private readonly authService = inject(AuthService);
  private readonly applicationManagementUseCase = inject(ApplicationManagementUseCase);

  get RoleNames() {
    return RoleNames;
  }
  get ApplicationStatuses() {
    return ApplicationStatuses;
  }

  async ngOnInit() {

    this.authService.getUserDataSession().subscribe(data => {
      this.teacherId = data.teacherId || 0;
    });

    this.authService.getUserDataSession().subscribe(data => {
      this.role = data.userRoles?.[0].role?.name || '';
    });

    await this.getAllApplicationsByTeacherId();

  }

  async getAllApplicationsByTeacherId() {
    return new Promise<void>((resolve, reject) => {
      this.applicationManagementUseCase.getAllAppicationsByTeacherId(this.teacherId).subscribe({
        next: (response: any) => {
          if (response) {
            response.forEach((application: any) => {
              this.applications.push({
                applicationId: application.applicationId,
                applicationTypeCatId: application.applicationTypeCatId,
                applicationTypeName: String(this.applicationTypes.find(x => x.key === application.applicationTypeCatId)?.value || ''),
                createAt: application.createAt,
                production: application.production,
                applicationStatus: application.applicationStatus
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

    this.router.navigate(['/revision-solicitudes/ver-detalle-solicitud', applicationId]);

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

}
