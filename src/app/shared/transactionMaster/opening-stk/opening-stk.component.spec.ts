import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpeningStkComponent } from './opening-stk.component';

describe('OpeningStkComponent', () => {
  let component: OpeningStkComponent;
  let fixture: ComponentFixture<OpeningStkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpeningStkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpeningStkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
