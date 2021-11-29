import { TestBed } from '@angular/core/testing';

import { TipoTramitesService } from './tipo-tramites.service';

describe('TipoTramitesService', () => {
  let service: TipoTramitesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipoTramitesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
