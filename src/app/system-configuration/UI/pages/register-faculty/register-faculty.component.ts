import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { SelectModule } from 'primeng/select';
import { KeyValueOption } from '../../../domain/models/form-builder.model';
import { InputTextModule } from 'primeng/inputtext';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register-faculty',
  imports: [CommonModule, ButtonModule, ProgressBarModule, SelectModule, FormsModule, InputTextModule, 
    ReactiveFormsModule, RouterModule],
  templateUrl: './register-faculty.component.html',
  styleUrl: './register-faculty.component.css'
})
export class RegisterFacultyComponent implements OnInit {

  departments: KeyValueOption[] = [
    { key: 1, value: 'FIET' },
    { key: 2, value: 'Humanidades' },
    { key: 3, value: 'Contables' },
    { key: 4, value: 'Ciencias exactas' }
  ];

  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router)

  registerForm!: FormGroup;

  ngOnInit() {

    this.registerForm = this.formBuilder.group({
      department: [undefined, [Validators.required]]
    });

  }

  onSubmit() {
    console.log("selectedDepartment", this.registerForm.value);
    //TODO: Guardar el departamento por medio del serviicio back 

    //2. Redirigir a la siguiete pagina del siguiente paso 
    this.router.navigate(['/configuracion-sistema/registrar-cpd']);
  }

}
