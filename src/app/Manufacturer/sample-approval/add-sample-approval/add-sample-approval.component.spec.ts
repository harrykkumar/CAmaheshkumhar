import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSampleApprovalComponent } from './add-sample-approval.component';

describe('AddSampleApprovalComponent', () => {
  let component: AddSampleApprovalComponent;
  let fixture: ComponentFixture<AddSampleApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSampleApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSampleApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
