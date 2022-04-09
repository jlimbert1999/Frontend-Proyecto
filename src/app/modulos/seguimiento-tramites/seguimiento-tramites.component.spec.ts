import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeguimientoTramitesComponent } from './seguimiento-tramites.component';

describe('SeguimientoTramitesComponent', () => {
  let component: SeguimientoTramitesComponent;
  let fixture: ComponentFixture<SeguimientoTramitesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeguimientoTramitesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeguimientoTramitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
