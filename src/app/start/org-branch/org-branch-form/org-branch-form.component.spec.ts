import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganisationBranchComponent } from './org-branch-form.component';

describe('OrganisationBranchComponent', () => {
  let component: OrganisationBranchComponent;
  let fixture: ComponentFixture<OrganisationBranchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganisationBranchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganisationBranchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
