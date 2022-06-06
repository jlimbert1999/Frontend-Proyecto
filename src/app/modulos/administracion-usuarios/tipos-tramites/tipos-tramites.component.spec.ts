import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiposTramitesComponent } from './tipos-tramites.component';

describe('TiposTramitesComponent', () => {
  let component: TiposTramitesComponent;
  let fixture: ComponentFixture<TiposTramitesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TiposTramitesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TiposTramitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
