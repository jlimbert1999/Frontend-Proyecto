import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmInstitucionComponent } from './adm-institucion.component';

describe('AdmInstitucionComponent', () => {
  let component: AdmInstitucionComponent;
  let fixture: ComponentFixture<AdmInstitucionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdmInstitucionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmInstitucionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
