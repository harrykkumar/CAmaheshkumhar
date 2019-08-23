import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DuesOverduesOutstandingComponent } from './dues-overdues-outstanding.component';

describe('DuesOverduesOutstandingComponent', () => {
  let component: DuesOverduesOutstandingComponent;
  let fixture: ComponentFixture<DuesOverduesOutstandingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DuesOverduesOutstandingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DuesOverduesOutstandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
