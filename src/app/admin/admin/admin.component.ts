import { Component } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Subscription } from 'rxjs/Subscription'
import { Router } from '@angular/router'
import { UIConstant } from '../../shared/constants/ui-constant'
import { CommonService } from '../../commonServices/commanmaster/common.services'

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  countryForm: FormGroup
  subscribe: Subscription
  submitClick: boolean
  constructor (
      private _formBuilder: FormBuilder,
      private _route: Router,
      private _countryServices: CommonService,
  ) {
    this.countryFormMethod()
  }

  private countryFormMethod () {
    this.countryForm = this._formBuilder.group({
      'countryName': [UIConstant.BLANK, Validators.required],
      'shortName': [UIConstant.BLANK, Validators.required]
    })
  }

  ngOnInit () {
    this.getCountryDetail()
  }
  saveCountry () {
    //console.log('asdfdsafgbedab')
    //console.log(this.countryForm.value.countryName)
    //console.log(this.countryForm.value.shortName)
    this.submitClick = true
    if (this.countryForm.valid) {
      this.subscribe = this._countryServices.getCountry().subscribe(data => {
        //console.log(data)
        this.submitClick = false
      })
    }
  }

  getCountryDetail () {
    //console.log('country id are ')
  }

  searchCountry () {
    //console.log('searching country are')
  }

  clearCountryValidation () {
    this.submitClick = false
    this.countryFormMethod()
  }
}
