import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecommendPointsApplicationComponent } from './recommend-points-application.component';

describe('RecommendPointsApplicationComponent', () => {
  let component: RecommendPointsApplicationComponent;
  let fixture: ComponentFixture<RecommendPointsApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecommendPointsApplicationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecommendPointsApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
