import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GstrAnx1B2cDetailsComponent } from './gstr-anx-1-details.component';

describe('GstrAnx1B2cDetailsComponent', () => {
  let component: GstrAnx1B2cDetailsComponent;
  let fixture: ComponentFixture<GstrAnx1B2cDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GstrAnx1B2cDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GstrAnx1B2cDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
