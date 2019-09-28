/**created by dolly garg */
import { Component, OnInit } from '@angular/core';
import { CustomRateService } from '../custom-rate.service';
import { ToastrCustomService } from '../../../commonServices/toastr.service';
import { Subscription } from 'rxjs/Subscription';
import { GlobalService } from '../../../commonServices/global.service';
import { ItemmasterServices } from '../../../commonServices/TransactionMaster/item-master.services';
import * as _ from 'lodash';
import { CommonService } from 'src/app/commonServices/commanmaster/common.services';
@Component({
  selector: 'custom-rate-add',
  templateUrl: './custom-rate-add.component.html'
})
export class CustomRateAddComponent implements OnInit {
  isDiscountSystem: boolean = true
  list = []
  subscription: Subscription
  masterData = {}
  allItems: boolean = false
  loading = true
  listBefore = []
  constructor (private customRateService: CustomRateService,
    private toastrService: ToastrCustomService,
    private _itemmasterServices: ItemmasterServices,
    private gs: GlobalService,
    private commonService: CommonService) {
    this.subscription = this.customRateService.unit$.subscribe((data: any) => {
      if (data.units && data.types) {
        this.masterData['unitsData'] = data.units
        this.masterData['customerTypes'] = data.types
        if (this.masterData['customerTypes'].length > 0) {
          const customerTypes = JSON.parse(JSON.stringify(this.masterData['customerTypes']))
          customerTypes.shift()
          customerTypes.forEach(type => {
            type['Rate'] = 0
            type['CustomerTypeId'] = type['id']
            type['Id'] = 0
          })
          this.masterData['CustomerTypesArr'] = customerTypes
        }
        console.log(data)
        this.generateList()
      }
    })
  }

  checkAllItems (val) {
    this.masterData['list'].forEach((item) => {
      item.checked = val
    })
    if (val) {
      this.masterData['selectedItems'] = JSON.parse(JSON.stringify(this.masterData['list']))
    } else {
      this.masterData['selectedItems'] = []
    }
  }

  generateList () {
    this.list.forEach(item => {
      item['Id'] = 0
      item['Rate'] = 0
      item['Discount'] = 0
      item['DiscountType'] = 0
      item['IsApplyOnMrp'] = 0
      item['IsManual'] = 0
      item['unitData'] = this.masterData['unitsData'][item.ItemId]
      item['checked'] = false
      item['CustomerTypesArr'] = JSON.parse(JSON.stringify(this.masterData['CustomerTypesArr']))
    })
    console.log(this.list)
    this.masterData['list'] = this.list
    this.checkForAlreadyExist()
    this.commonService.fixTableHF('custom-rate-table')
  }

  addToQueue () {
    this.masterData['selectedItems'].forEach((item) => {
      item['CustomerTypeId'] = this.masterData['CustomerTypeId']
    })
    let diff = -1
    if (this.masterData['list'].length === this.masterData['selectedItems'].length) {
      diff = _.differenceWith(this.masterData['selectedItems'], this.masterData['list'], _.isEqual);
      this.masterData['queueToPost'] = (this.masterData['queueToPost'] || []).concat(this.masterData['selectedItems'])
      this.masterData['list'] = []
      this.masterData['selectedItems'] = []
    } else {
      if (this.masterData['selectedItems'].length > this.masterData['list'].length) {
        diff = _.differenceWith(this.masterData['selectedItems'], this.masterData['list'], _.isEqual);
      } else {
        diff = _.differenceWith(this.masterData['list'], this.masterData['selectedItems'], _.isEqual);
      }
      console.log('diff : ', diff)
      this.masterData['list'] = diff
      this.masterData['queueToPost'] = (this.masterData['queueToPost'] || []).concat(this.masterData['selectedItems'])
      this.masterData['selectedItems'] = []
    }
    this.commonService.fixTableHF('queue-discount-table')
  }

  getPostParams (data) {
    let dataToPost = []
    if (!this.isDiscountSystem) {
      data.forEach(element => {
        if (element.checked) {
          element['CustomerTypesArr'].forEach((type) => {
            let newElem = JSON.parse(JSON.stringify(element))
            newElem['CustomerTypeId'] = type.CustomerTypeId
            newElem['Rate'] = +type.Rate
            newElem['IsManual'] = 1
            newElem['UnitId'] = element['UnitId']
            newElem['UnitName'] = element['UnitName']
            newElem['Id'] = type['Id']
            dataToPost.push(newElem)
          })
        }
      });
    } else {
      dataToPost = data
    }
    let obj = {
      ItemCustomRates: dataToPost
    }
    console.log(JSON.stringify(obj))
    return obj
  }
  manipulateData (data) {
    const toPost = this.getPostParams(data)
    if (toPost.ItemCustomRates.length > 0) {
      this.customRateService.postCustomRate(toPost).subscribe((data) => {
        console.log('data : ', data)
        this.getList()
        if (data) {
          this.toastrService.showSuccess('Done Successfully', '')
        }
      },
      (error) => {
        console.log(error)
        this.toastrService.showError(error, '')
      })
    } else {
      this.toastrService.showError('Select atleast 1', '')
    }
  }

  onUnitChange (evt, item) {
    item['unitData'].forEach((unit) => {
      if (+unit.UnitId === +evt) {
        item['UnitName'] = unit.Name
      }
    })
  }

  filterData (categoryId) {
    // console.log('categoryId : ', categoryId)
    if (categoryId === 0) {
      this.masterData['list'] = JSON.parse(JSON.stringify(this.masterData['listCopy']))
    } else {
      const selected = this.masterData['listCopy'].filter((item) => +item['CategoryId'] === +categoryId)
      this.masterData['list'] = selected
    }
    this.setDis()
  }

  setDis () {
    this.masterData['list'].forEach((item) => {
      item['Discount'] = +this.masterData['Discount']
    })
  }

  toggleSelect(item, i) {
    if (item.checked) {
      this.masterData['selectedItems'].push(item)
    } else {
      this.masterData['selectedItems'].splice(i, 1)
    }
  }

  ngOnInit () {
    this.initComp()
    this.getList()
    this.getCategoryDetails()
  }

  initComp () {
  }

  getList () {
    this.masterData['queueToPost'] = []
    this.loading = true
    this.allItems = false
    this.masterData['selectedItems'] = []
    this.masterData['CustomerTypeId'] = 0
    this.customRateService.getCustomRateList().subscribe((data) => {
      console.log('custom rate : ', data)
      if (data) {
        if (data.ItemCustomRates) {
          this.listBefore = data.ItemCustomRates
        }
        this.list = data.Items
        if (data.ItemUnits && data.CustomerTypes) {
          this.customRateService.returnUnits(data.ItemUnits, data.CustomerTypes)
        }
      }
    },
    (error) => {
      console.log(error)
      this.toastrService.showErrorLong(error, '')
    })
  }

  checkForAlreadyExist() {
    console.log('this.listBefore : ', this.listBefore)
    if (this.listBefore.length > 0) {
      if (this.isDiscountSystem) {
        const checkfor = this.listBefore.filter((element) => element.IsManual === 0)
        this.masterData['list'].forEach((element) => {
          for (let i = 0; i < checkfor.length; i++) {
            if (checkfor[i].ItemId === element.ItemId) {
              element['Discount'] = checkfor[i]['Discount']
              element['CustomerTypeId'] = checkfor[i]['CustomerTypeId']
              element['UnitId'] = checkfor[i]['UnitId']
              element['UnitName'] = checkfor[i]['UnitName']
              element['Id'] = checkfor[i]['Id']
              break;
            }
          }
        })
      } else {
        const checkfor = this.listBefore.filter((element) => element.IsManual === 1)
        console.log(checkfor)
        const checkForArr = this.customRateService.reduceCustomerArr(checkfor)
        this.masterData['list'].forEach((element) => {
          if (typeof checkForArr[element.ItemId] != 'undefined') {
            element['CustomerTypesArr'] = checkForArr[element.ItemId]
            element['UnitId'] = element['CustomerTypesArr'][0]['UnitId']
            element['UnitName'] = element['CustomerTypesArr'][0]['UnitName']
          }
        })
      }
    }
    console.log('this.masterData : ', this.masterData['list'])
    this.masterData['listCopy'] = JSON.parse(JSON.stringify(this.masterData['list']))
    this.loading = false
  }

  getIndexOf (customerTypeArr, toCheckFor) {
    customerTypeArr.forEach((element) => {
      if (element['CustomerTypeId'] === toCheckFor['CustomerTypeId']) {
        element['Rate'] = toCheckFor['Rate']
      }
    })
  }

  switchView () {
    this.getList()
  }

  getCategoryDetails() {
    let newData = [{ id: '0', text: 'Select Category' }]
    this.gs.manipulateResponse(this._itemmasterServices.getAllSubCategories(1)).subscribe(data => {
      if (data.length > 0) {
        data.forEach(element => {
          newData.push({
            id: element.Id,
            text: element.Name
          })
        })
      }
      this.masterData['categoryData'] = newData
    },
    (error) => {
      console.log(error)
      this.toastrService.showErrorLong(error, '')
    })
  }

}