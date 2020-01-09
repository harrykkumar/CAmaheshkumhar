import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCrmCustomerComponent } from './add-crm-customer.component';

describe('AddCrmCustomerComponent', () => {
  let component: AddCrmCustomerComponent;
  let fixture: ComponentFixture<AddCrmCustomerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCrmCustomerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCrmCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
