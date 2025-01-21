import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { KeyValueOption } from '../../../../shared/utils/models/form-builder.model';

@Component({
  selector: 'app-register-related-works',
  imports: [CommonModule, ButtonModule, ProgressBarModule, SelectModule, FormsModule, InputTextModule,
    ReactiveFormsModule, InputNumberModule, RouterModule, ToastModule, ConfirmDialogModule, CheckboxModule,
    TextareaModule, RadioButtonModule, DatePickerModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './register-related-works.component.html',
  styleUrl: './register-related-works.component.css'
})
export class RegisterRelatedWorksComponent {

  isDisabledNextStep = true;
  registerRelatedWorksForm!: FormGroup;

  private readonly formBuilder = inject(FormBuilder);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly router = inject(Router);

  ngOnInit() {

    this.registerRelatedWorksForm = this.formBuilder.group({
      productionName: ['', [Validators.required]],
      resolution: ['', []],
      date: [undefined, [Validators.required]],
      authors: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],
    });

  }

  onSubmit() {
    console.log("values", this.registerRelatedWorksForm.value);
    //TODO: Enviar datos al servicio para guardar la información en la tabla temporal de la base de datos

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
        this.router.navigate(['solicitudes-reconocimiento/terminos-condiciones/step-7']);
      },
      reject: () => {
        console.log("reject button modal");
      },
    });
  }

}
