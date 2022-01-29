import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmCuentaComponent } from './adm-cuenta.component';

describe('AdmCuentaComponent', () => {
  let component: AdmCuentaComponent;
  let fixture: ComponentFixture<AdmCuentaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdmCuentaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmCuentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
