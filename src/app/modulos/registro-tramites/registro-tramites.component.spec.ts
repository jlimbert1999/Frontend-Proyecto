import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroTramitesComponent } from './registro-tramites.component';

describe('RegistroTramitesComponent', () => {
  let component: RegistroTramitesComponent;
  let fixture: ComponentFixture<RegistroTramitesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistroTramitesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroTramitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
