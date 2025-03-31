import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListApplicationsReviewCiarpSecretaryComponent } from './list-applications-review-ciarp-secretary.component';

describe('ListApplicationsReviewCiarpSecretaryComponent', () => {
  let component: ListApplicationsReviewCiarpSecretaryComponent;
  let fixture: ComponentFixture<ListApplicationsReviewCiarpSecretaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListApplicationsReviewCiarpSecretaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListApplicationsReviewCiarpSecretaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
