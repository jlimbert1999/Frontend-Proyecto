import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogInstitucionComponent } from './dialog-institucion.component';

describe('DialogInstitucionComponent', () => {
  let component: DialogInstitucionComponent;
  let fixture: ComponentFixture<DialogInstitucionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogInstitucionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogInstitucionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
