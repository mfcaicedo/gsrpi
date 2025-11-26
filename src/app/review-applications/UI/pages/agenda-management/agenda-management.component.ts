import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
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

@Component({
  selector: 'app-agenda-management',
  imports: [CommonModule, ButtonModule, ProgressBarModule, SelectModule, FormsModule, InputTextModule,
    ReactiveFormsModule, InputNumberModule, RouterModule, ToastModule, ConfirmDialogModule, CheckboxModule,
    TextareaModule, RadioButtonModule, DatePickerModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './agenda-management.component.html',
  styleUrl: './agenda-management.component.css'
})
export class AgendaManagementComponent implements OnInit {

  registerAgendaForm!: FormGroup

  private readonly formBuilder = inject(FormBuilder);

  constructor() {
    this.registerAgendaForm = this.formBuilder.group({});
  }

  ngOnInit(): void {

    this.registerAgendaForm = this.formBuilder.group({
      startDate: [new Date('05-06-2025'), [Validators.required]],
      endDate: [new Date('06-23-2025'), [Validators.required]],
    });

  }

  onSubmit() {
    // Aquí puedes manejar el envío del formulario
    console.log(this.registerAgendaForm.value);
  }

  showModalFunctionalityNotAvailable() {
    
  }

}
