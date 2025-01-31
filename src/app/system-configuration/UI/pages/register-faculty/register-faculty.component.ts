import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { SelectModule } from 'primeng/select';
import { KeyValueOption } from '../../../../shared/utils/models/form-builder.model';
import { InputTextModule } from 'primeng/inputtext';
import { RouterModule } from '@angular/router';
import { ListFacultiesUsecase } from '../../../domain/usecase/list-faculties-usecase';

@Component({
  selector: 'app-register-faculty',
  imports: [CommonModule, ButtonModule, ProgressBarModule, SelectModule, FormsModule, InputTextModule,
    ReactiveFormsModule, RouterModule],
  templateUrl: './register-faculty.component.html',
  styleUrl: './register-faculty.component.css'
})
export class RegisterFacultyComponent implements OnInit {

  facultiesList: KeyValueOption[] = [];

  registerForm!: FormGroup;

  isDisabledNextStep = true;

  private readonly formBuilder = inject(FormBuilder);
  private readonly listFacultiesUseCase = inject(ListFacultiesUsecase);

  ngOnInit() {

    this.registerForm = this.formBuilder.group({
      faculty: [undefined, [Validators.required]]
    });

    this.getAllFaculties();

  }

  getAllFaculties() {

    this.listFacultiesUseCase.getAllFaculties().subscribe({
      next: (response) => {
        this.facultiesList = response.map((faculty) => {
          return { key: faculty.facultyId, value: faculty.name };
        });
      },
      error: (error) => {
        console.error(error);
      }
    });

  }

  onSubmit() {

    console.log("selectedDepartment", this.registerForm.value);
    //TODO: Guardar el departamento por medio del serviicio back 

    //1. Habilitar el siguiente paso
    this.isDisabledNextStep = false;

  }

}
