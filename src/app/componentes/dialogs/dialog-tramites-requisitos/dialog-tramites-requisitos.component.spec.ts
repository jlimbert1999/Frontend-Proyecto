import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogTramitesRequisitosComponent } from './dialog-tramites-requisitos.component';

describe('DialogTramitesRequisitosComponent', () => {
  let component: DialogTramitesRequisitosComponent;
  let fixture: ComponentFixture<DialogTramitesRequisitosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogTramitesRequisitosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogTramitesRequisitosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
