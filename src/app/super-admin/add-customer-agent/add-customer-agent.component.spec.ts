import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCustomerAgentComponent } from './add-customer-agent.component';

describe('AddCustomerAgentComponent', () => {
  let component: AddCustomerAgentComponent;
  let fixture: ComponentFixture<AddCustomerAgentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCustomerAgentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCustomerAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
