import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemAddSubscriptionComponent } from './item-add-subscription.component';

describe('ItemAddSubscriptionComponent', () => {
  let component: ItemAddSubscriptionComponent;
  let fixture: ComponentFixture<ItemAddSubscriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemAddSubscriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemAddSubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
