import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionReportComponent } from './action-report.component';

describe('ActionReportComponent', () => {
  let component: ActionReportComponent;
  let fixture: ComponentFixture<ActionReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
