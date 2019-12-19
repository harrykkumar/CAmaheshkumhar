import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadInfoComponent } from './lead-info.component';

describe('LeadInfoComponent', () => {
  let component: LeadInfoComponent;
  let fixture: ComponentFixture<LeadInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeadInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
