import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-terms-and-conditions',
  imports: [CommonModule, ButtonModule, ProgressBarModule, FormsModule, InputTextModule,
    ReactiveFormsModule, RouterModule, ToastModule, ConfirmDialogModule, CheckboxModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './terms-and-conditions.component.html',
  styleUrl: './terms-and-conditions.component.css'
})
export class TermsAndConditionsComponent {

  //TODO: Obtener el nombre del solicitante principal por medio de token o servicio de autenticación
  nameMainApplicant = 'Milthon Ferney Caicedo'; 

  isDisabledNextStep = true;
  termsAndConditionsForm!: FormGroup;

  private readonly formBuilder = inject(FormBuilder);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly router = inject(Router);

  ngOnInit() {

    this.termsAndConditionsForm = this.formBuilder.group({
      termsAndConditions: [undefined, [Validators.required]],
    });

  }

  onSubmit() {
    console.log("values", this.termsAndConditionsForm.value);
    //TODO: Enviar datos al servicio para guardar los terminos y condiciones en la tabla temporal

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
        this.router.navigate(['solicitudes-reconocimiento/subir-archivos/step-8']);
      },
      reject: () => {
        console.log("reject button modal");
      },
    });
  }

}
