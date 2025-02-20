import { Component, Input } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { KeyValueOption } from '../../utils/models/form-builder.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
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

@Component({
  selector: 'app-form-body-general-production-data',
  imports: [CommonModule, ButtonModule, ProgressBarModule, SelectModule, FormsModule, InputTextModule,
    ReactiveFormsModule, InputNumberModule, RouterModule, ToastModule, ConfirmDialogModule, CheckboxModule,
    TextareaModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './form-body-general-production-data.component.html',
  styleUrl: './form-body-general-production-data.component.css'
})
export class FormBodyGeneralProductionDataComponent {

  @Input() formGroup!: FormGroup;
  @Input() publicationMechanismsDataList: KeyValueOption[] = [];

}
