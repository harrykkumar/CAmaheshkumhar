import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTypeFormComponent } from './user-type-form.component';

describe('UserTypeFormComponent', () => {
  let component: UserTypeFormComponent;
  let fixture: ComponentFixture<UserTypeFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserTypeFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserTypeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
