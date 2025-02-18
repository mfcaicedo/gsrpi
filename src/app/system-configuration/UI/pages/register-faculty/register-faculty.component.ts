import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { SelectModule } from 'primeng/select';
import { KeyValueOption } from '../../../../shared/utils/models/form-builder.model';
import { InputTextModule } from 'primeng/inputtext';
import { RouterModule } from '@angular/router';
import { ListFacultiesUsecase } from '../../../domain/usecase/list-faculties-usecase';
import { CreateInitialConfigurationUsecase } from '../../../domain/usecase/create-initial-configuration-usecase';
import { SystemConfigurationRequest } from '../../../domain/models/system-configuration.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../../../../auth/auth.service';

@Component({
  selector: 'app-register-faculty',
  imports: [CommonModule, ButtonModule, ProgressBarModule, SelectModule, FormsModule, InputTextModule,
    ReactiveFormsModule, RouterModule, ToastModule, ConfirmDialogModule],
  providers: [MessageService, ConfirmationService],
  templateUrl: './register-faculty.component.html',
  styleUrl: './register-faculty.component.css'
})
export class RegisterFacultyComponent implements OnInit {

  facultiesList: KeyValueOption[] = [];

  registerForm!: FormGroup;

  isDisabledNextStep = true;

  disabledOnSubmit = false;

  private readonly formBuilder = inject(FormBuilder);
  private readonly messageService = inject(MessageService);
  private readonly listFacultiesUseCase = inject(ListFacultiesUsecase);
  private readonly createConfigurationInitialUseCase = inject(CreateInitialConfigurationUsecase);
  private readonly authService = inject(AuthService)

  ngOnInit() {

    this.registerForm = this.formBuilder.group({
      faculty: [undefined, [Validators.required]]
    });

    this.getAllFaculties();

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

  onSubmit() {

    console.log("faculty", this.registerForm.value);
    //TODO: Guardar el departamento por medio del serviicio back 
    const configurationRequest: SystemConfigurationRequest = {
      faculty: {
        facultyId: this.registerForm.value.faculty.key,
        name: this.registerForm.value.faculty.value,
      }
    }
    this.createConfigurationInitialUseCase.createInitialConfiguration(configurationRequest).subscribe({
      next: (response: any) => {
        //Guardo el id de la configuración inicial 
        this.authService.saveConfigurationId(response?.configurationId);
        //Alerta de que se guardo correctamente
        this.messageService.add(
          {
            severity: 'success',
            summary: 'Configuración inicial creada',
            detail: 'La configuración inicial se ha creado exitosamente'
          });
        this.disabledOnSubmit = true;
      },
      error: (error) => {
        //Mensaje de error 
        this.messageService.add(
          {
            severity: 'error',
            summary: 'Ups, algo salió mal',
            detail: 'Ocurrió un error al crear la configuración inicial'
          });
      }
    });

    //1. Habilitar el siguiente paso
    this.isDisabledNextStep = false;

  }

}
