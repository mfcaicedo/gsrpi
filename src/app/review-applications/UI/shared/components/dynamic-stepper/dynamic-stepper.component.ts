import { KeyValue } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { StepperModule } from 'primeng/stepper';

@Component({
  selector: 'app-dynamic-stepper',
  imports: [StepperModule],
  templateUrl: './dynamic-stepper.component.html',
  styleUrl: './dynamic-stepper.component.css'
})
export class DynamicStepperComponent implements OnInit {

  @Input() steps: KeyValue<number, string>[] = [];
  @Input() activeCurrentStep = 0;
  @Input() isLinear = true;

  ngOnInit(): void {
    if (this.steps.length === 0) {
      this.steps = [
        { key: 1, value: 'Datos del solicitante' },
        { key: 2, value: 'Datos generales de la solicitud' },
        { key: 3, value: 'Datos específicos de la solicitud' },
        { key: 4, value: 'Trabajos relacionados' },
        { key: 5, value: 'Documentos' }
      ];
    }

  }

}
