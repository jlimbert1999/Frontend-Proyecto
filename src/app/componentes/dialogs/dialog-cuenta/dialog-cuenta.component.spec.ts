import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCuentaComponent } from './dialog-cuenta.component';

describe('DialogCuentaComponent', () => {
  let component: DialogCuentaComponent;
  let fixture: ComponentFixture<DialogCuentaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogCuentaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogCuentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
