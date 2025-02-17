import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListApplicationsReviewComponent } from './list-applications-review.component';

describe('ListApplicationsReviewComponent', () => {
  let component: ListApplicationsReviewComponent;
  let fixture: ComponentFixture<ListApplicationsReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListApplicationsReviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListApplicationsReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
