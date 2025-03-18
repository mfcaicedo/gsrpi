import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListApplicationsReviewCpdMembersComponent } from './list-applications-review-cpd-members.component';

describe('ListApplicationsReviewCpdMembersComponent', () => {
  let component: ListApplicationsReviewCpdMembersComponent;
  let fixture: ComponentFixture<ListApplicationsReviewCpdMembersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListApplicationsReviewCpdMembersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListApplicationsReviewCpdMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
