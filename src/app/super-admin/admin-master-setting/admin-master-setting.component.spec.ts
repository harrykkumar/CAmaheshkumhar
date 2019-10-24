import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMasterSettingComponent } from './admin-master-setting.component';

describe('AdminMasterSettingComponent', () => {
  let component: AdminMasterSettingComponent;
  let fixture: ComponentFixture<AdminMasterSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminMasterSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminMasterSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
