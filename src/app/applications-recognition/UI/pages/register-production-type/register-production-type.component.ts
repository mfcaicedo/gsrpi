import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';
import { SelectModule } from 'primeng/select';
import { KeyValueOption } from '../../../../shared/utils/models/form-builder.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-register-production-type',
  imports: [CommonModule, ButtonModule, ProgressBarModule, SelectModule, FormsModule, InputTextModule,
    ReactiveFormsModule, RouterModule, ToastModule, ConfirmDialogModule],
    providers: [ConfirmationService, MessageService],
  templateUrl: './register-production-type.component.html',
  styleUrl: './register-production-type.component.css'
})
export class RegisterProductionTypeComponent {

  productionTypeDataList: KeyValueOption[] = [
    { key: 1, value: 'Trabajo, ensayo o artículo, de carácter científico, técnico, ...' },
  ];

  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router)
  private readonly confirmationService = inject(ConfirmationService);

  productionTypeRegisterForm!: FormGroup;

  isDisabledNextStep: boolean = true;

  ngOnInit() {

    this.productionTypeRegisterForm = this.formBuilder.group({
      productionType: [undefined, [Validators.required]]
    });

  }

  onSubmit() {
    console.log("productionType", this.productionTypeRegisterForm.value);
    //TODO: Guardar en la tabla temporal por medio del serviicio back 

    //2. Habilitar el boton de siguiente paso
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
        //TODO: Pasar a la siguiente pantalla - paso 5
        this.router.navigate(['solicitudes-reconocimiento/registrar-datos-especificos-produccion/step-5']);
      },
      reject: () => {
        console.log("reject button modal");
      },
    });
  }

}
