import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionNumberComponent } from './transaction-number.component';

describe('TransactionNumberComponent', () => {
  let component: TransactionNumberComponent;
  let fixture: ComponentFixture<TransactionNumberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionNumberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
