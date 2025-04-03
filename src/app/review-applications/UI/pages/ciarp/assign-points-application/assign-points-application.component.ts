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
import { TeacherApplication } from '../../../../../shared/utils/models/applications-common.model';
import { ReviewApplicationsManagementUseCase } from '../../../../domain/usecase/review-applications-management-usecase';

@Component({
  selector: 'app-assign-points-application',
  imports: [CommonModule, ButtonModule, ProgressBarModule, SelectModule, FormsModule, InputTextModule,
    ReactiveFormsModule, RouterModule, ToastModule, ConfirmDialogModule, RadioButtonModule, TextareaModule,
    InputNumberModule, TableModule, IconFieldModule, InputIconModule, DialogModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './assign-points-application.component.html',
  styleUrl: './assign-points-application.component.css'
})
export class AssignPointsApplicationComponent {

  isValidForm: boolean = false;

  formGroupPoints!: FormGroup;

  applicationId = 0;
  teacherApplicationId = 0;
  recommendedPoints = 0;
  isNewAssignedPoints = false;
  isCorrectValidation = false;
  isDisabledAcceptApplication = true;

  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);
  private readonly router = inject(Router);
  private readonly activedRoute = inject(ActivatedRoute);
  private readonly formBuilder = inject(FormBuilder);
  private readonly reviewApplicationsManagementUseCase = inject(ReviewApplicationsManagementUseCase)

  ngOnInit(): void {

    this.activedRoute.params.subscribe(async params => {
      this.applicationId = params['applicationId'] ?? 0;
      this.teacherApplicationId = params['teacherApplicationId'] ?? 0;
    });

    this.formGroupPoints = this.formBuilder.group({
      points: [undefined, [Validators.min(1), Validators.max(100)]],
    });

    this.getPointsApplicationRecognition();

  }

  getPointsApplicationRecognition() {

    this.reviewApplicationsManagementUseCase.getPointsApplicationRecognition(this.teacherApplicationId).subscribe({
      next: (response: any) => {
        this.recommendedPoints = response.recommendedPoints;
      },
      error: (error) => {
        console.error("error", error);
      }
    });
  }

  onSubmit() {

    this.formGroupPoints.markAllAsTouched();
    if (this.formGroupPoints.invalid) {
      return;
    }

    this.isNewAssignedPoints = this.formGroupPoints.value.points > 0 ? true : false;
    //Modal de confirmación de guardar datos
    this.modalConfirmationSavePoints();

  }

  modalConfirmationSavePoints() {

    let message = `¿Está seguro(a) de asignar el puntaje ${this.recommendedPoints} recomendado a la solicitud?`;
    if (this.isNewAssignedPoints) {
      message = `¿Está seguro(a) de guardar el nuevo puntaje ${this.formGroupPoints.value.points} asignado a la solicitud?`;
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

        await this.saveAssignedPointsOfApplication();
      },
    });

  }

  async saveAssignedPointsOfApplication() {

    const requestBody: Partial<TeacherApplication> = {
      teacherApplicationId: this.teacherApplicationId,
      assignedPoints: this.isNewAssignedPoints ? this.formGroupPoints.value.points : this.recommendedPoints,
    }

    return new Promise<void>((resolve, reject) => {

      this.reviewApplicationsManagementUseCase.updatePointsApplicationRecognition(requestBody).subscribe({
        next: async (response: any) => {
          //Mensaje de exito
          this.messageService.add({
            severity: 'success',
            summary: '¡Registro exitoso!',
            detail: 'Los puntos han sido asignados y guardados exitosamente.'
          });
          resolve();

          //Se actualiza el estado de la solicitud a revisada
          await this.updateApplicationState();

        },
        error: (error) => {
          console.error("error", error);
          //Mensaje de error
          this.messageService.add({
            severity: 'error',
            summary: 'Ups, algo salió mal',
            detail: 'Tuvimos un problema al guardar los puntos. Inténtelo de nuevo en unos minutos.'
          });
          resolve();
        }
      });

    });

  }

  async updateApplicationState() {
    return new Promise<void>((resolve, reject) => {
      this.reviewApplicationsManagementUseCase.updateApplicationState(
        this.applicationId,
        ApplicationStatuses.REVIEWED_BY_CIARP_SECRETARY
      ).subscribe({
        next: async (response: any) => {
          resolve();
          //Redireccionar a la lista de solicitudes
          setTimeout(() => {
            this.router.navigate(['revision-solicitudes/listar-solicitudes-revision-ciarp']);
          }, 3000);
        },
        error: (error) => {
          console.error("error", error);
          resolve();
        }
      });
    });
  }

  automaticCalculationPoints() {
    //TODO: Lógica para calcular los puntos automáticamente y asignarlos al campo de puntos
    this.formGroupPoints.patchValue({
      points: 4
    });
  }

}
