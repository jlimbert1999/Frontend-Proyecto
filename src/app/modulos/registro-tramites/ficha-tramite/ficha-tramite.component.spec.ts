import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaTramiteComponent } from './ficha-tramite.component';

describe('FichaTramiteComponent', () => {
  let component: FichaTramiteComponent;
  let fixture: ComponentFixture<FichaTramiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FichaTramiteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FichaTramiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
