import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';
import { SelectModule } from 'primeng/select';
import { KeyValueOption } from '../../../../shared/utils/models/form-builder.model';

@Component({
  selector: 'app-create-application',
  imports: [CommonModule, ButtonModule, ProgressBarModule, SelectModule, FormsModule, InputTextModule, 
    ReactiveFormsModule, RouterModule],
  templateUrl: './create-application.component.html',
  styleUrl: './create-application.component.css'
})
export class CreateApplicationComponent {

  departments: KeyValueOption[] = [
    { key: 1, value: 'Base salarial - PM-FO-4-FOR-4' },
    { key: 2, value: 'Bonificación - PM-FO-4-FOR-3' },
  ];

  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router)

  registerForm!: FormGroup;

  ngOnInit() {

    this.registerForm = this.formBuilder.group({
      applicationType: [undefined, [Validators.required]]
    });

  }

  onSubmit() {
    console.log("applicationType", this.registerForm.value);
    //TODO: Guardar en la tabla temporal por medio del serviicio back 

    //2. Redirigir a la siguiete pagina del siguiente paso 
    this.router.navigate(['/solicitudes-reconocimiento/registrar-solicitantes/step-2']);
  }

}
