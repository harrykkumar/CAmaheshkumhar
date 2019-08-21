import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GstrAnxTwoDetailsComponent } from './gstr-anx-2-details.component';

describe('GstrAnxTwoDetailsComponent', () => {
  let component: GstrAnxTwoDetailsComponent;
  let fixture: ComponentFixture<GstrAnxTwoDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GstrAnxTwoDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GstrAnxTwoDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
