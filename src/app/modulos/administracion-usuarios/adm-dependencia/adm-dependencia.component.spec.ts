import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmDependenciaComponent } from './adm-dependencia.component';

describe('AdmDependenciaComponent', () => {
  let component: AdmDependenciaComponent;
  let fixture: ComponentFixture<AdmDependenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdmDependenciaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmDependenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
