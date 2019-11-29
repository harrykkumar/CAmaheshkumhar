import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCommonMasterPopUpComponent } from './add-common-master-pop-up.component';

describe('AddCommonMasterPopUpComponent', () => {
  let component: AddCommonMasterPopUpComponent;
  let fixture: ComponentFixture<AddCommonMasterPopUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCommonMasterPopUpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCommonMasterPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
