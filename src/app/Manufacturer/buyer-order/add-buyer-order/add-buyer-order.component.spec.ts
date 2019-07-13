import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBuyerOrderComponent } from './add-buyer-order.component';

describe('AddBuyerOrderComponent', () => {
  let component: AddBuyerOrderComponent;
  let fixture: ComponentFixture<AddBuyerOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddBuyerOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBuyerOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
