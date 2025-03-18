import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
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
import { ReviewApplicationsManagementUseCase } from '../../../domain/usecase/review-applications-management-usecase';
import { TeacherApplication } from '../../../../shared/utils/models/applications-common.model';

@Component({
  selector: 'app-recommend-points-application',
  imports: [CommonModule, ButtonModule, ProgressBarModule, SelectModule, FormsModule, InputTextModule,
    ReactiveFormsModule, RouterModule, ToastModule, ConfirmDialogModule, RadioButtonModule, TextareaModule,
    InputNumberModule, TableModule, IconFieldModule, InputIconModule, DialogModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './recommend-points-application.component.html',
  styleUrl: './recommend-points-application.component.css'
})
export class RecommendPointsApplicationComponent implements OnInit {

  isValidForm: boolean = false;

  formGroupPoints!: FormGroup;

  teacherApplicationId: number = 0;

  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);
  private readonly router = inject(Router);
  private readonly activedRoute = inject(ActivatedRoute);
  private readonly formBuilder = inject(FormBuilder);
  private readonly reviewApplicationsManagementUseCase = inject(ReviewApplicationsManagementUseCase)

  ngOnInit(): void {

    this.activedRoute.params.subscribe(async params => {
      this.teacherApplicationId = params['id'] ?? 0;
    });

    this.formGroupPoints = this.formBuilder.group({
      points: [undefined, [Validators.required, Validators.min(1), Validators.max(100)]],
    });
  }

  onSubmit() {

    this.formGroupPoints.markAllAsTouched();
    if (this.formGroupPoints.invalid) {
      return;
    }

    //Modal de confirmación de guardar datos
    this.modalConfirmationSavePoints();

  }

  modalConfirmationSavePoints() {

    this.confirmationService.confirm({
      target: 'body' as unknown as EventTarget,
      message: '¿Está seguro(a) de guardar los puntos recomendados a la solicitud?',
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

        await this.saveValidationOfApplication();

      },
    });

  }

  async saveValidationOfApplication() {

    const requestBody: Partial<TeacherApplication> = {
      teacherApplicationId: this.teacherApplicationId,
      recommendedPoints: this.formGroupPoints.value.points,
      assignedPoints: this.formGroupPoints.value.points
    }

    return new Promise<void>((resolve, reject) => {

      this.reviewApplicationsManagementUseCase.savePointsApplicationRecognition(requestBody).subscribe({
        next: (response: any) => {
          //Mensaje de exito
          this.messageService.add({
            severity: 'success',
            summary: '¡Registro exitoso!',
            detail: 'La recomendación de puntos fue guardada exitosamente.'
          });
          resolve();
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

  automaticCalculationPoints() {
    this.formGroupPoints.patchValue({
      points: 4
    });
  }

}
