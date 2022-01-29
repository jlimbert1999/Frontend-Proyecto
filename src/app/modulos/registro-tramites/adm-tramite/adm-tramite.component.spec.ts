import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmTramiteComponent } from './adm-tramite.component';

describe('AdmTramiteComponent', () => {
  let component: AdmTramiteComponent;
  let fixture: ComponentFixture<AdmTramiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdmTramiteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmTramiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
