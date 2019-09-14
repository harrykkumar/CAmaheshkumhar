import { Component, Input, ViewChild, SimpleChanges, ElementRef, Renderer2 } from '@angular/core';
import { Select2OptionData, Select2Component } from "ng2-select2";
import { FormGroup, FormBuilder } from "@angular/forms";
import { Subscription } from 'rxjs';
import { ClientService } from '../client.service';
import { select2Return } from '../../super-admin.model';
@Component({
  selector: 'client-search',
  templateUrl: './client-search.component.html'
})
export class ClientSearchComponent {
  industryData: Array<Select2OptionData> = []
  subsData: Array<Select2OptionData> = []
  isValid: boolean = true
  onDestroy$: Subscription
  SubscriptionType: number
  IndustryId: string
  @ViewChild('first') first: ElementRef
  @ViewChild('subs_select2') subsSelect2: Select2Component
  @ViewChild('indus_select2') indusSelect2: Select2Component
  ngOnChanges (changes: SimpleChanges): void {
    if (changes.toShow && changes.toShow.currentValue) {
      setTimeout(() => {
        if (this.subsSelect2) {
          const element = this.renderer.selectRootElement(this.subsSelect2.selector.nativeElement, true)
          element.focus({ preventScroll: false })
        }
      }, 10)
    }
  }
  @Input() toShow: boolean = false
  searchForm: FormGroup
  constructor (private formBuilder: FormBuilder,private clientService: ClientService, private renderer: Renderer2) {
      this.onDestroy$ = this.clientService.select2$.subscribe((data: select2Return) => {
        if (data.data && data.type) {
          if (data.type === 'Industries') {
            this.industryData = data.data
          }
        }
      })
    }
  ngOnInit () {
    this.subsData = [
      {id: '0', text: 'Select Subscription'},
      {id: '1', text:'Yearly'},
      {id: '2', text:'Half-Yearly'},
      {id: '3', text:'Quarterly'},
      {id: '4', text:'Monthly'},
      {id: '5', text:'Daily'},
      {id: '6', text:'Never'}
    ]
    this.createForm()
  }

  onChange (evt: {value: string[]}) {
    if (evt.value) {
      this.IndustryId = evt.value.join(',')
    }
  }

  createForm () {
    this.searchForm = this.formBuilder.group({
      'Strsearch': ['']
    })
  }
  get f() { return this.searchForm.controls; }

  search () {
    if (this.searchForm.valid) {

      const queryStr = 
       '&Strsearch=' + this.searchForm.value.Strsearch +
       '&IndustryId=' + this.IndustryId +
       '&SubscriptionType=' + this.SubscriptionType
      this.clientService.setSearchQueryParamsStr(queryStr)
    }
  }

  resetSearch () {
    this.searchForm.reset()
    this.searchForm.controls.Strsearch.setValue('')
    if (this.subsSelect2) {
      this.subsSelect2.setElementValue(0)
    }
    const queryStr = 
       '&Strsearch=' + '' +
       '&IndustryId=' + 0 +
       '&SubscriptionType=' + 0
      this.clientService.setSearchQueryParamsStr(queryStr)
  }
}