import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TramitesRequisitosComponent } from './tramites-requisitos.component';

describe('TramitesRequisitosComponent', () => {
  let component: TramitesRequisitosComponent;
  let fixture: ComponentFixture<TramitesRequisitosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TramitesRequisitosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TramitesRequisitosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
