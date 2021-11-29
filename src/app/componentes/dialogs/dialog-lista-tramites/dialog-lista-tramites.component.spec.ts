import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogListaTramitesComponent } from './dialog-lista-tramites.component';

describe('DialogListaTramitesComponent', () => {
  let component: DialogListaTramitesComponent;
  let fixture: ComponentFixture<DialogListaTramitesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogListaTramitesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogListaTramitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
