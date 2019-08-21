import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GstrAnx1B2bDetailsComponent } from './gstr-anx-1-b2b-details.component';

describe('GstrAnx1B2bDetailsComponent', () => {
  let component: GstrAnx1B2bDetailsComponent;
  let fixture: ComponentFixture<GstrAnx1B2bDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GstrAnx1B2bDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GstrAnx1B2bDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
