import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { KeyValueOption } from '../../../domain/models/form-builder.model';
import { FormBodyCommitteMemberComponent } from '../../shared/components/form-body-committe-member/form-body-committe-member.component';

@Component({
  selector: 'app-register-ciarp-secretary',
  imports: [CommonModule, ButtonModule, ProgressBarModule, SelectModule, FormsModule, InputTextModule,
    ReactiveFormsModule, InputNumberModule, RouterModule, ToastModule, ConfirmDialogModule,
    FormBodyCommitteMemberComponent],
    providers: [ConfirmationService, MessageService],
  templateUrl: './register-ciarp-secretary.component.html',
  styleUrl: './register-ciarp-secretary.component.css'
})
export class RegisterCiarpSecretaryComponent {

  //TODO: Debe ser un servicio que traiga los datos de tipos de identificación
  identificationTypeDataList: KeyValueOption[] = [
    { key: 1, value: 'Cedula' },
    { key: 2, value: 'Tarjeta Identidad' },
    { key: 3, value: 'Cedula extrangera' },
    { key: 4, value: 'Pasaporte' }
  ];

  registerCiarpSecretaryForm!: FormGroup;

  private readonly formBuilder = inject(FormBuilder);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly router = inject(Router);

  ngOnInit() {

    this.registerCiarpSecretaryForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      middleName: ['', []],
      firstLastName: ['', [Validators.required]],
      secondLastName: ['', []],
      identificationType: [undefined, [Validators.required]],
      identificationNumber: [undefined, [Validators.required]],
      cellphone: [undefined, [Validators.required]],
      email: ['', [Validators.required, Validators.email]],

    });

  }

  onSubmit() {
    console.log("values", this.registerCiarpSecretaryForm.value);
    //TODO: Enviar datos al servicio para guardar la secretaria del CIARP

  }

  modalNewCpdMemberOrNextStep(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: '¿Desea agregar otro miembro del CIARP?',
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
        //TODO: Permancer en la misma pagina
      },
      reject: () => {
        console.log("reject button modal");
      },
    });
  }

}
