import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormBodyApplicantTeacherComponent } from './form-body-applicant-teacher.component';

describe('FormBodyApplicantTeacherComponent', () => {
  let component: FormBodyApplicantTeacherComponent;
  let fixture: ComponentFixture<FormBodyApplicantTeacherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormBodyApplicantTeacherComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormBodyApplicantTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
