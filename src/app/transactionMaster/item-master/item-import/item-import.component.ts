import { Component, OnDestroy, ViewChild, ElementRef } from '@angular/core'
import { Subscription } from 'rxjs'
import * as XLSX from 'ts-xlsx'
import { GlobalService } from '../../../commonServices/global.service'
import { ToastrCustomService } from '../../../commonServices/toastr.service'
import { UIConstant } from '../../../shared/constants/ui-constant'
import { ImportExportItem, AddCust } from '../../../model/sales-tracker.model'
import { ItemmasterServices } from 'src/app/commonServices/TransactionMaster/item-master.services'
import { Select2OptionData, Select2Component } from 'ng2-select2'
import { CommonService } from 'src/app/commonServices/commanmaster/common.services'
import { Settings } from 'src/app/shared/constants/settings.constant'
import { SetUpIds } from '../../../shared/constants/setupIds.constant';
import * as _ from 'lodash';
declare const $: any
@Component({
  selector: 'app-item-import',
  templateUrl: './item-import.component.html',
  styleUrls: ['./item-import.component.css']
})
export class ItemImportComponent implements OnDestroy {
  sheetname: any = []
  taxMastertableDiv: boolean
  masterData: any
  subcribe: any
  array: any
  modalOpen: Subscription
  masterTableArray: any[]
  file: any
  insideArray: any
  arrayBuffer: any
  selectAll: boolean = false
  loading: boolean = true
  categoryPlaceholder: Select2Options
  taxPlaceholder: Select2Options
  categoryType: Array<Select2OptionData>
  taxType: Array<Select2OptionData>
  brandTypes: Array<Select2OptionData>
  brandPlaceholder: any[]
  dropdownSettings: any = {}
  catValue: any
  taxValue: any
  categoryId: number = 0
  taxId: number = 0
  searchText: string = ''
  selectedItems: any = []
  duplicateTuples: any = []
  correctTuples: any = []
  itemImport: any = []
  itemImportKeys: any = []
  brands: string = ''
  pendingList: any = []
  isPending: boolean = false
  @ViewChild('myInput')
  myInputVariable: ElementRef
  firstSheetName: any
  newCategoryAddSub: Subscription
  newTaxAddSub: Subscription
  modeOfForm: string = 'new'
  isDataLoading: boolean = false
  isLoading: boolean = true
  constructor (private commonService: CommonService,
     private gs: GlobalService, private toastrService: ToastrCustomService,
     private _itemmasterServices: ItemmasterServices, private settings: Settings
     ) {
    this.modalOpen = this.commonService.getItemImportStatus().subscribe(
      (status: any) => {
        if (status.open) {
          this.modeOfForm = 'new'
          this.openModal()
        } else {
          this.closeModal()
        }
      }
    )

    this.newCategoryAddSub = this.commonService.getCategoryStatus().subscribe(
      (data: AddCust) => {
        if (data.id && data.name) {
          let newData = Object.assign([], this.categoryType)
          newData.push({ id: data.id, text: data.name })
          this.categoryType = newData
          this.categoryId = +data.id
          this.catValue = data.id
        }
      }
    )
    this.newTaxAddSub = this.commonService.getTaxStatus().subscribe(
      (data: AddCust) => {
        if (data.id && data.name) {
          let newData = Object.assign([], this.taxType)
          newData.push({ id: data.id, text: data.name })
          this.taxType = newData
          this.taxId = +data.id
          this.taxValue = data.id
        }
      }
    )

    this.newCategoryAddSub = this.commonService.getCatImportAddStatus.subscribe(
      () => {
        this.getCategoryDetails()
      }
    )
  }

  toggleSelect (evt) {
    const all = $('.item-container')
    for (let i = 0;i <= all.length - 1;i++) {
      $('.item-container')[i].checked = evt.target.checked
      if (evt.target.checked) {
        this.selectedItems.push(+$('.item-container')[i].id)
      } else {
        let index = this.selectedItems.indexOf(+$('.item-container')[i].id)
        if (index > -1) {
          this.selectedItems.splice(index,1)
        }
      }
    }
  }

  onItemToggle (index, SNO, evt) {
    // console.log('index : ', index)
    // console.log('evt : ', evt.target.id)
    if (index > -1) {
      if (evt.target.checked) {
        this.selectedItems.push(SNO)
      } else {
        let i = this.selectedItems.indexOf(SNO)
        if (i > -1) {
          this.selectedItems.splice(i,1)
        }
      }
      $('#' + SNO)[0].checked = evt.target.checked
      // console.log('selectedItems : ', this.selectedItems)
    }
  }

  isAdding: boolean
  addToQueue () {
    let itemImport = []
    this.isAdding = true
    this.selectedItems.forEach(item => {
      for (let i = 0; i < this.masterData.length; i++) {
        if (item === this.masterData[i]['SNO']) {
          itemImport.push(this.masterData[i])
          itemImport[itemImport.length - 1]['BRANDIDS'] = this.brands
          itemImport[itemImport.length - 1]['CATEGORY'] = !isNaN(this.categoryId) ? this.categoryId : 0
          itemImport[itemImport.length - 1]['TAXID'] = !isNaN(this.taxId) ? this.taxId : 0
        }
      }
    })
    this.selectedItems.forEach(item => {
      for (let i = 0; i < this.masterData.length; i++) {
        if (item === this.masterData[i]['SNO']) {
          this.masterData.splice(i, 1)
        }
      }
    })
    this.selectedItems = []
    this.itemImport = this.itemImport.concat(itemImport)
    this.isAdding = false
    this.searchText = ''
    this.commonService.fixTableHF('item-import-table')
  }

  checkForDuplicates () {
    this.masterData = this.gs.mergesort(this.masterData)
    // console.log('new master data : ', this.masterData)
    let itemImportKeys = { ...this.masterKeys }
    this.itemImportKeys = Object.values(itemImportKeys)
    // console.log('itemImportKeys : ', this.itemImportKeys)
    this.itemImportKeys.push('CATEGORY')
    this.itemImportKeys.push('TAXID')
    this.itemImportKeys.push('BRANDIDS')
    this.duplicateTuples = []
    for (let i = 0; i < this.masterData.length - 1; i++) {
      if (this.masterData[i]['NAME'].toLowerCase() === this.masterData[i + 1]['NAME'].toLowerCase()) {
        this.duplicateTuples.push(this.masterData[i])
        this.masterData[i]['DUPLICATE'] = true
      }
    }
    if (this.duplicateTuples.length > 0) {
      this.toastrService.showErrorLong('Pleae remove the duplicate items in order to move further', '')
    }
    // console.log('duplicates : ', this.duplicateTuples)
  }

  removeItem (index, item) {
    this.masterData.splice(index,1)
    this.itemImport.splice(index,1)
    for (let i = 0; i < this.duplicateTuples.length; i++) {
      if (this.duplicateTuples[i]['NAME'].toLowerCase() === item['NAME'].toLowerCase()) {
        this.duplicateTuples.splice(i, 1)
        break
      }
    }
    // console.log('duplicate tuples : ', this.duplicateTuples)
  }

  @ViewChild('cat_select2') catSelect2: Select2Component
  selectCategory (event) {
    // console.log('on select of category : ', event)
    if (event.value && event.data.length > 0) {
      if (+event.value === -1 && event.data[0] && event.data[0].text === UIConstant.ADD_NEW_OPTION) {
        this.catSelect2.selector.nativeElement.value = ''
        this.commonService.openCategory('', '1')
      } else {
        this.categoryId = +event.value
      }
    } else {
      this.categoryId = 0
    }
  }

  @ViewChild('tax_select2') taxSelect2: Select2Component
  selectedTax (event) {
    // console.log('on select of tax : ', event)
    if (event.value && event.data.length > 0) {
      if (+event.value === -1 && event.data[0] && event.data[0].text === UIConstant.ADD_NEW_OPTION) {
        this.taxSelect2.selector.nativeElement.value = ''
        this.commonService.openTax('')
      } else {
        this.taxId = +event.value
      }
    } else {
      this.taxId = 0
    }
  }

  getPendingList () {
    this.isLoading = true
    let _self = this
    this.gs.manipulateResponse(this._itemmasterServices.getPendingList()).subscribe(
      data => {
        console.log('pending list : ', data)
        if (data && data.length > 0) {
          _self.isPending = true
          _self.generateList(data)
        } else {
          _self.isPending = false
          _self.isLoading = false
        }
      },
      (error) => {
        this.toastrService.showError(error, '')
        _self.isLoading = false
      }
    )
  }

  generateList (list) {
    let _self = this
    this.masterData = []
    let index = 0
    let masterKeys = ['Sno','Name','HsnNo','BarCode','Id','ItemCode','ItemType',
      'MRPRate','OurPrice','PackingType','PurchaseRate','ReOrderQty','SaleRate',
      'TaxId','Unit', 'OpeningStockValue', 'MaxStock','MinStock',
      'OpeningStock', 'IsNotDiscountable',
      'IsTradeDiscountApply','IsVolumeDiscountApply'
    ]
    this.masterKeys = ['SNO', 'NAME', 'HSNNO', 'CATEGORY','TAXID',
      'BARCODE', 'ITEMCODE','BRANDIDS',
      'ITEMTYPE', 'PACKINGTYPE', 'SALERATE',
      'PURCHASERATE', 'MRPRATE',
      'OURPRICE', 'OPENINGSTOCK', 'OPENINGSTOCKVALUE',
      'MINSTOCK', 'MAXSTOCK', 'REORDERQTY',
      'ISNOTDISCOUNTABLE', 'ISVOLUMEDISCOUNTAPPLY', 'ISTRADEDISCOUNTAPPLY']
    this.itemImportKeys = [...this.masterKeys]
    list.forEach(element => {
      index += 1
      let newRow = {}
      for (let j = 0; j < masterKeys.length; j++) {
        newRow[masterKeys[j].toUpperCase()] = element[masterKeys[j]]
      }
      newRow['SNO'] = +index
      newRow['PURCHASERATE'] = +newRow['PURCHASERATE']
      newRow['MRPRATE'] = +newRow['MRPRATE']
      newRow['OURPRICE'] = +newRow['OURPRICE']
      newRow['SALERATE'] = +newRow['SALERATE']
      newRow['OPENINGSTOCK'] = +newRow['OPENINGSTOCK']
      newRow['OPENINGSTOCKVALUE'] = +newRow['OPENINGSTOCKVALUE']
      newRow['MINSTOCK'] = +newRow['MINSTOCK']
      newRow['MAXSTOCK'] = +newRow['MAXSTOCK']
      newRow['REORDERQTY'] = +newRow['REORDERQTY']
      // newRow['NRV'] = isNaN(+newRow['NRV']) ? 0 : +newRow['NRV']
      _self.masterData.push(newRow)
    })
    _self.isLoading = false
  }

  getCategoryDetails () {
    this.categoryPlaceholder = { placeholder: 'Select Category' }
    let newData = [{ id: UIConstant.BLANK, text: 'Select Category' }, { id: '-1', text: UIConstant.ADD_NEW_OPTION }]
    this._itemmasterServices.getAllSubCategories(1).subscribe(data => {
      // console.log('categories : ', data)
      if (data.Code === UIConstant.THOUSAND && data.Data) {
        data.Data.forEach(element => {
          newData.push({
            id: element.Id,
            text: element.Name
          })
        })
        newData = Object.assign([], newData)
        this.categoryType = newData
      }
    },
    (error) => {
      console.log(error)
    },
    () => {
      this.loading = false
    })
  }

  getTaxtDetail (value) {
    this.taxPlaceholder = { placeholder: 'select Tax' }
    let newData = [{ id: UIConstant.BLANK, text: 'Select Tax' }, { id: '-1', text: UIConstant.ADD_NEW_OPTION }]
    this._itemmasterServices.getTaxDetail().subscribe(data => {
      if (data.Code === UIConstant.THOUSAND && data.Data.TaxSlabs) {
        data.Data.TaxSlabs.forEach(element => {
          newData.push({
            id: element.Id,
            text: element.Slab
          })
        })
        this.taxType = newData
      }
    },
    (error) => {
      console.log(error)
    },
    () => {
      this.loading = false
    })

  }

  getBrandDetail (brand) {
    this.brandTypes = []
    this._itemmasterServices.getBrandDetail().subscribe(data => {
      // console.log('brand types : ', data)
      if (data && data.Data) {
        this.brandPlaceholder = [{ id: UIConstant.BLANK, text: 'SelectBrand' }]
        if (data.Data && data.Code === UIConstant.THOUSAND) {
          let newData = []
          data.Data.forEach(element => {
            newData.push({
              id: element.Id,
              text: element.Name
            })
          })
          this.brandTypes = newData
        }
      }
    },
    (error) => {
      console.log(error)
    },
    () => {
      this.loading = false
    })
  }

  ngOnDestroy () {
    this.modalOpen.unsubscribe()
  }

  onBrandSelect (data: {value: string[]}) {
    this.brands = data.value.join(',')
  }

  public options: Select2Options

  initComp () {
    this.options = {
      multiple: true
    }
    this.insideArray = []
    this.sheetname = []
    this.masterTableArray = []
    this.array = []
    this.duplicateTuples = []
    this.file = []
    this.itemImportKeys = []
    this.masterKeys = []
    this.itemImport = []
    this.selectedItems = []
    this.masterData = []
    $('.fixTable').tableHeadFixer({
      'thead': false,
      'left': 1
    })
    if (this.modeOfForm === 'new') {
      // this.pendingList = false
      this.getPendingList()
      this.getCategoryDetails()
      this.getTaxtDetail(0)
      this.getBrandDetail(0)
      $('#item-import-modal').removeClass('fadeOut')
      $('#item-import-modal').addClass('fadeInDown')
      $('#item-import-modal').modal(UIConstant.MODEL_SHOW)
    }
    this.reset()
    this.uploadData('')
  }

  openModal () {
    this.getSetUpModules((JSON.parse(this.settings.moduleSettings).settings))
    this.reset()
    this.initComp()
  }

  autoBarCode: boolean = false
  autoItemCode: boolean = false
  getSetUpModules(settings) {
    settings.forEach(element => {
      if (element.id === SetUpIds.autoGeneratedBarcode) {
        this.autoBarCode = element.val
      }
      if (element.id === SetUpIds.autoGneratedItemCode) {
        this.autoItemCode = element.val
      }
    })
  }

  closeModal () {
    if ($('#item-import-modal').length > 0) {
      $('#item-import-modal').modal(UIConstant.MODEL_HIDE)
    }
  }

  reset () {
    if (this.myInputVariable && this.myInputVariable.nativeElement.files.length > 0) {
      // console.log(this.myInputVariable.nativeElement.files)
      this.myInputVariable.nativeElement.value = ''
      // console.log(this.myInputVariable.nativeElement.files)
    }
  }

  isSaving: boolean
  saveItemImport (value) {
    this.isSaving = true
    if (this.isPending) {
      this._itemmasterServices.postPendingList(this.itemImportParams()).subscribe(data => {
        console.log('item import : ', data)
        if (data.Code === UIConstant.THOUSAND) {
          this.toastrService.showSuccess('Success', 'File Saved')
          this.isSaving = false
          if (value === 'new') {
            this.commonService.onAddItemMaster()
            this.commonService.closeItemImport()
          }
          if (value === 'reset') {
            this.modeOfForm = 'new'
            this.initComp()
          }
        } else if (data.Code === UIConstant.PARTIALLY_SAVED) {
          this.isSaving = false
          this.toastrService.showInfo('', data.Message)
          if (value === 'new') {
            this.commonService.onAddItemMaster()
            this.commonService.closeItemImport()
          }
          if (value === 'reset') {
            this.modeOfForm = 'new'
            this.initComp()
          }
        } else {
          this.isSaving = false
          this.toastrService.showError('Oops', data.Message)
        }
      })
    } else {
      this._itemmasterServices.postItemImport(this.itemImportParams()).subscribe(data => {
        console.log('item import : ', data)
        if (data.Code === UIConstant.THOUSAND) {
          this.toastrService.showSuccess('Success', 'File Saved')
          this.isSaving = false
          if (value === 'new') {
            this.commonService.onAddItemMaster()
            this.commonService.closeItemImport()
          }
          if (value === 'reset') {
            this.modeOfForm = 'new'
            this.initComp()
          }
        } else if (data.Code === UIConstant.PARTIALLY_SAVED) {
          this.isSaving = false
          this.toastrService.showInfo('', data.Message)
          if (value === 'new') {
            this.commonService.onAddItemMaster()
            this.commonService.closeItemImport()
          }
          if (value === 'reset') {
            this.modeOfForm = 'new'
            this.initComp()
          }
        } else {
          this.isSaving = false
          this.toastrService.showError('Oops', data.Message)
        }
      })
    }
  }

  private itemImportParams (): ImportExportItem {
    let newMasterData = [ ...this.masterData ]
    if (!this.isPending) {
      newMasterData.forEach(data => {
        data['TAXID'] = 0
        data['CATEGORY'] = 0
        data['BRANDIDS'] = ''
      })
    }
    let objToSend = Object.assign([], newMasterData, this.itemImport)
    const itemElement = {
      itemObj: {
        ImportItems: objToSend
      }
    }
    console.log('obj: ', JSON.stringify(itemElement.itemObj))
    return itemElement.itemObj
  }

  public uploadData (event: any): void {
    if (event) {
      // console.log('file event : ', event)
      this.sheetname = []
      this.masterTableArray = []
      this.masterData = []
      this.duplicateTuples = []
      this.selectedItems = []
      this.itemImport = []
      this.itemImportKeys = []
      if (event.target && event.target.files.length > 0) {
        this.isDataLoading = true
        this.file = event.target.files[0]
        this.readingData()
      }
    }
  }
  masterKeys: any[]
  masterValues: any[]
  readingData () {
    this.insideArray = []
    this.sheetname = []
    this.masterTableArray = []
    this.array = []
    let fileReader = new FileReader()
    this.masterData = []
    let _self = this
    fileReader.readAsArrayBuffer(this.file)
    fileReader.onload = (e) => {
      this.arrayBuffer = fileReader.result
      let data = new Uint8Array(this.arrayBuffer)
      let arr = new Array()
      for (let i = 0; i !== data.length; ++i) arr[i] = String.fromCharCode(data[i])
      let bstr = arr.join('')
      let workbook = XLSX.read(bstr, { type: 'binary' })
      this.sheetname = workbook.SheetNames
      this.firstSheetName = workbook.SheetNames[0]
      let worksheet = workbook.Sheets[this.firstSheetName]
      let masterTableArray = []
      if (this.sheetname[0] === 'data') {
        // this.masterTableArray = XLSX.utils.sheet_to_json(worksheet, { defval: '' })
        masterTableArray = XLSX.utils.sheet_to_json(worksheet, { raw: true })
      }
      this.masterTableArray = masterTableArray.splice(0, masterTableArray.length)
      // console.log('masterTableArray : ', this.masterTableArray)
      // check validation
      if (this.masterTableArray.length > 0) {
        let keysArr = Object.values(XLSX.utils.sheet_to_json(worksheet, { header: 1 })[0])
        keysArr = this.gs.removeSpecialCharacters(keysArr)
        // console.log('keysArr : ', keysArr)
        let mandatoryKeys = ['SNO', 'NAME', 'HSNNO', 'UNIT', 'BARCODE', 'ITEMCODE',
        'ITEMTYPE', 'PACKINGTYPE', 'SALERATE', 'PURCHASERATE', 'MRPRATE',
        'OURPRICE', 'OPENINGSTOCK', 'OPENINGSTOCKVALUE', 'MINSTOCK', 'MAXSTOCK', 'REORDERQTY',
        'ISNOTDISCOUNTABLE', 'ISVOLUMEDISCOUNTAPPLY', 'ISTRADEDISCOUNTAPPLY']
        // console.log('mandatory keys : ', mandatoryKeys)
        this.masterKeys = mandatoryKeys
        const resp = this.gs.checkForEqualityInArray(mandatoryKeys, keysArr)
        if (resp !== '') {
          this.toastrService.showErrorLong(resp, '')
          this.reset()
          this.modeOfForm = 'reset'
          this.initComp()
          this.isDataLoading = false
        } else {
          let index = 0
          this.masterTableArray.forEach(element => {
            let keysArr = Object.keys(element)
            let newRow = {}
            for (let j = 0; j < keysArr.length; j++) {
              let key = keysArr[j].trim().toUpperCase()
              // this.gs.removeSpecialCharacter(
              if (key === 'BARCODE') {
                newRow[key] = this.gs.removeSpecialCharacter(element[keysArr[j]])
              } else if (key === 'ITEMCODE') {
                newRow[key] = this.gs.removeSpecialCharacter(element[keysArr[j]])
              } else {
                newRow[key] = ('' + element[keysArr[j]]).trim()
              }
            }
            // console.log('row : ', newRow)
            newRow = this.gs.removeSpecialCharacters(newRow)
            index += 1
            newRow['SNO'] = index
            newRow['PURCHASERATE'] = (+newRow['PURCHASERATE'] > 0) ? +newRow['PURCHASERATE'] : 0
            newRow['MRPRATE'] = (+newRow['MRPRATE'] > 0 ) ? +newRow['MRPRATE'] : 0
            newRow['OURPRICE'] = (+newRow['OURPRICE'] > 0 ) ? +newRow['OURPRICE'] : 0
            newRow['SALERATE'] = (+newRow['SALERATE'] > 0 ) ? +newRow['SALERATE'] : 0
            newRow['OPENINGSTOCK'] = (+newRow['OPENINGSTOCK'] > 0 ) ? +newRow['OPENINGSTOCK'] : 0
            newRow['OPENINGSTOCKVALUE'] = (+newRow['OPENINGSTOCKVALUE'] > 0 ) ? +newRow['OPENINGSTOCKVALUE'] : 0
            newRow['MINSTOCK'] = (+newRow['MINSTOCK'] > 0 ) ? +newRow['MINSTOCK'] : 0
            newRow['MAXSTOCK'] = (+newRow['MAXSTOCK'] > 0 ) ? +newRow['MAXSTOCK'] : 0
            newRow['REORDERQTY'] = (+newRow['REORDERQTY'] > 0 ) ? +newRow['REORDERQTY'] : 0
            // this.masterKeys = Object.keys(newRow)
            if (!newRow['NAME']) {
              this.toastrService.showErrorLong('Name is Required at SNO. ' + newRow['SNO'], newRow['NAME'])
              this.modeOfForm = 'reset'
              this.initComp()
              this.isDataLoading = false
              return false
            } 
            // else if (!newRow['HSNNO']) {
            //   this.toastrService.showErrorLong('HSNNO is Required at SNO. ' + newRow['SNO'], newRow['HSNNO'])
            //   this.modeOfForm = 'reset'
            //   this.initComp()
            //   this.isDataLoading = false
            //   return false
            // } 
            else if (!this.gs.checkForValidNumbers(+newRow['PURCHASERATE'])) {
              this.toastrService.showErrorLong('Invalid PURCHASERATE Value ' + 'at SNO. ' + newRow['SNO'], newRow['PURCHASERATE'])
              this.modeOfForm = 'reset'
              this.initComp()
              this.isDataLoading = false
              return false
            } else if (!this.gs.checkForValidNumbers(newRow['MRPRATE'])) {
              this.toastrService.showErrorLong('Invalid MRPRATE Value ' + 'at SNO. ' + newRow['SNO'], newRow['MRPRATE'])
              this.modeOfForm = 'reset'
              this.initComp()
              this.isDataLoading = false
              return false
            } else if (!this.gs.checkForValidNumbers(+newRow['OURPRICE'])) {
              this.toastrService.showErrorLong('Invalid OURPRICE Value ' + 'at SNO. ' + newRow['SNO'], newRow['OURPRICE'])
              this.modeOfForm = 'reset'
              this.initComp()
              this.isDataLoading = false
              return false
            } else if (!this.gs.checkForValidNumbers(+newRow['SALERATE'])) {
              this.toastrService.showErrorLong('Invalid SALERATE Value ' + 'at SNO. ' + newRow['SNO'], +newRow['SALERATE'])
              this.modeOfForm = 'reset'
              this.initComp()
              this.isDataLoading = false
              return false
            } else if (!this.gs.checkForValidNumbers(+newRow['OPENINGSTOCK'])) {
              this.toastrService.showErrorLong('Invalid OPENINGSTOCK Value ' + 'at SNO. ' + newRow['SNO'], newRow['OPENINGSTOCK'])
              this.modeOfForm = 'reset'
              this.initComp()
              this.isDataLoading = false
              return false
            } else if (!this.gs.checkForValidNumbers(+newRow['OPENINGSTOCKVALUE'])) {
              this.toastrService.showErrorLong('Invalid OPENINGSTOCKVALUE Value ' + 'at SNO. ' + newRow['SNO'], newRow['OPENINGSTOCKVALUE'])
              this.modeOfForm = 'reset'
              this.initComp()
              this.isDataLoading = false
              return false
            } else if (!this.gs.checkForValidNumbers(+newRow['MINSTOCK'])) {
              this.toastrService.showErrorLong('Invalid MINSTOCK Value ' + 'at SNO. ' + newRow['SNO'], newRow['MINSTOCK'])
              this.modeOfForm = 'reset'
              this.initComp()
              this.isDataLoading = false
              return false
            } else if (!this.gs.checkForValidNumbers(+newRow['MAXSTOCK'])) {
              this.toastrService.showErrorLong('Invalid MAXSTOCK Value ' + 'at SNO. ' + newRow['SNO'], newRow['MAXSTOCK'])
              this.modeOfForm = 'reset'
              this.initComp()
              this.isDataLoading = false
              return false
            } else {
              // let newRow1 = Object.assign({}, { selected: false }, newRow)
              let obj = { ...newRow }
              this.masterData.push(obj)
              if (this.masterData.length === this.masterTableArray.length) {
                // console.log(this.masterData)
                this.masterKeys = Object.keys(_self.masterData[0])
                // console.log(this.masterKeys)
                this.checkForDuplicates()
                this.isDataLoading = false
              }
            }
          })
          // this.masterKeys = Object.keys(_self.masterData[0])
          // this.masterKeys = mandatoryKeys
          // console.log('masterdata: ', JSON.stringify(_self.masterData))
        }
      } else {
        this.toastrService.showError('Oops', 'No Data Found')
        this.reset()
        this.isDataLoading = false
      }
    }
  }

  deleteList () {
    let strId = this.generateDeleteList()
    console.log('strId : ', strId)
    this.gs.manipulateResponse(this._itemmasterServices.deleteList(strId)).subscribe(
      () => {
        this.toastrService.showSuccess('Record Deleted Successfully', '')
        this.deleteDeleted()
      },
      (error) => {
        this.toastrService.showError(error, '')
      }
    )
  }

  generateDeleteList () {
    let strIds = []
    this.selectedItems.forEach(item => {
      for (let i = 0; i < this.masterData.length; i++) {
        if (item === this.masterData[i]['SNO']) {
          strIds.push({"Id": this.masterData[i]['ID']})
        }
      }
    })
    return strIds
  }

  deleteDeleted () {
    this.selectedItems.forEach(item => {
      for (let i = 0; i < this.masterData.length; i++) {
        if (item === this.masterData[i]['SNO']) {
          this.masterData.splice(i, 1)
        }
      }
    })
    if (this.masterData.length === 0) {
      this.modeOfForm = 'new'
      this.initComp()
    }
  }

  toDisable: boolean
  deleteDuplicates () {
    this.toDisable = true
    this.duplicateTuples.forEach(item => {
      for (let i = 0; i < this.masterData.length; i++) {
        if (item['SNO'] === this.masterData[i]['SNO']) {
          this.masterData.splice(i, 1)
        }
      }
    })
    setTimeout (() => {
      this.toDisable = false
      this.duplicateTuples = []
    }, 0)
  }
  
  opeCatImport () {
    this.commonService.openCatImport()
  }
  yesConfirmationClose() {
    $('#close_confirm5').modal(UIConstant.MODEL_HIDE)
    this.reset()
    this.masterData = []
    this.insideArray = []
    this.sheetname = []
    this.masterTableArray = []
    this.array = []
    this.duplicateTuples = []
    this.file = []
    this.itemImportKeys = []
    this.masterKeys = []
    this.itemImport = []
    this.isDataLoading = false
    this.isLoading = false
    this.commonService.closeItemImport()
  }
  closeConfirmation() {
    $('#close_confirm5').modal(UIConstant.MODEL_SHOW)
  }

  closeImportModal () {
    this.closeConfirmation()
  }
}
