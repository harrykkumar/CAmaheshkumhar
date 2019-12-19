import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowUpCountInfoComponent } from './follow-up-count-info.component';

describe('FollowUpCountInfoComponent', () => {
  let component: FollowUpCountInfoComponent;
  let fixture: ComponentFixture<FollowUpCountInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FollowUpCountInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowUpCountInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
