import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GstrAnx2ListComponent } from './gstr-anx-2-list.component';

describe('GstrAnx2ListComponent', () => {
  let component: GstrAnx2ListComponent;
  let fixture: ComponentFixture<GstrAnx2ListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GstrAnx2ListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GstrAnx2ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
