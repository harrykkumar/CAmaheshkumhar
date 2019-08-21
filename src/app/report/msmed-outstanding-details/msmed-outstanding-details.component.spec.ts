import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MsmedOutstandingDetailsComponent } from './msmed-outstanding-details.component';

describe('MsmedOutstandingDetailsComponent', () => {
  let component: MsmedOutstandingDetailsComponent;
  let fixture: ComponentFixture<MsmedOutstandingDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MsmedOutstandingDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MsmedOutstandingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
