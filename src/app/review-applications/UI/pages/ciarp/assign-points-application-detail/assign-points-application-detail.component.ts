import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
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
import { TableModule } from 'primeng/table';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { ApplicationStatuses } from '../../../../../shared/utils/enums/review-applications.enum';
import { ReviewApplicationsManagementUseCase } from '../../../../domain/usecase/review-applications-management-usecase';
import { AuthService } from '../../../../../auth/auth.service';
import { RoleNames } from '../../../../../auth/enums/roles.enum';

@Component({
  selector: 'app-assign-points-application-detail',
  imports: [CommonModule, ButtonModule, ProgressBarModule, SelectModule, FormsModule, InputTextModule,
    ReactiveFormsModule, RouterModule, ToastModule, ConfirmDialogModule, RadioButtonModule, TextareaModule,
    InputNumberModule, TableModule, IconFieldModule, InputIconModule, DialogModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './assign-points-application-detail.component.html',
  styleUrl: './assign-points-application-detail.component.css'
})
export class AssignPointsApplicationDetailComponent {

  isValidForm: boolean = false;

  formGroupPoints!: FormGroup;

  applicationId = 0;
  teacherApplicationId = 0;
  assignedPoints = 0;
  isNewAssignedPoints = false;
  isCorrectValidation = false;
  isDisabledAcceptApplication = true;

  role = '';

  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);
  private readonly router = inject(Router);
  private readonly activedRoute = inject(ActivatedRoute);
  private readonly formBuilder = inject(FormBuilder);
  private readonly reviewApplicationsManagementUseCase = inject(ReviewApplicationsManagementUseCase)
  private readonly authService = inject(AuthService);

  get RoleNames() {
    return RoleNames
  }

  ngOnInit(): void {

    this.activedRoute.params.subscribe(async params => {
      this.applicationId = params['applicationId'] ?? 0;
      this.teacherApplicationId = params['teacherApplicationId'] ?? 0;
    });

    this.authService.getUserDataSession().subscribe((data: any) => {
      const roles = data.userRoles;
      this.role = roles[0].role.name;
    })

    this.formGroupPoints = this.formBuilder.group({
      points: [undefined, [Validators.min(1), Validators.max(100)]],
    });

    this.getPointsApplicationRecognition();

  }

  getPointsApplicationRecognition() {

    this.reviewApplicationsManagementUseCase.getPointsApplicationRecognition(this.teacherApplicationId).subscribe({
      next: (response: any) => {
        this.assignedPoints = response.assignedPoints;
      },
      error: (error) => {
        console.error("error", error);
      }
    });
  }

  modalConfirmationRejectOrEndorseAppication(endorse = true) {

    let message = `¿Está seguro(a) de avalar la solicitud?`;
    if (!endorse) {
      message = `¿Está seguro(a) de rechazar la solicitud?`;
    }

    this.confirmationService.confirm({
      target: 'body' as unknown as EventTarget,
      message: message,
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

        if (endorse) {
          await this.updateApplicationState(ApplicationStatuses.ENDORSED_CIARP);
        } else {
          await this.updateApplicationState(ApplicationStatuses.REJECTED_CIARP);
        }
      },
    });

  }

  async updateApplicationState(applicationStatus: ApplicationStatuses) {
    return new Promise<void>((resolve, reject) => {
      this.reviewApplicationsManagementUseCase.updateApplicationState(
        this.applicationId,
        applicationStatus
      ).subscribe({
        next: async (response: any) => {
          this.messageService.add({
            severity: 'success',
            summary: '¡Registro exitoso!',
            detail: 'La solicitud ha sido avalada exitosamente.'
          });
          resolve();
          //Redireccionar a la lista de solicitudes
          setTimeout(() => {
            this.router.navigate(['revision-solicitudes/listar-solicitudes-revision-comite-ciarp']);
          }, 3000);
        },
        error: (error) => {
          console.error("error", error);
          //Mensaje de error
          this.messageService.add({
            severity: 'error',
            summary: 'Ups, algo salió mal',
            detail: 'Tuvimos un problema al avalar la solicitud. Inténtelo de nuevo en unos minutos.'
          });
          resolve();
        }
      });
    });
  }

}
