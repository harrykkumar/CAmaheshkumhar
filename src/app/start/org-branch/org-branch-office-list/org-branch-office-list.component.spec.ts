import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgBranchOfficeListComponent } from './org-branch-office-list.component';

describe('OrgBranchOfficeListComponent', () => {
  let component: OrgBranchOfficeListComponent;
  let fixture: ComponentFixture<OrgBranchOfficeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrgBranchOfficeListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgBranchOfficeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
