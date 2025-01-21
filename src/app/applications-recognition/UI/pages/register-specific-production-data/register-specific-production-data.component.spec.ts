import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterSpecificProductionDataComponent } from './register-specific-production-data.component';

describe('RegisterSpecificProductionDataComponent', () => {
  let component: RegisterSpecificProductionDataComponent;
  let fixture: ComponentFixture<RegisterSpecificProductionDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterSpecificProductionDataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterSpecificProductionDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
