import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoOrganizationComponent } from './no-organization.component';

describe('NoOrganizationComponent', () => {
  let component: NoOrganizationComponent;
  let fixture: ComponentFixture<NoOrganizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoOrganizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoOrganizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
