import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicStepperComponent } from './dynamic-stepper.component';

describe('DynamicStepperComponent', () => {
  let component: DynamicStepperComponent;
  let fixture: ComponentFixture<DynamicStepperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicStepperComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
