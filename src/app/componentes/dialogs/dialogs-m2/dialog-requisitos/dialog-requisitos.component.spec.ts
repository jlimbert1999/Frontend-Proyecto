import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogRequisitosComponent } from './dialog-requisitos.component';

describe('DialogRequisitosComponent', () => {
  let component: DialogRequisitosComponent;
  let fixture: ComponentFixture<DialogRequisitosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogRequisitosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogRequisitosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
