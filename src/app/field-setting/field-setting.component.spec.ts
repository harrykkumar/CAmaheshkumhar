import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldSettingComponent } from './field-setting.component';

describe('FieldSettingComponent', () => {
  let component: FieldSettingComponent;
  let fixture: ComponentFixture<FieldSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FieldSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
