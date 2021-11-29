import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministracionUsuariosComponent } from './administracion-usuarios.component';

describe('AdministracionUsuariosComponent', () => {
  let component: AdministracionUsuariosComponent;
  let fixture: ComponentFixture<AdministracionUsuariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdministracionUsuariosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministracionUsuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
