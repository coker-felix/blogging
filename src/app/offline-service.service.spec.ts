import { TestBed } from '@angular/core/testing';

import { OfflineServiceService } from './offline-service.service';

describe('OfflineServiceService', () => {
  let service: OfflineServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OfflineServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
