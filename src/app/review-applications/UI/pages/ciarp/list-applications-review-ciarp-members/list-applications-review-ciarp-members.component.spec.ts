import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListApplicationsReviewCiarpMembersComponent } from './list-applications-review-ciarp-members.component';

describe('ListApplicationsReviewCiarpMembersComponent', () => {
  let component: ListApplicationsReviewCiarpMembersComponent;
  let fixture: ComponentFixture<ListApplicationsReviewCiarpMembersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListApplicationsReviewCiarpMembersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListApplicationsReviewCiarpMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
