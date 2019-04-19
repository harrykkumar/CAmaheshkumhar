import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoyalityComponent } from './loyality.component';

describe('LoyalityComponent', () => {
  let component: LoyalityComponent;
  let fixture: ComponentFixture<LoyalityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoyalityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoyalityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
