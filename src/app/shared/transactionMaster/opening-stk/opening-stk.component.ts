/**created by dolly garg */
import { CommonService } from '../../../commonServices/commanmaster/common.services';
import { ToastrCustomService } from '../../../commonServices/toastr.service';
import { ComboService } from './../item-master/item-combo/combo.service';
import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import * as _ from 'lodash'
import { GlobalService } from '../../../commonServices/global.service';
import { ItemmasterServices } from '../../../commonServices/TransactionMaster/item-master.services';
import { map } from 'rxjs/internal/operators/map';
import { Settings } from '../../constants/settings.constant';
import { SetUpIds } from '../../constants/setupIds.constant';
declare const $: any
@Component({
  selector: 'app-opening-stk',
  templateUrl: './opening-stk.component.html',
  styleUrls: ['./opening-stk.component.css']
})
export class OpeningStkComponent implements OnInit, OnChanges {
  masterItemData = []
  masterData: any = {};
  selectedIndex: number = -1
  attrCombos: any = []
  search: string = ''
  allItems: boolean = false
  isLoadingItems = true
  isLoadingAttributes = true
  selectedAttrKeys = []
  ItemAttributeDetails = []
  constructor(
    private comboService: ComboService,
    private commonService: CommonService,
    private toastrService: ToastrCustomService,
    private gs: GlobalService,
    private _itemmasterServices: ItemmasterServices,
    private settings: Settings
  ) {
    this.getSetting(JSON.parse(this.settings.moduleSettings).settings)
    this.comboService.attributesData$.subscribe(
      data => {
        if (data.attributeKeys && data.attributesData) {
          this.masterData['Attributes'] = data.attributeKeys
          this.masterData['AttributesCopy'] = JSON.parse(JSON.stringify(this.masterData['Attributes']))
          console.log(this.masterData['Attributes'])
          // console.log('attrKeySelect2Data : ', this.masterData['attrKeySelect2Data'])
          this.masterData['AttributesDataCopy'] = JSON.parse(JSON.stringify(data.attributesData))
          this.manipulateAttrs(data.attributesData)
          this.masterData['AttributeIdStrCopy'] = JSON.parse(JSON.stringify(this.masterData['AttributeIdStr']))
          this.masterData['AttributeNamestrCopy'] = JSON.parse(JSON.stringify(this.masterData['AttributeNamestr']))
          setTimeout(() => {
            this.searchFilter()
          }, 0)
        }
      }
    )
  }

  toShowOpeningStock: boolean = false
  getSetting(settings) {
    // console.log('settings : ', settings)
    settings.forEach(element => {
      if (element.id === SetUpIds.attributesForPurchase) {
        this.toShowOpeningStock = (element.val && element.val.length > 0) ? true : false
      }
    })
  }

  manipulateAttrs (attributeData) {
    let ids = []
    const comboFor = attributeData.map((attr) => {
      ids.push(attr.attributeId)
      attr.data.shift()
      return attr.data
    })
    let newData1 = []
    for (let i = 0; i < this.masterData['Attributes'].length; i++) {
      newData1.push({
        id: ids[i],
        text: this.masterData['Attributes'][i]
      })
    }
    this.masterData['attrKeySelect2Data'] = newData1
    this.generateAttrs(comboFor)
  }

  generateAttrs (comboFor) {
    let idsArr = []
    let textArr = []
    comboFor.forEach((attrData, index) => {
      idsArr[index] = []
      textArr[index] = []
      attrData.forEach(element => {
        idsArr[index].push(element['id'])
        textArr[index].push(element['text'])
      })
    })
    // console.log(idsArr, textArr)
    this.masterData['AttributeIdStr'] = this.gs.allPossibleCases(idsArr)
    this.masterData['AttributeNamestr'] = this.gs.allPossibleCases(textArr)
    let arr = []
    let newData = []
    for (let i = 0; i < this.masterData['AttributeIdStr'].length; i++) {
      const obj = {
        AttributeStr: this.masterData['AttributeIdStr'][i],
        AttributeNameStr: this.masterData['AttributeNamestr'][i]
      }
      arr.push(obj)
      const obj1 = {
        id: this.masterData['AttributeIdStr'][i],
        text: this.masterData['AttributeNamestr'][i]
      }
      newData.push(obj1)
    }
    this.masterData['attrSelect2Data'] = newData
    this.isLoadingAttributes = false
    this.attrCombos = JSON.parse(JSON.stringify(arr))
  }

  checkForSelectedIndex () {
    this.masterItemData.forEach((element) => {
      delete element['attrCombs']
      element['show'] = false
    })
    this.masterItemData = JSON.parse(JSON.stringify(this.masterItemData))
  }

  onAttrKeySelect (data: {value: string[], data: any}) {
    console.log('attr key select : ', data)
    let attributeData = JSON.parse(JSON.stringify(this.masterData['AttributesDataCopy']))
    this.selectedAttrKeys = data.value
    console.log(data)
    if (data.value.length > 0) {
      this.masterData['Attributes'] = []
      data.data.forEach((element) => {
        this.masterData['Attributes'].push(element.text)
      })
      const comboFor = attributeData.filter(element => {
        if (data.value.indexOf('' + element.attributeId) > -1) {
          return element
        }
      }).map((attr) => {
        attr.data.shift()
        return attr.data
      })
      console.log('combo for : ', comboFor)
      this.generateAttrs(comboFor)
      this.checkForSelectedIndex()
    } else {
      this.masterData['Attributes'] = JSON.parse(JSON.stringify(this.masterData['AttributesCopy']))
      this.backToOrginal()
    }
    setTimeout(() => {
      this.searchFilter()
    }, 0)
  }

  onAttrSelect (data: {value: string[], data: any}) {
    console.log('attr select : ', data)
    let arr = []
    if (data.value.length > 0) {
      this.masterData['AttributeIdStr'] = data.value
      this.masterData['AttributeNamestr'] = []
      data.data.forEach((element) => {
        this.masterData['AttributeNamestr'].push(element.text)
      })
      for (let i = 0; i < this.masterData['AttributeIdStr'].length; i++) {
        const obj = {
          AttributeStr: this.masterData['AttributeIdStr'][i],
          AttributeNameStr: this.masterData['AttributeNamestr'][i]
        }
        arr.push(obj)
      }
      this.attrCombos = JSON.parse(JSON.stringify(arr))
      this.checkForSelectedIndex()
    } else {
      if (this.selectedAttrKeys.length > 0) {
      } else {
        this.backToOrginal()
      }
    }
    setTimeout(() => {
      this.searchFilter()
    }, 0)
  }

  backToOrginal () {
    this.masterData['AttributeIdStr'] = JSON.parse(JSON.stringify(this.masterData['AttributeIdStrCopy']))
    this.masterData['AttributeNamestr'] = JSON.parse(JSON.stringify(this.masterData['AttributeNamestrCopy']))
    let arr = []
    let newData = []
    for (let i = 0; i < this.masterData['AttributeIdStr'].length; i++) {
      const obj = {
        AttributeStr: this.masterData['AttributeIdStr'][i],
        AttributeNameStr: this.masterData['AttributeNamestr'][i]
      }
      arr.push(obj)
      const obj1 = {
        id: this.masterData['AttributeIdStr'][i],
        text: this.masterData['AttributeNamestr'][i]
      }
      newData.push(obj1)
    }
    this.masterData['attrSelect2Data'] = newData
    this.isLoadingAttributes = false
    this.attrCombos = JSON.parse(JSON.stringify(arr))
    this.checkForSelectedIndex()
  }

  ngOnChanges (changes: SimpleChanges): void {
    console.log('changes : ', changes)
  }

  generateAttrCases () {
    if (this.selectedIndex >= 0) {
      if (typeof this.masterItemData[this.selectedIndex]['attrCombs'] == 'undefined') {
        let attrCombos = JSON.parse(JSON.stringify(this.attrCombos))
        this.getAttrCombos(attrCombos)
        // this.masterItemData[this.selectedIndex]['attrCombs'] = 
        // console.log('masterItemData : ', this.masterItemData[this.selectedIndex]['attrCombs'])
        this.getBarCodes()
      }
    }
  }

  getAttrCombos (attrCombos) {
    // let attrCombos = []
    const items = this.ItemAttributeDetails.filter((element) => {
      if (element.ItemId === this.masterItemData[this.selectedIndex]['ItemId']) {
        return element
      }
    })
    items.forEach(element => {
      attrCombos.forEach((combo, index) => {
        if (element.AttributeIdStr === combo.AttributeStr) {
          attrCombos[index] = element
          attrCombos[index]['AttributeStr'] = element.AttributeIdStr
          attrCombos[index]['AttributeNameStr'] = element.AttributeNamestr
        }
      })
    });
    console.log('new atts : ', attrCombos)
    this.masterItemData[this.selectedIndex]['attrCombs'] = attrCombos
  }

  getBarCodes () {
    let _self = this
    let idsBefore = []
    this.masterItemData[this.selectedIndex]['attrCombs'].forEach((element) => {
      // typeof element['Barcode'] == 'undefined' || 
      if (element['Barcode']) {
        idsBefore.push(element['AttributeStr'])
      }
    })
    // console.log('idsBefore : ', idsBefore)
    let diff = _.differenceWith(this.masterData['AttributeIdStr'], idsBefore)
    // console.log(diff)
    let length = -1
    if (diff.length > 0) {
      length = diff.length
    } else {
      length = this.masterData['AttributeIdStr'].length
    }
    if (length > 0) {
      this._itemmasterServices.getBarCodes(length)
      .subscribe(
        (data) => {
          // console.log('barcodes : ', data)
          let index = 0
          this.masterItemData[this.selectedIndex]['attrCombs'].forEach((element) => {
            if (!element['Barcode']) {
              element['Barcode'] = data[index].BarCode
              element['ClientBarCode'] = data[index].BarCode
              element['checked'] = false
              element['ItemId'] = this.masterItemData[this.selectedIndex]['ItemId']
              element['GroupId'] = 0
              element['Id'] = 0
              element['IsBaseGroup'] = 0
              element['ItemName'] = this.masterItemData[this.selectedIndex]['ItemName']
              element['ItemTransId'] = 0
              element['ParentTypeId'] = 0
              element['Qty'] = 0
              element['QtyValue'] = 0
              element['RateMrp'] = 0
              element['RateNrv'] = 0
              element['RateOur'] = 0
              element['RatePurchase'] = 0
              element['RateSale'] = 0
              index++
            }
          })
        },
        (error) => {
          console.log('error : ', error)
          _self.toastrService.showError(error, '')
        }
      )
    }
  }

  checkAllCombos (val: boolean) {
    this.masterItemData[this.selectedIndex]['attrCombs'].forEach((element) => {
      element['checked'] = val
    })
  }

  switchView () {
    // console.log(this.masterData.onlyItems)
    if (!this.masterData.onlyItems) {
      this.isLoadingAttributes = true
      this.getSPUtilityData()
    } else {
      this.getOpeningStkList()
    }
    // console.log(this.masterItemData)
  }

  checkForAttr (item) {
    if (item.show) {
      if (this.attrCombos.length === 0) {
        this.getSPUtilityData();
      } else {
        this.generateAttrCases()
      }
    }
  }

  checkAllItems (val: boolean) {
    this.masterItemData.forEach((element) => {
      element['checked'] = val
    })
  }

  ngOnInit() {
    this.initData();
    this.getOpeningStkList()
  }

  initData = () => {
    this.masterItemData = []
    this.masterData = {Attributes: [], AttributesCopy: [], AttributesDataCopy: [],  AttributeIdStr: [], AttributeNamestr: [], AttributeIdStrCopy: [], AttributeNamestrCopy: [], attrSelect2Data: [], attrKeySelect2Data: [], onlyItems: true};
    this.selectedIndex = -1
    this.attrCombos = []
    this.search = ''
    this.allItems = false
    this.isLoadingItems = true
    this.isLoadingAttributes = true
    this.ItemAttributeDetails = []
  }

  getOpeningStkList = () => {
    this.isLoadingItems = true
    this.gs.manipulateResponse(this.commonService.getOpeningStkList()).pipe(
      map(data => {
        this.isLoadingItems = false
        this.ItemAttributeDetails = data.ItemAttributeDetails
        console.log('main list : ', data)
        data.ItemDetails.forEach(element => {
          element['show'] = false
          element['checked'] = false
        })
        return data.ItemDetails
      })
    )
    .subscribe((data: any) => {
      this.isLoadingItems = false
      this.masterItemData = data
      console.log('get opening stk list : ', this.masterItemData)
    },
    (error) => {
      this.isLoadingItems = false
      this.toastrService.showError(error, '')
    });
  }

  getSPUtilityData = () => {
    this.gs.manipulateResponse(this.comboService.getSPUtilityData()).subscribe(
      async (data) => {
        if (data) {
          console.log('sp utility data : ', data)
          this.comboService.generateAttributes(data)
        }
      },
      (error) => {
        console.log(error)
        this.isLoadingAttributes = false
        this.toastrService.showError(error, '')
      }
    )
  }

  triggerModelOpen() {
    $('#opening-stk').modal('show')
  }

  cancelForm = () => {
    $('#opening-stk').modal('hide')
    // this.itemWithAttributeList = [...this.dummyItemDetails]
  }

  validateForm = () => {
    let valid = true;
    // let checkFor = []
    // if (this.masterData.onlyItems) {
    //   checkFor = this.masterItemData
    // } else {
    //   checkFor = this.getAllCombos()
    // }
    // _.map(checkFor, (element) => {
    //   if (element.checked === true) {
    //     if (!+element.Qty) {
    //       element.isInvalid = true
    //       valid = false
    //     }
    //     if (!+element.QtyValue) {
    //       element.isInvalid = true
    //       valid = false
    //     }
    //     if (!+element.RatePurchase) {
    //       element.isInvalid = true
    //       valid = false
    //     }
    //   }
    // })
    return valid;
  }

  getAllCombos () {
    let itemsAttrs = []
    const masterItemData = this.masterItemData.map(data => {
      if (typeof data['attrCombs'] == 'undefined') {
        return []
      } else {
        return data['attrCombs']
      }
    })
    .filter(data => data.length > 0)
    .forEach(element => {
      itemsAttrs = itemsAttrs.concat(element)
    })
    return itemsAttrs
  }

  getPostParams () {
    let filterFor = []
    if (this.masterData.onlyItems) {
      filterFor = this.masterItemData
    } else {
      filterFor = this.getAllCombos()
    }
    let dataToPost = filterFor.filter(item => item.checked === true)
    console.log('data to post : ', dataToPost)
    let obj = {
      ItemAttributewithrates: dataToPost
    }
    console.log(JSON.stringify(obj))
    return obj
  }

  postFormData () {
    this.gs.manipulateResponse(this.commonService.postOpeningStkList(this.getPostParams())).subscribe((data) => {
      if (data) {
        this.toastrService.showSuccess('Success','Saved Successfully')
        this.initData()
        this.cancelForm()
      }
    }, (error) => {
      console.log(error)
      this.toastrService.showError(error, '');
    })
   }

   onPurchaseRateChange = (i, j?) => {
    let attrComb;
    if (j >= 0) {
      attrComb = this.masterItemData[i]['attrCombs'][j]
    } else {
      attrComb = this.masterItemData[i]
    }
    if (+attrComb.RatePurchase > 0 && +attrComb.Qty > 0) {
      attrComb.QtyValue = (attrComb.Qty * attrComb.RatePurchase).toFixed(2);
    } else if (+attrComb.QtyValue > 0 && +attrComb.RatePurchase > 0) {
      attrComb.Qty = (attrComb.QtyValue / attrComb.RatePurchase).toFixed(2);
    }
  }

  onOpeningStockChange = (i, j?) => {
    let attrComb;
    if (j >= 0) {
      attrComb = this.masterItemData[i]['attrCombs'][j]
    } else {
      attrComb = this.masterItemData[i]
    }
    if (+attrComb.RatePurchase > 0 && +attrComb.Qty > 0) {
      attrComb.QtyValue = (attrComb.Qty * attrComb.RatePurchase).toFixed(2);
    } else if (+attrComb.QtyValue > 0 && +attrComb.Qty > 0) {
      attrComb.RatePurchase = (attrComb.QtyValue / attrComb.Qty).toFixed(2);
    }
  }

  onOpeningStockValueChange = (i, j?) => {
    let attrComb;
    if (j >= 0) {
      attrComb = this.masterItemData[i]['attrCombs'][j]
    } else {
      attrComb = this.masterItemData[i]
    }
    if (+attrComb.Qty > 0 && +attrComb.QtyValue > 0) {
      attrComb.RatePurchase = (attrComb.QtyValue / attrComb.Qty).toFixed(2)
    } else if (+attrComb.RatePurchase > 0 && +attrComb.QtyValue > 0) {
      attrComb.Qty = (attrComb.QtyValue / attrComb.RatePurchase).toFixed(2)
    }
  }

  searchFilter () {
    if (!this.masterData.onlyItems) {
      const allCards = $('.card')
      for (let i = 0; i < allCards.length; i++) {
        if (typeof allCards[i].children[0].children[1] != 'undefined' ) {
          let elem = '' + allCards[i].children[0].children[1].innerText
          // console.log(this.search)
          if (!this.search.trim()) {
            allCards[i].style.display = 'block'
          } else {
            if (elem.trim().toUpperCase().includes(this.search.trim().toUpperCase())) {
              allCards[i].style.display = 'block'
            } else {
              allCards[i].style.display = 'none'
            }
          }
        }
      }
    }
  }

  updateBarCode (i, j?) {
    let attrComb;
    if (j >= 0) {
      attrComb = this.masterItemData[i]['attrCombs'][j]
    } else {
      attrComb = this.masterItemData[i]
    }
    attrComb['Barcode'] = attrComb['ClientBarCode']
  }
}

  // this.masterItemData.forEach((element) => {
    //   if (typeof element['attrCombs'] != 'undefined') {
    //     for (let i = 0; i < this.attrCombos.length; i++) {
    //       const attr = this.attrCombos[i]['AttributeStr'];
    //       const combos = element['attrCombs'].filter(combo => {
    //         if (attr.indexOf(combo['AttributeStr']) > -1) {
    //           return combo
    //         }
    //       })
    //     }
    //   }
    // })
    // allChecked: boolean = false;
  // isProgress: boolean;
  // isLoading: boolean = true;
  // isAttribute = false
  // itemWithAttributeList:Array<any> = []
  // dummyItemWithAttributeList:Array<any> = []
  // attribute: Array<any> = [];
  // editAttributeData: any[];
  // attributeStoredList: any[];
  // dummyItemDetails: any[];
  // selectedAttributeCombination: any = []
  // attributeCombinationList: Array<any> = []


  /*
  comboFor.forEach((attrData, index) => {
    idsArr[index] = []
    textArr[index] = []
    attrData.forEach(element => {
      idsArr[index].push(element['id'])
      textArr[index].push(element['text'])
    })
  })
  this.masterData['AttributeIdStr'] = this.gs.allPossibleCases(idsArr)
  this.masterData['AttributeNamestr'] = this.gs.allPossibleCases(textArr)
  let arr = []
  let newData = []
  for (let i = 0; i < this.masterData['AttributeIdStr'].length; i++) {
    const obj = {
      AttributeStr: this.masterData['AttributeIdStr'][i],
      AttributeNameStr: this.masterData['AttributeNamestr'][i]
    }
    arr.push(obj)
    const obj1 = {
      id: this.masterData['AttributeIdStr'][i],
      text: this.masterData['AttributeNamestr'][i]
    }
    newData.push(obj1)
  }
  this.masterData['attrSelect2Data'] = newData
  console.log('arr : ', arr)
  this.attrCombos = arr
  */