import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignPointsApplicationComponent } from './assign-points-application.component';

describe('AssignPointsApplicationComponent', () => {
  let component: AssignPointsApplicationComponent;
  let fixture: ComponentFixture<AssignPointsApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignPointsApplicationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignPointsApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
