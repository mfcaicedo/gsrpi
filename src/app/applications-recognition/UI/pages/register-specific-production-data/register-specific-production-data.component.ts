import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { KeyValueOption } from '../../../../shared/utils/models/form-builder.model';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'app-register-specific-production-data',
  imports: [CommonModule, ButtonModule, ProgressBarModule, SelectModule, FormsModule, InputTextModule,
    ReactiveFormsModule, InputNumberModule, RouterModule, ToastModule, ConfirmDialogModule, CheckboxModule,
    TextareaModule, RadioButtonModule, DatePickerModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './register-specific-production-data.component.html',
  styleUrl: './register-specific-production-data.component.css'
})
export class RegisterSpecificProductionDataComponent {

  articleTypeDataList: KeyValueOption[] = [
    { key: 1, value: 'Artículo tradicional "Full paper", completo y autónimo en su temática' },
    { key: 2, value: 'Comunicación corta "artículo corto"' },
    { key: 3, value: 'Reporte de caso' },
    { key: 4, value: 'Revisiones de tema' },
    { key: 5, value: 'Cartas Editor' },
    { key: 6, value: 'Editoriales' },
  ];

  magazineTypeDataList: KeyValueOption[] = [
    { key: 1, value: 'Internacional' },
    { key: 2, value: 'Nacional' },
  ];

  publindexCategoryDataList: KeyValueOption[] = [
    { key: 1, value: 'A1' },
    { key: 2, value: 'A2' },
    { key: 3, value: 'B' },
    { key: 4, value: 'C' },
  ];

  isDisabledNextStep = true;
  registerSpecificProductionDataForm!: FormGroup;

  private readonly formBuilder = inject(FormBuilder);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly router = inject(Router);

  ngOnInit() {

    this.registerSpecificProductionDataForm = this.formBuilder.group({
      magazineType: [undefined, [Validators.required]],
      issn: [undefined, [Validators.required]],
      publindexCategory: [undefined, [Validators.required]],
      startDate: [undefined, [Validators.required]],
      endDate: [undefined, [Validators.required]],
      articleType: [undefined, [Validators.required]],

    });

  }

  onSubmit() {
    console.log("values", this.registerSpecificProductionDataForm.value);
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
        this.router.navigate(['solicitudes-reconocimiento/registrar-trabajos-relacionados/step-6']);
      },
      reject: () => {
        console.log("reject button modal");
      },
    });
  }

}
