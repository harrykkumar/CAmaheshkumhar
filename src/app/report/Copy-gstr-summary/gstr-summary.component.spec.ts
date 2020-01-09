import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GstrSummaryComponent } from './gstr-summary.component';

describe('GstrSummaryComponent', () => {
  let component: GstrSummaryComponent;
  let fixture: ComponentFixture<GstrSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GstrSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GstrSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
