import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgBranchListComponent } from './org-branch-list.component';

describe('OrgBranchListComponent', () => {
  let component: OrgBranchListComponent;
  let fixture: ComponentFixture<OrgBranchListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrgBranchListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgBranchListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
