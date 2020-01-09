import { Component, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { GlobalService } from 'src/app/commonServices/global.service';
import * as XLSX from 'xlsx';
import { CommonService } from '../../../../commonServices/commanmaster/common.services';
import { ToastrCustomService } from '../../../../commonServices/toastr.service';
import { UIConstant } from 'src/app/shared/constants/ui-constant';
import { LedgerCreationService } from '../../../../transactionMaster/ledger-creation/ledger-creation.service';
import { Select2Component } from 'ng2-select2';
import { ledgerImportExcel } from './ledger-import.model';
import { ItemmasterServices } from 'src/app/commonServices/TransactionMaster/item-master.services';
import { select2Return } from '../../../../super-admin/super-admin.model';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';
import { AddCust } from '../../../../model/sales-tracker.model';
/**
 * Component created by dolly garg
 */
declare const $: any
@Component({
  selector: 'ledger-import',
  templateUrl: './ledger-import.component.html',
  styleUrls: ['./ledger-import.component.css']
})
export class LedgerImportComponent {
  OnDestroy$: Subscription
  isvalidGROUPLEDGER:boolean;
  arrayBuffer: any
  sheetname: any = []
  masterData: any
  modalOpen: Subscription
  masterTableArray: any[]
  file: any
  loading: boolean = true
  @ViewChild('myInput') myInputVariable: ElementRef
  firstSheetName: any
  modeOfForm: string = 'new'
  ledgerData: any = []
  ledgerKeys: any = []
  duplicateTuples = []
  selectedItems = []
  isLoading: boolean = true
  pendingList: any = []
  isPending: boolean = false
  data = {}
  values = {}
  toShow = {}
  isDataLoading: boolean = false
  @ViewChild('group_select2') groupSelect2: Select2Component
  constructor (private commonService: CommonService,
     private gs: GlobalService, private toastrService: ToastrCustomService,
     private ledgerService: LedgerCreationService,
     private _itemmasterServices: ItemmasterServices
     ) {
    this.toShow = {'IsMsmed': false, 'IsRcm': false, 'TaxSlabId': false, 'ITCType': false, 'RCMType': false, 'HsnNo': false}
    this.modalOpen = this.ledgerService.openLedgerImport$.subscribe(
      (status: any) => {
        if (status.open) {
          this.data = {}
          this.getParentGroupData()
          this.getTaxtDetail()
          this.getRcmTypeList()
          this.getItcTypeList()
          this.openModal()
        } else {
          this.closeModal()
        }
      }
    )

    this.OnDestroy$ = this.ledgerService.select2$.subscribe((data: select2Return) => {
      if (data.data && data.type) {
        if (data.type === 'parent') {
          this.data['parentGroupData'] = data.data
        } else if (data.type === 'tax') {
          this.data['taxSlabData'] = data.data
        } else if (data.type === 'itc') {
          this.data['ITCTypeData'] = data.data
        } else if (data.type === 'rcm') {
          this.data['RCMTypeData'] = data.data
        }
      }
    })

    this.OnDestroy$ = this.commonService.getledgerGroupStatus().subscribe(
      (data: AddCust) => {
        if (data.id && data.name) {
          let newData = Object.assign([], this.data['parentGroupData'])
          newData.push({ id: data.id, text: data.name })
          this.data['parentGroupData'] = newData
          this.values['glidValue'] = data.id
          // this.groupSelect2.setElementValue(data.id)
        }
      }
     )
  }

  checkForGlid () {
    if (!_.isEmpty(this.values['GlId'])) {
      if (+this.values['GlId']['value'] > 0) {
        if (+this.values['GlId']['value'] === 4) {
          this.toShow = {'IsMsmed': true, 'IsRcm': true, 'TaxSlabId': false, 'ITCType': false, 'RCMType': false, 'HsnNo': false}
          this.values['TaxSlabId'] = false
          this.values['ITCType'] = false
          this.values['RCMType'] = false
          this.values['HsnNo'] = ''
        } else if (+this.values['GlId']['value'] === 13 || +this.values['GlId']['value'] === 15) {
          this.toShow = {'IsMsmed': false, 'IsRcm': false, 'TaxSlabId': true, 'ITCType': true, 'RCMType': true, 'HsnNo': true}
          this.values['IsRcm'] = false
          this.values['IsMsmed'] = false
        } else {
          this.toShow = {'IsMsmed': false, 'IsRcm': false, 'TaxSlabId': false, 'ITCType': false, 'RCMType': false, 'HsnNo': false}
          this.values['TaxSlabId'] = false
          this.values['ITCType'] = false
          this.values['RCMType'] = false
          this.values['HsnNo'] = ''
          this.values['IsRcm'] = false
          this.values['IsMsmed'] = false
        }
      } else {
        if (+this.values['GlId']['value'] === -1) {
          this.groupSelect2.selector.nativeElement.value = ''
          this.commonService.openledgerGroup('','')
        }
      }
    }
  }

  toggleSelect (evt) {
    const all = $('.ledger-container')
    for (let i = 0;i <= all.length - 1;i++) {
      $('.ledger-container')[i].checked = evt.target.checked
      if (evt.target.checked) {
        this.selectedItems.push(+$('.ledger-container')[i].id)
      } else {
        let index = this.selectedItems.indexOf(+$('.ledger-container')[i].id)
        if (index > -1) {
          this.selectedItems.splice(index,1)
        }
      }
    }
  }

  onItemToggle (index, SNO, evt) {
    console.log('index : ', this.data['parentGroupData'])
    console.log('evt : ',evt)
    // console.log(this.masterData[evt.target.id-1].GROUPLEDGER,this.data['parentGroupData'][i].text)
    if (index > -1) {
      if (evt.target.checked) {
        this.selectedItems.push(SNO);
        console.log(evt.target.dataset.id)
        this.isvalidGROUPLEDGER = null;
        this.masterData[evt.target.dataset.id].checked = true;
        console.log(this.masterData)
        for(let i=0;i<this.masterData.length;i++){
          console.log(this.masterData[i]);
          if(this.masterData[i].checked){
            if(this.masterData[i].GROUPLEDGER){
              for(let j=0;j<this.data['parentGroupData'].length;j++){
                if(this.masterData[i].GROUPLEDGER == this.data['parentGroupData'][j].text){
                  console.log('hi');
                  this.isvalidGROUPLEDGER = true;
                  break;
                }else if(j == this.data['parentGroupData'].length-1){
                  this.isvalidGROUPLEDGER = false;
                  break;
                }
              }
            }else{
              this.isvalidGROUPLEDGER = false;
              break;
            }
          }
        }
        // if(this.masterData[evt.target.dataset.id].GROUPLEDGER && this.isvalidGROUPLEDGER != false){
        //   for(let i=0;i<this.data['parentGroupData'].length;i++){
        //     if(this.masterData[evt.target.dataset.id].GROUPLEDGER == this.data['parentGroupData'][i].text){
        //       console.log('hi');
        //       this.isvalidGROUPLEDGER = true;
        //     }
        //   }
        // }else{
        //   this.isvalidGROUPLEDGER = false;
        // }
      } else {
        this.isvalidGROUPLEDGER = null;
        this.masterData[evt.target.dataset.id].checked = false;
        console.log(this.masterData)
        for(let i=0;i<this.masterData.length;i++){
          console.log(this.masterData[i]);
          if(this.masterData[i].checked){
            if(this.masterData[i].GROUPLEDGER){
              for(let j=0;i<this.data['parentGroupData'].length;j++){
                if(this.masterData[i].GROUPLEDGER == this.data['parentGroupData'][j].text){
                  console.log('hi');
                  this.isvalidGROUPLEDGER = true;
                  break;
                }else{
                  this.isvalidGROUPLEDGER = false;
                  break;
                }
              }
            }else{
              this.isvalidGROUPLEDGER = false;
              break;
            }
          }
        }
        let i = this.selectedItems.indexOf(SNO)
        if (i > -1) {
          this.selectedItems.splice(i,1)
        }
      }
      $('#' + SNO)[0].checked = evt.target.checked
      console.log('selectedItems : ', this.selectedItems)
    }
  }

  addToQueue () {
    let ledgerData = []
    this.selectedItems.forEach(item => {
      for (let i = 0; i < this.masterData.length; i++) {
        if (item === this.masterData[i]['SNO']) {
          ledgerData.push(this.masterData[i])
          ledgerData[ledgerData.length - 1]['ISMSMED'] = (this.values['IsMsmed']) ? +(this.values['IsMsmed']) : 0
          ledgerData[ledgerData.length - 1]['ISRCM'] = (this.values['IsRcm']) ? +(this.values['IsRcm']) : 0

          ledgerData[ledgerData.length - 1]['TAXSLABID'] = (this.values['TaxSlabId']) ? +this.values['TaxSlabId'].value : 0
          ledgerData[ledgerData.length - 1]['TAXSLAB'] = (this.values['TaxSlabId'] && this.values['TaxSlabId']['data'][0]['text']) ? this.values['TaxSlabId']['data'][0]['text'] : ''

          ledgerData[ledgerData.length - 1]['ITCTYPE'] = (this.values['ITCType']) ? +this.values['ITCType'].value : 0
          ledgerData[ledgerData.length - 1]['ITCTYPETEXT'] = (this.values['ITCType'] && this.values['ITCType']['data'][0]['text']) ? this.values['ITCType']['data'][0]['text'] : ''

          ledgerData[ledgerData.length - 1]['RCMTYPE'] = (this.values['RCMType']) ? +this.values['RCMType'].value : 0
          ledgerData[ledgerData.length - 1]['RCMTYPETEXT'] = (this.values['RCMType'] && this.values['RCMType']['data'][0]['text']) ? this.values['RCMType']['data'][0]['text'] : ''

          ledgerData[ledgerData.length - 1]['HSNNO'] = (this.values['HsnNo']) ? this.values['HsnNo'] : ''

          ledgerData[ledgerData.length - 1]['GLID'] = (this.values['GlId']) ? +this.values['GlId'].value : 0
          ledgerData[ledgerData.length - 1]['GLIDTEXT'] = (this.values['GlId'] && this.values['GlId']['data'][0]['text']) ? this.values['GlId']['data'][0]['text'] : ''
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
    console.log('master data : ', this.masterData)
    this.selectedItems = []
    this.ledgerData = this.ledgerData.concat(ledgerData)
    this.values['searchText'] = ''
    console.log('ledger data : ', this.ledgerData)
  }

  checkForDuplicates () {
    this.masterData = this.gs.mergesort(this.masterData)
    // console.log('new master data : ', this.masterData)
    let ledgerKeys = { ...this.masterKeys }
    this.ledgerKeys = Object.values(ledgerKeys)
    // console.log('ledgerKeys : ', this.ledgerKeys)
    this.ledgerKeys.push('ISMSMED')
    this.ledgerKeys.push('ISRCM')
    // this.ledgerKeys.push('TAXSLABID')
    this.ledgerKeys.push('TAXSLAB')
    this.ledgerKeys.push('ITCTYPETEXT')
    // this.ledgerKeys.push('ITCTYPE')
    this.ledgerKeys.push('RCMTYPETEXT')
    // this.ledgerKeys.push('RCMTYPE')
    this.ledgerKeys.push('HSNNO')
    this.ledgerKeys.push('GLIDTEXT')
    this.duplicateTuples = []
    for (let i = 0; i < this.masterData.length - 1; i++) {
      if (this.masterData[i]['NAME'].toLowerCase() === this.masterData[i + 1]['NAME'].toLowerCase()) {
        this.duplicateTuples.push(this.masterData[i])
        this.masterData[i]['DUPLICATE'] = true
      }
    }
    if (this.duplicateTuples.length > 0) {
      this.toastrService.showError('Pleae remove the duplicate items in order to move further', '')
    }
    // console.log('duplicates : ', this.duplicateTuples)
  }

  deleteDuplicates () {
    this.duplicateTuples.forEach(item => {
      for (let i = 0; i < this.masterData.length; i++) {
        if (item['SNO'] === this.masterData[i]['SNO']) {
          this.masterData.splice(i, 1)
        }
      }
    })
    this.duplicateTuples = []
  }

  removeItem (index, item) {
    this.masterData.splice(index,1)
    this.ledgerData.splice(index,1)
    for (let i = 0; i < this.duplicateTuples.length; i++) {
      if (this.duplicateTuples[i]['NAME'].toLowerCase() === item['NAME'].toLowerCase()) {
        this.duplicateTuples.splice(i, 1)
        break
      }
    }
    // console.log('duplicate tuples : ', this.duplicateTuples)
  }

  ngOnDestroy () {
    this.modalOpen.unsubscribe()
  }

  initComp () {
    this.sheetname = []
    this.masterTableArray = []
    this.file = []
    this.masterKeys = []
    this.selectedItems = []
    this.masterData = []
    this.ledgerData = []
    this.ledgerKeys = []
    this.duplicateTuples = []
    this.file = []
    this.values = {}
    this.toShow = {}
    $('.fixTable').tableHeadFixer({
      'thead': false,
      'left': 1
    })
    if (this.modeOfForm === 'new') {
      this.pendingList = false
      this.getPendingList()
    }

    $('.fixTable').tableHeadFixer({
      'thead': false,
      'left': 1
    })
    this.reset()
    this.uploadData('')
  }

  openModal () {
    this.initComp()
    $('#ledger-import-modal').removeClass('fadeOut')
    $('#ledger-import-modal').addClass('fadeInDown')
    $('#ledger-import-modal').modal(UIConstant.MODEL_SHOW)
  }

  closeModal () {
    if ($('#ledger-import-modal').length > 0) {
      $('#ledger-import-modal').modal(UIConstant.MODEL_HIDE)
    }
  }

  reset () {
    if (this.myInputVariable && this.myInputVariable.nativeElement.files.length > 0) {
      // console.log(this.myInputVariable.nativeElement.files)
      this.myInputVariable.nativeElement.value = ''
      // console.log(this.myInputVariable.nativeElement.files)
    }
  }

  private importParams (): ledgerImportExcel {
    let arrToSend = JSON.parse(JSON.stringify(this.masterData))
    arrToSend.forEach((element) => {
      element['ISMSMED'] = 0
      element['ISRCM'] = 0
      element['TAXSLABID'] = 0
      element['ITCTYPE'] = 0
      element['RCMTYPE'] = 0
      element['TAXSLAB'] = ''
      element['ITCTYPETEXT'] = ''
      element['RCMTYPETEXT'] = ''
      element['HSNNO'] = 0
      element['GLID'] = 0
      element['GLIDTEXT'] = ''
    });
    let obj = Object.assign([], arrToSend, this.ledgerData)
    const itemElement = {
      itemObj: {
        ImportLedgers: obj
      }
    }
    console.log('obj: ', JSON.stringify(itemElement.itemObj))
    return itemElement.itemObj
  }

  saveImport (value) {
    this.gs.manipulateResponse(this.ledgerService.postLedgerImport(this.importParams())).subscribe(data => {
      console.log('ledger import : ', data)
      this.toastrService.showSuccess('Success', 'File Saved')
      if (value === 'new') {
        this.ledgerService.onSaveLedgerImport()
        this.ledgerService.closeLedgerImport()
      }
      if (value === 'reset') {
        this.modeOfForm = 'new'
        this.initComp()
      }
    },
    (error) => {
      console.log(error)
      this.toastrService.showError(error, '')
    })
  }

  public uploadData (event: any): void {
    if (event) {
      // console.log('file event : ', event)
      this.sheetname = []
      this.masterTableArray = []
      this.masterData = []
      this.sheetname = []
      this.masterTableArray = []
      this.masterData = []
      this.duplicateTuples = []
      this.selectedItems = []
      this.ledgerData = []
      this.ledgerKeys = []
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
    this.sheetname = []
    this.masterTableArray = []
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
      console.log(this.sheetname);
      if (this.sheetname[0] === 'Ledger') {
        // this.masterTableArray = XLSX.utils.sheet_to_json(worksheet, { defval: '' })
        masterTableArray = XLSX.utils.sheet_to_json(worksheet, { raw: true })
        this.masterTableArray = masterTableArray.splice(0, masterTableArray.length)
        if (this.masterTableArray.length > 0) {
          let keysArr = Object.values(XLSX.utils.sheet_to_json(worksheet, { header: 1 })[0])
          keysArr = this.gs.removeSpecialCharacters(keysArr)
          // console.log('keysArr : ', keysArr)
          const mandatoryKeys = ["SNO", "NAME", "SHORTNAME", "GROUPLEDGER", "GSTTYPE", "ACCOUNTNO", "CREDITLIMIT", "CREDITDAYS", "CONTACTNO", "EMAIL", "PANNO", "GSTNO", "OPENINGBALANCE", "CRDR", "COUNTRY", "STATE", "CITY", "ADDRESS"];
          // const mandatoryKeys = ['SNO','NAME','SHORTNAME','GSTTYPE','ACCOUNTNO','CREDITLIMIT',
          // 'CREDITDAYS','CONTACTNO','EMAIL','PANNO','GSTNO','OPENINGBALANCE','CRDR','COUNTRY',
          // 'STATE','CITY','ADDRESS']
          const resp = this.gs.checkForEqualityInArray(mandatoryKeys, keysArr)
          if (resp !== '') {
            this.toastrService.showErrorLong(resp, '')
            this.reset()
            this.isDataLoading = false
          } else {
            this.masterData = []
            this.masterTableArray.forEach((element, index) => {
              let keysArr = Object.keys(element)
              let newRow = {}
              for (let j = 0; j < keysArr.length; j++) {
                let key = keysArr[j].trim().toUpperCase()
                newRow[key] = ('' + element[keysArr[j]]).trim()
              }
              newRow['SNO'] = index + 1
              newRow['CREDITLIMIT'] = +newRow['CREDITLIMIT']
              newRow['CREDITDAYS'] = +newRow['CREDITDAYS']
              newRow['OPENINGBALANCE'] = +newRow['OPENINGBALANCE']
              newRow = this.gs.removeSpecialCharacters(newRow)
              if (!isNaN(newRow['OPENINGBALANCE']) && newRow['OPENINGBALANCE'] > 0 && !newRow['CRDR']) {
                this.toastrService.showErrorLong('CRDR is required at Sno. ' + newRow['SNO'], '')
                this.modeOfForm = 'reset'
                this.initComp()
                this.isDataLoading = false
              } else if (!newRow['NAME']) {
                this.toastrService.showErrorLong('NAME is Required at Sno. ' + newRow['SNO'], '')
                this.modeOfForm = 'reset'
                this.initComp()
                this.isDataLoading = false
              } else if (newRow['PANNO'] && !this.commonService.panNumberRegxValidation(newRow['PANNO'])) {
                this.toastrService.showErrorLong(newRow['PANNO'], 'PANNO is Incorrect at Sno. ' + newRow['SNO'])
                this.modeOfForm = 'reset'
                this.initComp()
                this.isDataLoading = false
              } else if (newRow['GSTTYPE'] === 'Regular' && !newRow['GSTNO']) {
                this.toastrService.showErrorLong('GSTNO. is Required at Sno. ' + newRow['SNO'], '')
                this.modeOfForm = 'reset'
                this.initComp()
                this.isDataLoading = false
              } 
              // else if (newRow['GSTTYPE'] === 'Regular' && !newRow['STATE']) {
              //   this.toastrService.showErrorLong('STATE is Required at Sno. ' + newRow['SNO'], '')
              //   this.modeOfForm = 'reset'
              //   this.initComp()
              //   this.isDataLoading = false
              // } else if (newRow['GSTTYPE'] === 'Regular' && !newRow['COUNTRY']) {
              //   this.toastrService.showErrorLong('COUNTRY is Required at Sno. ' + newRow['SNO'], '')
              //   this.modeOfForm = 'reset'
              //   this.initComp()
              //   this.isDataLoading = false
              // }
               else {
                let obj = { ...newRow }
                this.masterData.push(obj)
                if (this.masterData.length === this.masterTableArray.length) {
                  this.isDataLoading = false
                  this.masterKeys = Object.keys(_self.masterData[0])
                  this.checkForDuplicates()
                }
              }
            })
          }
        } else {
          this.toastrService.showError('', 'No Data Found')
          this.reset()
          this.isDataLoading = false
        }
      }else{
        this.toastrService.showError('Sheet name different !! It should be Ledger', '');
      }
    }
  }
  yesConfirmationClose() {
    $('#close_confirm6').modal(UIConstant.MODEL_HIDE)
    this.reset()
    this.masterData = []
    this.sheetname = []
    this.masterTableArray = []
    this.file = []
    this.masterKeys = []
    this.pendingList = []
    this.isPending = false
    this.data = {}
    this.values = {}
    this.toShow = {}
    this.file = []
    this.ledgerData = []
    this.ledgerKeys = []
    this.isDataLoading = false
    this.isLoading = false
    this.ledgerService.closeLedgerImport()
  }
  closeConfirmation() {
    $('#close_confirm6').modal(UIConstant.MODEL_SHOW)
  }
  closeImportModal () {
    this.closeConfirmation()
   
  }

  getRcmTypeList () {
    this.gs.manipulateResponse(this.ledgerService.getRcmTypeList()).pipe(
      map(data => {
        if (data && data.length > 0) {
          data.forEach(element => {
            element['Name'] = element['CommonDesc']
          })
          return data
        } else {
          return []
        }
      })
    )
    .subscribe(data => {
      // console.log('rcm : ', data)
      if (data)
        this.ledgerService.returnSelect2List(data, 'rcm')
    },
    (error) => {
      console.log(error)
      this.toastrService.showError(error.message, '')
    })
  }

  getItcTypeList () {
    this.gs.manipulateResponse(this.ledgerService.getItcTypeList()).pipe(
      map(data => {
        if (data && data.length > 0) {
          data.forEach(element => {
            element['Name'] = element['CommonDesc']
          })
          return data
        } else {
          return []
        }
      })
    )
    .subscribe(data => {
      // console.log('itc : ', data)
      this.ledgerService.returnSelect2List(data, 'itc')
    },
    (error) => {
      console.log(error)
      this.toastrService.showError(error.message, '')
    })
  }

  getParentGroupData () {
    this.gs.manipulateResponse(this.commonService.getLedgerGroupParentData('')).pipe(
      map(data => {
        if (data && data.length > 0) {
          data.forEach(element => {
            element['Name'] = element['GlName']
          })
          return data
        } else {
          return []
        }
      })
    )
    .subscribe(data => {
      // console.log('parent : ', data)
      this.ledgerService.returnSelect2List(data, 'parent', true)
    },
    (error) => {
      console.log(error)
      this.toastrService.showError(error.message, '')
    })
  }

  getTaxtDetail () {
    this.gs.manipulateResponse(this._itemmasterServices.getTaxDetail()).pipe(
      map(data => {
        if (data.TaxSlabs && data.TaxSlabs.length > 0) {
          data.TaxSlabs.forEach(element => {
            element['Name'] = element['Slab']
          })
          return data.TaxSlabs
        } else {
          return []
        }
      })
    )
    .subscribe(data => {
      // console.log('tax : ', data)
      if (data)
        this.ledgerService.returnSelect2List(data, 'tax', true)
    },
    (error) => {
      console.log(error)
      this.toastrService.showError(error.message, '')
    })
  }

  getPendingList () {
    let _self = this
    this.gs.manipulateResponse(this.ledgerService.getLedgerImport()).subscribe(
      data => {
        console.log('pending list : ', data)
        if (data && data.length > 0) {
          _self.isPending = true
          _self.generateList(data)
        } else {
          _self.isPending = false
          this.isLoading = false
        }
        $('#ledger-import-modal').removeClass('fadeOut')
        $('#ledger-import-modal').addClass('fadeInDown')
        $('#ledger-import-modal').modal(UIConstant.MODEL_SHOW)
      },
      (error) => {
        this.toastrService.showError(error, '')
        this.isLoading = false
      }
    )
  }

  generateList (list) {
    let _self = this
    this.masterData = []
    let index = 0
    let masterKeys = ['Sno','Name','ShortName','GSTType','AccountNo','CreditLimit','CreditDays','ContactNo','Email',
    'PanNo','GstNo','OpeningBalance','CrDr','Country','State','City','Address']
    this.masterKeys = ['SNO','NAME','SHORTNAME','GSTTYPE','ACCOUNTNO','CREDITLIMIT',
    'CREDITDAYS','CONTACTNO','EMAIL','PANNO','GSTNO','OPENINGBALANCE','CRDR','COUNTRY',
    'STATE','CITY','ADDRESS']
    this.ledgerKeys = [...this.masterKeys]
    this.ledgerKeys.push('ISMSMED')
    this.ledgerKeys.push('ISRCM')
    this.ledgerKeys.push('TAXSLAB')
    this.ledgerKeys.push('ITCTYPETEXT')
    this.ledgerKeys.push('RCMTYPETEXT')
    this.ledgerKeys.push('HSNNO')
    this.ledgerKeys.push('GLIDTEXT')
    list.forEach(element => {
      index += 1
      let newRow = {}
      for (let j = 0; j < masterKeys.length; j++) {
        newRow[masterKeys[j].toUpperCase()] = element[masterKeys[j]]
      }
      newRow['ID'] = element['Id']
      newRow['SNO'] = +index
      newRow['NAME'] = newRow['NAME']
      newRow['SHORTNAME'] = newRow['SHORTNAME']
      newRow['GSTTYPE'] = newRow['GSTTYPE']
      newRow['ACCOUNTNO'] = newRow['ACCOUNTNO']
      newRow['CREDITLIMIT'] = newRow['CREDITLIMIT']
      newRow['CREDITDAYS'] = newRow['CREDITDAYS']
      newRow['CONTACTNO'] = newRow['CONTACTNO']
      newRow['EMAIL'] = newRow['EMAIL']
      newRow['PANNO'] = newRow['PANNO']
      newRow['GSTNO'] = newRow['GSTNO']
      newRow['OPENINGBALANCE'] = newRow['OPENINGBALANCE']
      newRow['CRDR'] = newRow['CRDR']
      newRow['COUNTRY'] = newRow['COUNTRY']
      newRow['STATE'] = newRow['STATE']
      newRow['CITY'] = newRow['CITY']
      newRow['ADDRESS'] = newRow['ADDRESS']
      console.log(newRow)
      _self.masterData.push(newRow)
    })
    this.isLoading = false
  }

  deleteList () {
    let strId = this.generateDeleteList()
    console.log('strId : ', strId)
    this.gs.manipulateResponse(this.ledgerService.deleteList(strId)).subscribe(
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
}