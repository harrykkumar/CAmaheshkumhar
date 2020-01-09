import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFollowupDetailComponent } from './add-followup-detail.component';

describe('AddFollowupDetailComponent', () => {
  let component: AddFollowupDetailComponent;
  let fixture: ComponentFixture<AddFollowupDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddFollowupDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFollowupDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
