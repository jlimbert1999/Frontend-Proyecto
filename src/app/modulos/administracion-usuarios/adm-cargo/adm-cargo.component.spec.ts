import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmCargoComponent } from './adm-cargo.component';

describe('AdmCargoComponent', () => {
  let component: AdmCargoComponent;
  let fixture: ComponentFixture<AdmCargoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdmCargoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmCargoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
