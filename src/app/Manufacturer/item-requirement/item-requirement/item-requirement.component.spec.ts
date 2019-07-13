import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemRequirementComponent } from './item-requirement.component';

describe('ItemRequirementComponent', () => {
  let component: ItemRequirementComponent;
  let fixture: ComponentFixture<ItemRequirementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemRequirementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemRequirementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
