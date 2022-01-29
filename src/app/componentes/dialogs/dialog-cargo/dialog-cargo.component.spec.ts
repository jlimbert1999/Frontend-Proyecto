import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCargoComponent } from './dialog-cargo.component';

describe('DialogCargoComponent', () => {
  let component: DialogCargoComponent;
  let fixture: ComponentFixture<DialogCargoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogCargoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogCargoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
