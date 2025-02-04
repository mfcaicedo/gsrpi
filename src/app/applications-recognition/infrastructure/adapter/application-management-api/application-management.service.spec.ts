import { TestBed } from '@angular/core/testing';

import { ApplicationManagementService } from './application-management.service';

describe('ApplicationManagementService', () => {
  let service: ApplicationManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApplicationManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
