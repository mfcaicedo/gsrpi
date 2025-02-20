import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormBodySpecificProductionDataMagazineComponent } from './form-body-specific-production-data-magazine.component';

describe('FormBodySpecificProductionDataMagazineComponent', () => {
  let component: FormBodySpecificProductionDataMagazineComponent;
  let fixture: ComponentFixture<FormBodySpecificProductionDataMagazineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormBodySpecificProductionDataMagazineComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormBodySpecificProductionDataMagazineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
