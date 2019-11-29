import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMobileNoComponent } from './add-mobile-no.component';

describe('AddMobileNoComponent', () => {
  let component: AddMobileNoComponent;
  let fixture: ComponentFixture<AddMobileNoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMobileNoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMobileNoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
