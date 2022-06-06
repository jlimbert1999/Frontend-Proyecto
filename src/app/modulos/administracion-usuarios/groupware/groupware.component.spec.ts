import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupwareComponent } from './groupware.component';

describe('GroupwareComponent', () => {
  let component: GroupwareComponent;
  let fixture: ComponentFixture<GroupwareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupwareComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupwareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
