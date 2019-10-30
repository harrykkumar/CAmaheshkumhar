import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoconnectionComponent } from './noconnection.component';

describe('NoconnectionComponent', () => {
  let component: NoconnectionComponent;
  let fixture: ComponentFixture<NoconnectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoconnectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoconnectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
