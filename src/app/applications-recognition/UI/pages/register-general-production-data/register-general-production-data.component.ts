import { Component, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { KeyValueOption } from '../../../../shared/utils/models/form-builder.model';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { CheckboxModule } from 'primeng/checkbox';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-register-general-production-data',
  imports: [CommonModule, ButtonModule, ProgressBarModule, SelectModule, FormsModule, InputTextModule,
    ReactiveFormsModule, InputNumberModule, RouterModule, ToastModule, ConfirmDialogModule, CheckboxModule,
    TextareaModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './register-general-production-data.component.html',
  styleUrl: './register-general-production-data.component.css'
})
export class RegisterGeneralProductionDataComponent {

  publicationMechanismsDataList: KeyValueOption[] = [
    { key: 1, value: 'Revista' },
    { key: 2, value: 'Internet' },
    { key: 3, value: 'Vídeo' },
    { key: 4, value: 'Producción cinematográfica' },
    { key: 5, value: 'Fonografía' },
    { key: 6, value: 'Discografía' },
    { key: 7, value: 'CD' },
    { key: 8, value: 'Medio magnético' }
  ];

  isDisabledNextStep = true;
  registerGeneralProductionDataForm!: FormGroup;

  private readonly formBuilder = inject(FormBuilder);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly router = inject(Router);

  ngOnInit() {

    this.registerGeneralProductionDataForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      disciplinaryArea: ['', [Validators.required]],
      numberPages: [undefined, [Validators.required]],
      firstPage: [undefined, [Validators.required]],
      finalPage: [undefined, [Validators.required]],
      publicationMechanisms: [[], [Validators.required]],
      observations: ['', [Validators.minLength(3), Validators.maxLength(200)]],

    });

  }

  onSubmit() {
    console.log("values", this.registerGeneralProductionDataForm.value);
    //TODO: Enviar datos al servicio para guardar el miembro del CIARP

    //2. Activo el boton siguiente 
    this.isDisabledNextStep = false;
  }

  modalNewApplicantOrNextStep(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: '¿Desea continuar al siguiente paso?',
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
      accept: () => {
        console.log("acept button modal");
        //TODO: Pasar a la siguiente pantalla - paso 4
        this.router.navigate(['solicitudes-reconocimiento/registrar-tipo-produccion/step-4']);
      },
      reject: () => {
        console.log("reject button modal");
      },
    });
  }

}
