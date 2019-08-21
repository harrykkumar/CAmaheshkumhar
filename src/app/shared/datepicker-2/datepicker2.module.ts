import { NgModule } from '@angular/core';
import { DatePicker2Component } from './datepicker2.component';
import { MyDatePickerModule } from 'mydatepicker';
@NgModule({
  imports:      [ MyDatePickerModule ],
  declarations: [ DatePicker2Component ],
  bootstrap:    [ DatePicker2Component ]
})
export class DatePicker2AppModule {}
