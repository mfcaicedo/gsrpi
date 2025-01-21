import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterGeneralProductionDataComponent } from './register-general-production-data.component';

describe('RegisterGeneralProductionDataComponent', () => {
  let component: RegisterGeneralProductionDataComponent;
  let fixture: ComponentFixture<RegisterGeneralProductionDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterGeneralProductionDataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterGeneralProductionDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
