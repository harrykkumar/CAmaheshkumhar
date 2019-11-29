import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerAgentComponent } from './customer-agent.component';

describe('CustomerAgentComponent', () => {
  let component: CustomerAgentComponent;
  let fixture: ComponentFixture<CustomerAgentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerAgentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
