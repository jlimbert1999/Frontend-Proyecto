import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogRegistrarTramiteComponent } from './dialog-registrar-tramite.component';

describe('DialogRegistrarTramiteComponent', () => {
  let component: DialogRegistrarTramiteComponent;
  let fixture: ComponentFixture<DialogRegistrarTramiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogRegistrarTramiteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogRegistrarTramiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
