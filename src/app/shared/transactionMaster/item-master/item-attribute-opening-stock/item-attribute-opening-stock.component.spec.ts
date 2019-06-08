import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemAttributeOpeningStockComponent } from './item-attribute-opening-stock.component';

describe('ItemAttributeOpeningStockComponent', () => {
  let component: ItemAttributeOpeningStockComponent;
  let fixture: ComponentFixture<ItemAttributeOpeningStockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemAttributeOpeningStockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemAttributeOpeningStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
