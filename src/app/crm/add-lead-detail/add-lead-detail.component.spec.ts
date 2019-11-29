import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLeadDetailComponent } from './add-lead-detail.component';

describe('AddLeadDetailComponent', () => {
  let component: AddLeadDetailComponent;
  let fixture: ComponentFixture<AddLeadDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddLeadDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLeadDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
