import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ValidationApplication } from '../../../../domain/models/validation.model';

@Component({
  selector: 'app-view-validation-detail',
  imports: [CommonModule],
  templateUrl: './view-validation-detail.component.html',
  styleUrl: './view-validation-detail.component.css'
})
export class ViewValidationDetailComponent {

  @Input() validation: Partial<ValidationApplication> = {};

}
