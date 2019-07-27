import { Component, Output, EventEmitter, Input, SimpleChanges, ViewChild } from '@angular/core';
import { GlobalService } from '../../commonServices/global.service';
import { Settings } from '../constants/settings.constant';
import { DateTimeAdapter } from 'ng-pick-datetime';
import { OwlDateTimeComponent } from 'ng-pick-datetime';
@Component({
  selector: 'datepicker-popup',
  templateUrl: './datepicker.component.html'
})
export class DatepickerComponent {
  model;
  @ViewChild('dt2') dt2: OwlDateTimeComponent<''>
  @Output() dateInFormat = new EventEmitter()
  @Output() opened = new EventEmitter()
  @Input() toSetDate;
  @Input() isBackDate;
  @Input() disableInput: boolean;
  @Input() class: boolean = false;
  @Input() daysToAdd: number = 0;
  @Input() setMinDate;
  @Input() setMaxDate;
  @Input() placeholder: string = 'Select Date';
  today;
  minDate;
  maxDate;
  clientDateFormat = ''
  selectedDate;
  isoRegex = /^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(.[0-9]+)?(Z)?$/g
  
  constructor(private gs: GlobalService, private settings: Settings,
    private dateTimeAdapter: DateTimeAdapter<any>) {
    this.clientDateFormat = this.settings.dateFormat
    this.dateTimeAdapter.setLocale('en-IN')
    this.getSettings()
  }

  ngOnChanges (changes: SimpleChanges): void {
    // console.log(changes)
    if (changes.toSetDate && changes.toSetDate.currentValue && changes.toSetDate.currentValue !== changes.toSetDate.previousValue) {
      this.today = this.gs.sqlToUtc(this.gs.clientToSqlDateFormat(changes.toSetDate.currentValue, this.clientDateFormat))
      this.dt2.select(this.today)
      setTimeout(() => {
        this.dt2.dtInput.elementRef.nativeElement.value = changes.toSetDate.currentValue
      }, 1)
    }
    if (changes.toSetDate && changes.toSetDate.currentValue === '') {
      this.dateInFormat.emit('')
      setTimeout(() => {
        this.dt2.dtInput.elementRef.nativeElement.value = changes.toSetDate.currentValue
      }, 1)
    }
    if (changes.isBackDate && !changes.isBackDate.currentValue && changes.isBackDate.currentValue !== changes.isBackDate.previousValue) {
      this.minDate = new Date()
    }
    if (changes.daysToAdd && changes.daysToAdd.currentValue >= 0) {
      const d = new Date()
      d.setDate(d.getDate() + changes.daysToAdd.currentValue)
      this.today = (new Date(d)).toISOString()
      this.dt2.select(this.today)
      this.model = this.gs.utcToClientDateFormat(this.today, this.clientDateFormat)
      this.dateInFormat.emit(this.model)
      setTimeout(() => {
        this.dt2.dtInput.elementRef.nativeElement.value = this.model
      }, 1)
    }
    if (changes.setMinDate && changes.setMinDate.currentValue  && changes.setMinDate.currentValue !== changes.setMinDate.previousValue) {
      this.today = this.gs.sqlToUtc(this.gs.clientToSqlDateFormat(changes.setMinDate.currentValue, this.clientDateFormat))
      this.minDate = new Date(this.today)
    } else if (changes.setMinDate && changes.setMinDate.currentValue === '' ) {
      this.minDate = new Date('')
    }
    if (changes.setMaxDate && changes.setMaxDate.currentValue  && changes.setMaxDate.currentValue !== changes.setMaxDate.previousValue) {
      this.today = this.gs.sqlToUtc(this.gs.clientToSqlDateFormat(changes.setMaxDate.currentValue, this.clientDateFormat))
      this.maxDate = new Date(this.today)
    } else if (changes.setMaxDate && changes.setMaxDate.currentValue === '' ) {
      this.maxDate = new Date('')
    }
  }

  onSelect (evt) {
    if (evt.value && evt.value._d) {
      this.model = this.gs.utcToClientDateFormat((new Date(evt.value._d)).toISOString(), this.clientDateFormat)
      this.dateInFormat.emit(this.model)
      this.dt2.dtInput.elementRef.nativeElement.value = this.model
    } else if (this.isoRegex.test(evt.value)) {
      this.model = this.gs.utcToClientDateFormat(evt.value, this.clientDateFormat)
      this.dateInFormat.emit(this.model)
      this.dt2.dtInput.elementRef.nativeElement.value = this.model
    }
  }

  toggleView () {
    // console.log('selected : ', this.dt2.selected)
    if (!this.dt2.opened) {
      this.dt2.open()
    }
    this.opened.emit(!this.dt2.opened)
  }

  onClose () {
    this.opened.emit(false)
    this.dt2.dtInput.elementRef.nativeElement.focus({ preventScroll: false })
  }

  getSettings () {
    // console.log('set date')
    if (this.settings.finFromDate) this.minDate = new Date(this.settings.finFromDate)
    if (this.settings.finToDate) this.maxDate = new Date(this.settings.finToDate)
  }
}