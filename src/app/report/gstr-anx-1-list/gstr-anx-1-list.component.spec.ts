import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GstrAnx1ListComponent } from './gstr-anx-1-list.component';

describe('GstrAnx1ListComponent', () => {
  let component: GstrAnx1ListComponent;
  let fixture: ComponentFixture<GstrAnx1ListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GstrAnx1ListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GstrAnx1ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
