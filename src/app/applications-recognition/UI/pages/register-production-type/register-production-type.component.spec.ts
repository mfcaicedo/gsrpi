import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterProductionTypeComponent } from './register-production-type.component';

describe('RegisterProductionTypeComponent', () => {
  let component: RegisterProductionTypeComponent;
  let fixture: ComponentFixture<RegisterProductionTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterProductionTypeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterProductionTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
