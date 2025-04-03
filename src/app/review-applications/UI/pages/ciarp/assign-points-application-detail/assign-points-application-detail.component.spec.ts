import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignPointsApplicationDetailComponent } from './assign-points-application-detail.component';

describe('AssignPointsApplicationDetailComponent', () => {
  let component: AssignPointsApplicationDetailComponent;
  let fixture: ComponentFixture<AssignPointsApplicationDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignPointsApplicationDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignPointsApplicationDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
