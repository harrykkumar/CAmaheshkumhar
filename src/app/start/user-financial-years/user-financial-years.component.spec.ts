import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFinancialYearsComponent } from './user-financial-years.component';

describe('UserFinancialYearsComponent', () => {
  let component: UserFinancialYearsComponent;
  let fixture: ComponentFixture<UserFinancialYearsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserFinancialYearsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserFinancialYearsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
