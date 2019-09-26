import { Component, OnDestroy, Inject, ViewChild } from '@angular/core';
import { AddCust } from '../../../model/sales-tracker.model';
import { UIConstant } from '../../../shared/constants/ui-constant';
import { ClientService } from '../client.service';
import { ToastrCustomService } from '../../../commonServices/toastr.service';
import { select2Return, ClientAddInterface } from '../../super-admin.model';
import { Subscription } from 'rxjs/Subscription';
import { map } from 'rxjs/internal/operators/map';
import { GlobalService } from '../../../commonServices/global.service';
import { Select2Component } from 'ng2-select2';
import * as _ from 'lodash';
import { Settings } from 'src/app/shared/constants/settings.constant';
import { NgForm } from '@angular/forms';
declare const $: any
@Component({
  selector: 'app-client-add',
  templateUrl: './client-add.component.html'
})
export class ClientAddComponent implements OnDestroy {
  onDestroy$: Subscription
  clientAdd: any = {}
  moduleData: Array<any> = []
  industryData: Array<any> = []
  tabId: number = 1
  subMenus: Array<any> = []
  subsData = []
  subsValue: string
  invalidObj = {}
  today: string
  toShow: boolean = false
  @ViewChild('subs_select2') subsSelect2: Select2Component
  @ViewChild('module_select2') moduleSelect2: Select2Component
  @ViewChild('industry_select2') industrySelect2: Select2Component
  constructor(private clientService: ClientService, 
    private toastrService: ToastrCustomService,
    private gs: GlobalService, private settings: Settings) {
    this.onDestroy$ = this.clientService.clientModalOpenStatus$.subscribe(
      (status: AddCust) => {
        if (status.open) {
          this.openModal()
        } else {
          this.closeModal()
        }
      }
    )

    this.onDestroy$ = this.clientService.select2$.subscribe((data: select2Return) => {
      if (data.data && data.type) {
        if (data.type === 'Modules') {
          this.moduleData = data.data
        } else if (data.type === 'Industries') {
          this.industryData = data.data
        }
      }
    })
  }

  onChange (evt: {value: string[]}, type) {
    if (evt.value) {
      if (type === 'mod') {
        this.clientAdd.ClientModulestr = evt.value.join(',')
      } else if (type === 'ind') {
        this.clientAdd.IndustryIdstr = evt.value.join(',')
      }
    }
    if (_.isEmpty(this.clientAdd.ClientModulestr)) {
      this.invalidObj['module'] = true
    } else {
      this.invalidObj['module'] = false
    }
    if (_.isEmpty(this.clientAdd.IndustryIdstr)) {
      this.invalidObj['industry'] = true
    } else {
      this.invalidObj['industry'] = false
    }
    // console.log(this.clientAdd)
  }

  toggle(evt, id) {
    this.subMenus.forEach(element => {
      if (+element.ParentId === +id) element.selected = evt.target.checked
    })
  }

  toggleInd (evt, id) {
    let count = 0
    this.subMenus.forEach(element => {
      if (+element.ParentId === +id && element.selected) {
        count++
      }
    })
    let parent = this.subMenus.filter(parent => +parent.Id === +id)
    if (parent.length > 0) {
      if (count === parent[0].length) {
        parent[0]['selected'] = true
      } else {
        parent[0]['selected'] = false
      }
    }
  }

  getSubMenus () {
    let _self = this
    if (this.clientAdd.ClientModulestr && this.clientAdd.IndustryIdstr) {
      this.clientService.getSubMenuList('?StrIndustryId=' + this.clientAdd.IndustryIdstr + '&StrModuleId='+ this.clientAdd.ClientModulestr).pipe(
        map(data => {
          if (data.length > 0) {
            let parents = data.filter(row => row.ParentId === 0)
            data.forEach(element => {
              element['selected'] = false
              let index = _.findIndex(parents, (parent) => parent.Id === element.ParentId)
              if (index > -1) {
                if (!parents[index]['children']) {
                  parents[index]['children'] = []
                }
                parents[index]['children'].push(element)
              }
            })
            let arr = []
            parents.forEach(element => {
              element['length'] = element.children.length
              arr = arr.concat(element)
              arr = arr.concat(element.children)
            })
            return arr
          }
        })
      )
      .subscribe(
        (data) => {
          console.log(data)
          _self.subMenus = data
        },
        (error) => {
          _self.toastrService.showError(error, '')
        }
      )
    }
  }

  private clientAddParams(): ClientAddInterface {
    let subMenus = []
    this.subMenus.forEach((element, index) => {
      if (element.selected) {
        subMenus.push({
          Id: element.Id,
          Sno: index + 1,
          Name: element.Name
        })
      }
    })
    let clientAdd = JSON.parse(JSON.stringify(this.clientAdd))
    clientAdd.registrationDate = this.gs.convertToSqlFormat(clientAdd.RegistrationDate)
    clientAdd.IsMultiOrganization = +clientAdd.IsMultiOrganization
    clientAdd.IsMultiBranch = +(!clientAdd.IsMultiOrganization)
    let obj = {...clientAdd, userMenus: [...subMenus], Id: 0}
    console.log(JSON.stringify(obj))
    return obj
  }

  form: any
  onFocus (form: NgForm) {
    console.log(form)
    this.form = form
  }

  manipulateData () {
    let _self = this
    this.clientService.postClient(this.clientAddParams()).subscribe(
      (data) => {
        console.log(data)
        if (data) {
          _self.toastrService.showSuccess('Successfully done', '')
          _self.clientService.onCloseClientModal()
          _self.clientService.onClientAdd()
        }
      },
      (error) => {
        _self.toastrService.showError(error, '')
      }
    )
  }

  
  checkForValidation () {
    this.toShow = true;
    this.tabId = 2
    console.log(this.clientAdd)
    console.log(this.invalidObj)
    this.getSubMenus()
  }

  
  checkfor (form) {
    console.log(form)
    console.log(this.clientAdd)
  }

  initComp () {
    this.clientAdd = {}
    this.invalidObj = {}
    this.subsData = [
      {id: 1, text:'Yearly'},
      {id: 2, text:'Half-Yearly'},
      {id: 3, text:'Quarterly'},
      {id: 4, text:'Monthly'},
      {id: 5, text:'Daily'},
      {id: 6, text:'Never'}
    ]
    this.tabId = 1
    this.today = this.gs.getDefaultDate(this.settings.dateFormat)
    // this.clientAdd.Registration = this.today
    this.clientAdd.SubscriptionTypeId = this.subsData[0].id
    this.clientAdd.IsMultiOrganization = true
    this.toShow = false
    this.clientAdd.NoOfOrganization = 1
    this.clientAdd.NoOfBranch = 1
    this.clientAdd.NoOfUser = 1
    if (this.subsSelect2)
      this.subsSelect2.setElementValue(this.subsData[0].id)
    
  }

  openModal () {
    $('#client_admin').modal(UIConstant.MODEL_SHOW)
    this.initComp()
  }

  closeModal () {
    if ($('#client_admin').length > 0) {
      this.form.reset()
      let controls = this.form.controls
      for (const key in controls) {
        if (controls.hasOwnProperty(key)) {
          const element = controls[key];
          element.markAsUntouched()
        }
      }
      $('#client_admin').modal(UIConstant.MODEL_HIDE)
    }
  }

  closePopUp () {
    this.clientService.onCloseClientModal()
  }

  ngOnDestroy () {
    this.onDestroy$.unsubscribe()
  }
}