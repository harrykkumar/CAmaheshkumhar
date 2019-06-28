import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OwlDateTimeModule, OwlNativeDateTimeModule, OWL_DATE_TIME_FORMATS } from 'ng-pick-datetime';
import { DatepickerComponent } from './datepicker.component';
import { FormsModule } from '@angular/forms';
import { OwlMomentDateTimeModule } from 'ng-pick-datetime-moment';
// export const MY_NATIVE_FORMATS = {
//   fullPickerInput: {year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric'},
//   datePickerInput: {year: 'numeric', month: 'numeric', day: 'numeric'},
//   timePickerInput: {hour: 'numeric', minute: 'numeric'},
//   monthYearLabel: {year: 'numeric', month: 'short'},
//   dateA11yLabel: {year: 'numeric', month: 'long', day: 'numeric'},
//   monthYearA11yLabel: {year: 'numeric', month: 'long'},
// };
export const MY_MOMENT_FORMATS = {
  parseInput: 'l LT',
  fullPickerInput: 'l LT',
  datePickerInput: 'l',
  timePickerInput: 'LT',
  monthYearLabel: 'MMM YYYY',
  dateA11yLabel: 'LL',
  monthYearA11yLabel: 'MMMM YYYY',
};
@NgModule({
  declarations: [
    DatepickerComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    OwlMomentDateTimeModule
  ],
  providers: [
    {provide: OWL_DATE_TIME_FORMATS, useValue: MY_MOMENT_FORMATS},
  ],
  exports: [
    DatepickerComponent,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    OwlMomentDateTimeModule],
  bootstrap: [DatepickerComponent]
})
export class DatepickerModule { }
