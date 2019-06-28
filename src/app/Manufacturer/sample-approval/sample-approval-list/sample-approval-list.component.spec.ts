import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleApprovalListComponent } from './sample-approval-list.component';

describe('SampleApprovalListComponent', () => {
  let component: SampleApprovalListComponent;
  let fixture: ComponentFixture<SampleApprovalListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SampleApprovalListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SampleApprovalListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
