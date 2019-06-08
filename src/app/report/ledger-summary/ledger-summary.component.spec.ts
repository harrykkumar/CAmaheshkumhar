import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LedgerSummaryComponent } from './ledger-summary.component';

describe('LedgerSummaryComponent', () => {
  let component: LedgerSummaryComponent;
  let fixture: ComponentFixture<LedgerSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LedgerSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LedgerSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
