import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewApplicationComponent } from './review-application.component';

describe('ReviewApplicationComponent', () => {
  let component: ReviewApplicationComponent;
  let fixture: ComponentFixture<ReviewApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewApplicationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
