import { TestBed } from '@angular/core/testing';

import { RegistroTramitesService } from './registro-tramites.service';

describe('RegistroTramitesService', () => {
  let service: RegistroTramitesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegistroTramitesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
