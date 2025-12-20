import { TestBed } from '@angular/core/testing';

import { ServiceContentService } from './service-content.service';

describe('ServiceContentService', () => {
  let service: ServiceContentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceContentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
