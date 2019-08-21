import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MsmedOutstandingComponent } from './msmed-outstanding.component';

describe('MsmedOutstandingComponent', () => {
  let component: MsmedOutstandingComponent;
  let fixture: ComponentFixture<MsmedOutstandingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MsmedOutstandingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MsmedOutstandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
