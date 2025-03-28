import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewValidationDetailComponent } from './view-validation-detail.component';

describe('ViewValidationDetailComponent', () => {
  let component: ViewValidationDetailComponent;
  let fixture: ComponentFixture<ViewValidationDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewValidationDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewValidationDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
