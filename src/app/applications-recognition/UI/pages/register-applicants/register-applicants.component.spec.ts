import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterApplicantsComponent } from './register-applicants.component';

describe('RegisterApplicantsComponent', () => {
  let component: RegisterApplicantsComponent;
  let fixture: ComponentFixture<RegisterApplicantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterApplicantsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterApplicantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
