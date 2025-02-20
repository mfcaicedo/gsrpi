import { Component, Input } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { KeyValueOption } from '../../utils/models/form-builder.model';
import { CommonModule } from '@angular/common';
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
  selector: 'app-form-body-specific-production-data-magazine',
  imports: [CommonModule, ButtonModule, ProgressBarModule, SelectModule, FormsModule, InputTextModule,
    ReactiveFormsModule, InputNumberModule, RouterModule, ToastModule, ConfirmDialogModule, CheckboxModule,
    TextareaModule, RadioButtonModule, DatePickerModule],
  templateUrl: './form-body-specific-production-data-magazine.component.html',
  styleUrl: './form-body-specific-production-data-magazine.component.css'
})
export class FormBodySpecificProductionDataMagazineComponent {

  @Input() formGroup!: FormGroup;
  @Input() articleTypeDataList: KeyValueOption[] = [];
  @Input() magazineTypeDataList: KeyValueOption[] = [];
  @Input() publindexCategoryDataList: KeyValueOption[] = [];
  // @Input() productionTypeDataList: KeyValueOption[] = [];

}
