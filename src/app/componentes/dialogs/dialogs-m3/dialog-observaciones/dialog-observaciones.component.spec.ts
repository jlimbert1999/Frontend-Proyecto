import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogObservacionesComponent } from './dialog-observaciones.component';

describe('DialogObservacionesComponent', () => {
  let component: DialogObservacionesComponent;
  let fixture: ComponentFixture<DialogObservacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogObservacionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogObservacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
