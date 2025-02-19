import { Component, Input } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { KeyValueOption } from '../../utils/models/form-builder.model';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';
import { SelectModule } from 'primeng/select';
import { RadioButtonModule } from 'primeng/radiobutton';

@Component({
  selector: 'app-form-body-applicant-teacher',
  imports: [CommonModule, ButtonModule, ProgressBarModule, SelectModule, FormsModule, InputTextModule,
    ReactiveFormsModule, InputNumberModule, RadioButtonModule],
  templateUrl: './form-body-applicant-teacher.component.html',
  styleUrl: './form-body-applicant-teacher.component.css'
})
export class FormBodyApplicantTeacherComponent {

  @Input() formGroup!: FormGroup;
  @Input() identificationTypeDataList: KeyValueOption[] = [];
  @Input() departmentDataList: KeyValueOption[] = [];
  @Input() typeOfLinkageDataList: KeyValueOption[] = [];

}
