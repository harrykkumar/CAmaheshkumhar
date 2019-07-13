import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemRequirementListComponent } from './item-requirement-list.component';

describe('ItemRequirementListComponent', () => {
  let component: ItemRequirementListComponent;
  let fixture: ComponentFixture<ItemRequirementListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemRequirementListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemRequirementListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
