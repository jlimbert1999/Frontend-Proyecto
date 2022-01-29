import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmFuncionarioComponent } from './adm-funcionario.component';

describe('AdmFuncionarioComponent', () => {
  let component: AdmFuncionarioComponent;
  let fixture: ComponentFixture<AdmFuncionarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdmFuncionarioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmFuncionarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
