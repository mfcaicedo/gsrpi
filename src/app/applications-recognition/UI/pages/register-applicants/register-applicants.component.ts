import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { KeyValueOption } from '../../../../shared/utils/models/form-builder.model';

@Component({
  selector: 'app-register-applicants',
  imports: [CommonModule, ButtonModule, ProgressBarModule, SelectModule, FormsModule, InputTextModule,
    ReactiveFormsModule, InputNumberModule, RouterModule, ToastModule, ConfirmDialogModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './register-applicants.component.html',
  styleUrl: './register-applicants.component.css'
})
export class RegisterApplicantsComponent implements OnInit {

  //TODO: Debe ser un servicio que traiga los datos de tipos de identificación
  identificationTypeDataList: KeyValueOption[] = [
    { key: 1, value: 'Cedula' },
    { key: 2, value: 'Tarjeta Identidad' },
    { key: 3, value: 'Cedula extrangera' },
    { key: 4, value: 'Pasaporte' }
  ];

  departmentDataList: KeyValueOption[] = [
    { key: 1, value: 'Ingeniería de Sistemas' },
    { key: 2, value: 'Ingenería Automática Industrial' },
    { key: 3, value: 'Ingeniería Electrónica y Telecomunicaciones' },
    { key: 4, value: 'Telemática' }
  ];

  isDisabledNextStep = true;
  registerApplicantForm!: FormGroup;

  private readonly formBuilder = inject(FormBuilder);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly router = inject(Router);

  ngOnInit() {

    this.registerApplicantForm = this.formBuilder.group({
      totalNumberAuthors: [undefined, [Validators.required]],
      firstName: ['', [Validators.required]],
      middleName: ['', []],
      firstLastName: ['', [Validators.required]],
      secondLastName: ['', []],
      identificationType: [undefined, [Validators.required]],
      identificationNumber: [undefined, [Validators.required]],
      cellphone: [undefined, [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      departmentFaculty: [undefined, [Validators.required]],

    });

  }

  onSubmit() {
    console.log("values", this.registerApplicantForm.value);
    //TODO: Enviar datos al servicio para guardar el miembro del CIARP

    //2. Activo el boton siguiente 
    this.isDisabledNextStep = false;
  }

  modalNewApplicantOrNextStep(event: Event) {
    console.log("si");
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: '¿Desea agregar otro autor solicitante?',
      header: 'Confirmación',
      closable: true,
      closeOnEscape: true,
      icon: 'pi pi-info-circle',
      rejectButtonProps: {
        label: 'No, continuar',
        severity: 'secondary',
        outlined: true,

      },
      acceptButtonProps: {
        label: 'Aceptar',
      },
      accept: () => {
        console.log("acept button modal");
        //TODO: Permancer en la misma pagina
      },
      reject: () => {
        console.log("reject button modal");
        this.router.navigate(['solicitudes-reconocimiento/registrar-datos-generales-produccion/step-3']);
      },
    });
  }

}
