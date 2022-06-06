import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteFichaComponent } from './reporte-ficha.component';

describe('ReporteFichaComponent', () => {
  let component: ReporteFichaComponent;
  let fixture: ComponentFixture<ReporteFichaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteFichaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteFichaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
