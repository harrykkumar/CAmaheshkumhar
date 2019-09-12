import { Component, Output, EventEmitter, Input, SimpleChanges, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { GlobalService } from '../../commonServices/global.service';
import { Settings } from '../constants/settings.constant';
import { DateTimeAdapter } from 'ng-pick-datetime';
import { OwlDateTimeComponent } from 'ng-pick-datetime';
// import * as moment from 'moment';
import { ToastrCustomService } from '../../commonServices/toastr.service';
@Component({
  selector: 'datepicker-popup',
  templateUrl: './datepicker.component.html'
})
export class DatepickerComponent implements OnDestroy {
  model;
  @ViewChild('dt2') dt2: OwlDateTimeComponent<''>
  @ViewChild('inputElem') inputElem: ElementRef
  @Output() dateInFormat = new EventEmitter()
  @Output() opened = new EventEmitter()
  @Input() toSetDate;
  @Input() isBackDate;
  @Input() disableInput: boolean;
  @Input() class: boolean = false;
  @Input() daysToAdd: number = 0;
  @Input() setMinDate;
  @Input() setMaxDate;
  @Input() placeholder: string = '';
  today;
  minDate;
  maxDate;
  clientDateFormat = ''
  selectedDate;
  isoRegex = /^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(.[0-9]+)?(Z)?$/g
  constructor(private gs: GlobalService, private settings: Settings,
    private dateTimeAdapter: DateTimeAdapter<any>, private toastrService: ToastrCustomService) {
    this.clientDateFormat = this.settings.dateFormat
    this.placeholder = this.gs.getPlaceholder(this.clientDateFormat)
    this.class = false
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
        this.class = false
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
    // console.log(moment(evt.value._d))
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
      // if (!this.class && this.today) {
      //   this.dt2.select(this.today)
      // }
      this.validateDate()
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

  validateDate () {
    // console.log(this.inputElem.nativeElement.value)
    if (this.gs.checkForFormatType(this.clientDateFormat) === 1) {
      const date = this.gs.convertToInParts(this.inputElem.nativeElement.value, this.clientDateFormat)
      console.log(date)
      if (date !== '') {
        this.today = (new Date(date[0], date[1], date[2])).toISOString()
        let dateToSet = this.gs.utcToClientDateFormat(this.today, this.clientDateFormat)
        if (this.today) {
          if (!isNaN(this.maxDate.getTime()) && !isNaN(this.minDate.getTime())) {
            if ((new Date(this.today)).getTime() <= this.maxDate.getTime() && 
              (new Date(this.today)).getTime() >= this.minDate.getTime()) {
              this.class = false
              this.dateInFormat.emit(dateToSet)
            } else if ((new Date(this.today)).getTime() > this.maxDate.getTime()) {
              this.dateInFormat.emit(this.gs.convertToClient(this.maxDate, this.clientDateFormat))
              this.dt2.select(this.today)
              this.toastrService.showWarningLong('Date can\'t be greater then ' + this.maxDate, '')
            } else if ((new Date(this.today)).getTime() < this.minDate.getTime()) {
              this.dateInFormat.emit(this.gs.convertToClient(this.minDate, this.clientDateFormat))
              this.dt2.select(this.today)
              this.toastrService.showWarningLong('Date can\'t be less then ' + this.minDate, '')
            }
          } else {
            this.class = false
            this.dateInFormat.emit(dateToSet)
          }
        } else {
          this.class = true
        }
      } else {
        this.class = true
      }
    } else {
      let newDate = '' + (new Date(this.inputElem.nativeElement.value))
      console.log('newDate : ', newDate)
      if (newDate !== 'Invalid Date') {
        this.class = false;
        let dateToSet = this.gs.convertToClient(this.inputElem.nativeElement.value, this.clientDateFormat)
        console.log('datetoset : ', dateToSet)
        if (dateToSet) {
          const toCheckDateFor = this.gs.clientToSqlDateFormat(dateToSet, this.clientDateFormat)
          if (this.gs.isValidDate(toCheckDateFor)) {
            this.today = this.gs.sqlToUtc(toCheckDateFor)
            if (this.today) {
              if (!isNaN(this.maxDate.getTime()) && !isNaN(this.minDate.getTime())) {
                if ((new Date(this.today)).getTime() <= this.maxDate.getTime() && (new Date(this.today)).getTime() >= this.minDate.getTime()) {
                  this.class = false
                  // console.log('moment format : ', moment(this.today).format())
                  // this.dt2.dtInput.elementRef.nativeElement.value = dateToSet
                  this.dateInFormat.emit(dateToSet)
                  // this.dt2.select(this.today)
                } else if ((new Date(this.today)).getTime() > this.maxDate.getTime()) {
                  this.dateInFormat.emit(this.gs.convertToClient(this.maxDate, this.clientDateFormat))
                  this.dt2.select(this.today)
                  this.toastrService.showWarningLong('Date can\'t be greater then ' + this.maxDate, '')
                } else if ((new Date(this.today)).getTime() < this.minDate.getTime()) {
                  this.dateInFormat.emit(this.gs.convertToClient(this.minDate, this.clientDateFormat))
                  this.dt2.select(this.today)
                  this.toastrService.showWarningLong('Date can\'t be less then ' + this.minDate, '')
                }
              } else {
                this.class = false
                this.dateInFormat.emit(dateToSet)
              }
            } else {
              this.class = true
            }
          } else {
            this.class = true
          }
        }
      } else {
        this.class = true
      }
    }
  }

  putSplitter () {
    console.log(this.inputElem.nativeElement.value)
    let val = '' + this.inputElem.nativeElement.value
    let charArr = this.gs.getCharaters(this.clientDateFormat)
    let first = charArr[0]
    let mid = charArr[1]
    let last = charArr[2]
    let splitter = this.gs.checkForFormat(3, '', this.clientDateFormat)
    if (val.length === first) {
      this.inputElem.nativeElement.value = this.inputElem.nativeElement.value + splitter
    }
    if (val.length === (first + mid + 1)) {
      this.inputElem.nativeElement.value = this.inputElem.nativeElement.value + splitter
    }
    if (val.length === (first + mid + last + 2)) {
      this.inputElem.nativeElement.value = this.inputElem.nativeElement.value
    }
  }
  
  ngOnDestroy () {
    this.class = false
  }
}


/**console.log(this.today)
          console.log(this.today && 
            (new Date(this.today)).getTime() <= this.maxDate.getTime() &&
            (new Date(this.today)).getTime() >= this.minDate.getTime()) */