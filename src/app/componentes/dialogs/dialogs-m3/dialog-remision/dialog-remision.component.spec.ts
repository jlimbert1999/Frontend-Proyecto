import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogRemisionComponent } from './dialog-remision.component';

describe('DialogRemisionComponent', () => {
  let component: DialogRemisionComponent;
  let fixture: ComponentFixture<DialogRemisionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogRemisionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogRemisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
