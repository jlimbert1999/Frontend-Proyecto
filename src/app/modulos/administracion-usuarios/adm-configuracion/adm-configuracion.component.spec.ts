import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmConfiguracionComponent } from './adm-configuracion.component';

describe('AdmConfiguracionComponent', () => {
  let component: AdmConfiguracionComponent;
  let fixture: ComponentFixture<AdmConfiguracionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdmConfiguracionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmConfiguracionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
