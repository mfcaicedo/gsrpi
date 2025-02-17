import { TestBed } from '@angular/core/testing';

import { ReviewApplicationsManagementService } from './review-applications-management.service';

describe('ReviewApplicationsManagementService', () => {
  let service: ReviewApplicationsManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReviewApplicationsManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
