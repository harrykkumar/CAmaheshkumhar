import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddItemDetailsComponent } from './add-item-details.component';

describe('AddItemDetailsComponent', () => {
  let component: AddItemDetailsComponent;
  let fixture: ComponentFixture<AddItemDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddItemDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddItemDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
