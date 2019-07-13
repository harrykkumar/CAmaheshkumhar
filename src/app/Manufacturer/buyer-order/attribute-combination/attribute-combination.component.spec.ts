import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttributeCombinationComponent } from './attribute-combination.component';

describe('AttributeCombinationComponent', () => {
  let component: AttributeCombinationComponent;
  let fixture: ComponentFixture<AttributeCombinationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttributeCombinationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttributeCombinationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
