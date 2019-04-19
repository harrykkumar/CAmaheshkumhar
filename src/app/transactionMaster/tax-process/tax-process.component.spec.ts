import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxProcessComponent } from './tax-process.component';

describe('TaxProcessComponent', () => {
  let component: TaxProcessComponent;
  let fixture: ComponentFixture<TaxProcessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaxProcessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
