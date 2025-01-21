import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';
import { SelectModule } from 'primeng/select';
import { KeyValueOption } from '../../../../../shared/utils/models/form-builder.model';

@Component({
  selector: 'app-form-body-committe-member',
  imports: [CommonModule, ButtonModule, ProgressBarModule, SelectModule, FormsModule, InputTextModule,
    ReactiveFormsModule, InputNumberModule],
  templateUrl: './form-body-committe-member.component.html',
  styleUrl: './form-body-committe-member.component.css'
})
export class FormBodyCommitteMemberComponent {

  @Input() formGroup!: FormGroup;
  @Input() identificationTypeDataList: KeyValueOption[] = [];


}
