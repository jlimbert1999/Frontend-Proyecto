import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteEstadisticoComponent } from './reporte-estadistico.component';

describe('ReporteEstadisticoComponent', () => {
  let component: ReporteEstadisticoComponent;
  let fixture: ComponentFixture<ReporteEstadisticoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteEstadisticoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteEstadisticoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
