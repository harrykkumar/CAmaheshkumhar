import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUserDealerLinkComponent } from './add-user-dealer-link.component';

describe('AddUserDealerLinkComponent', () => {
  let component: AddUserDealerLinkComponent;
  let fixture: ComponentFixture<AddUserDealerLinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUserDealerLinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUserDealerLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
