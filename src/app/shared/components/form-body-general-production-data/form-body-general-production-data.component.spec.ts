import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormBodyGeneralProductionDataComponent } from './form-body-general-production-data.component';

describe('FormBodyGeneralProductionDataComponent', () => {
  let component: FormBodyGeneralProductionDataComponent;
  let fixture: ComponentFixture<FormBodyGeneralProductionDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormBodyGeneralProductionDataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormBodyGeneralProductionDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
