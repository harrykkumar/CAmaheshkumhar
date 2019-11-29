import { Component, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core'
import { ImportExportSale } from '../../../../model/sales-tracker.model'
import { UIConstant } from '../../../../shared/constants/ui-constant'
import { Subscription } from 'rxjs'
import * as XLSX from 'ts-xlsx'
import { ToastrCustomService } from '../../../../commonServices/toastr.service'
import * as _ from 'lodash'
import { GlobalService } from '../../../../commonServices/global.service'
import { ExcelService } from 'src/app/commonServices/excel.service'
import { Settings } from '../../../../shared/constants/settings.constant'
import { SetUpIds } from '../../../../shared/constants/setupIds.constant'
import { SaleTravelServices } from '../../sale-travel.services'
import { CommonService } from 'src/app/commonServices/commanmaster/common.services'
declare var $: any
@Component({
  selector: 'app-sales-import',
  templateUrl: './sales-import.component.html',
  styleUrls: ['./sales-import.component.css']
})
export class SalesImportComponent implements OnInit, OnDestroy {
  sheetname: any = []
  masterTableDivShow: boolean
  taxMastertableDiv: boolean
  masterData: any
  subcribe: any
  array: any
  modalOpen: Subscription
  masterTableArray: any[]
  file: any
  insideArray: any
  arrayBuffer: any

  @ViewChild('myInput')
  myInputVariable: ElementRef
  clientDateFormat: string = ''
  // tslint:disable-next-line:variable-name
  first_sheet_name: any
  constructor (private _saleTravelServices: SaleTravelServices,
     private gs: GlobalService,
      private toastrService: ToastrCustomService,
      private commonService: CommonService,
      private settings: Settings) {
    this.clientDateFormat = this.settings.dateFormat
    // console.log('client date format : ', this.clientDateFormat)
    if (this.clientDateFormat === '') {
      this.commonService.getSettingById(SetUpIds.dateFormat).subscribe(
        (data) => {
          if (data.Code === UIConstant.THOUSAND && data.Data.SetupDynamicValues) {
            this.clientDateFormat = data.Data.SetupDynamicValues.Val
            this.settings.dateFormat = this.clientDateFormat
          }
        }
      )
    }
    this.modalOpen = this.commonService.getImportStatus().subscribe(
      (status: any) => {
        if (status.open) {
          this.openPoup()
        } else {
          this.closeModal()
        }
      }
    )
  }
  ngOnInit () {
    this.insideArray = []
    this.sheetname = []
    this.masterTableArray = []
    this.array = []
  }

  ngOnDestroy () {
    this.modalOpen.unsubscribe()
  }
  openPoup () {
    this.file = []
    this.reset()
    this.uploadData('')
    $('#saleTravale').modal(UIConstant.MODEL_SHOW)
  }

  closeModal () {
    if ($('#saleTravale').length > 0) {
      this.reset()
      $('#saleTravale').modal(UIConstant.MODEL_HIDE)
    }
  }

  reset () {
    this.file = []
    this.masterKeys = []
    this.masterTableDivShow = false
    if (this.myInputVariable && this.myInputVariable.nativeElement.files.length > 0) {
      console.log(this.myInputVariable.nativeElement.files)
      this.myInputVariable.nativeElement.value = ''
      console.log(this.myInputVariable.nativeElement.files)
    }
  }

  saveSaleTravel (value) {
    if (this.masterData.length > 0) {
      this.gs.manipulateResponse(this._saleTravelServices.importExportSale(this.saleTravelParmas())).subscribe(data => {
        console.log('sales import : ', data)
        this.commonService.newSaleAdded()
        this.toastrService.showSuccess('Success', 'File Saved')
        this.commonService.closeImport()
        if (value === 'save') {
          this.commonService.closeImport()
        }
        if (value === 'save1') {
          this.reset()
        }
      },
      (error) => {
        this.toastrService.showErrorLong(error, '')
      })
    }
  }

  createTax () {
    const mandatoryKeys = ['SNO', 'DATE', 'RETURNDATE', 'DATEOFTRAVEL', 'CURRENCY',
    'BOOKINGNO', 'SUPPLIER', 'AIRLINETICKETCODE',
    'TICKETNO', 'CLIENTNAME', 'ROUTING',
    'FARE', 'REISSUECHARGES', 'REFUNDPANELTY',
    'MISCELLANEOUSE', 'LANGITAX', 'FORMOFPAYMENT',
    'DISCOUNT', 'DISCOUNTTYPE', 'DISCOUNTAMOUNT',
    'SVCFEE', 'COMMISSION', 'COMMISSIONTYPE', 'COMMISSIONAMOUNT',
    'COMMISSIONAUTHORIZER', 'REMARK']
    let taxArrKeys = []
    this.masterKeys.forEach(key => {
      if (mandatoryKeys.indexOf(key) === -1) {
        taxArrKeys.push(key)
      }
    });
    let index = this.masterData.length - 1
    this.masterTableArray.forEach(element => {
      for (let i = 0; i <= taxArrKeys.length - 1; i++) {
        this.masterData[index][taxArrKeys[i]] = element[taxArrKeys[i]]
      }
      let taxRowIndex = 0
      taxArrKeys.forEach(tax => {
        taxRowIndex += taxRowIndex
        let taxRow = {
          'SNO': taxRowIndex,
          'TAXRATENAME': tax,
          'TAXRATE': element[tax].toFixed(4),
          'TAXTYPE': 1,
          'TAXAMOUNT': element[tax].toFixed(4),
          'ROWID': element['SNO']
        }
        this.array.push(taxRow)
      })
    });
    console.log('tax data: ', this.array)
  }

  private saleTravelParmas (): ImportExportSale {
    this.createTax()
    const salesElement = {
      saleObj: {
        Id: 0,
        travelImports: this.masterData,
        travelImportTaxes: this.array
      }
    }
    console.log('post: ', JSON.stringify(salesElement.saleObj))
    return salesElement.saleObj
  }

  public uploadData (event: any): void {
    if (event) {
      console.log('file event : ', event)
      this.sheetname = []
      this.masterTableArray = []
      this.masterData = []
      if (event.target && event.target.files.length > 0) {
        this.file = event.target.files[0]
        this.readingData()
      } else {
        this.masterTableDivShow = false
        this.taxMastertableDiv = false
      }
    }
  }
  mandatoryKeys: any[]
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
      this.first_sheet_name = workbook.SheetNames[0]
      let worksheet = workbook.Sheets[this.first_sheet_name]
      let masterTableArray = []
      if (this.sheetname[0] === 'data') {
        // this.masterTableArray = XLSX.utils.sheet_to_json(worksheet, { defval: '' })
        masterTableArray = XLSX.utils.sheet_to_json(worksheet, { raw: true })
        this.masterTableDivShow = true
      }
      this.masterTableArray = masterTableArray.splice(0, masterTableArray.length)
      console.log('masterTableArray : ', this.masterTableArray)
      // check validation
      if (this.masterTableArray.length > 0) {
        let keysArr = Object.values(XLSX.utils.sheet_to_json(worksheet, { header: 1 })[0])
        keysArr = this.gs.removeSpecialCharacters(keysArr)
        const indexOfRemark = keysArr.indexOf('REMARK')
        if (indexOfRemark > -1) {
          const beforeArr = keysArr.slice(0, indexOfRemark + 1)
          console.log('keysArr : ', keysArr)
          const mandatoryKeys = ['SNO', 'DATE', 'RETURNDATE', 'DATEOFTRAVEL', 'CURRENCY',
            'BOOKINGNO', 'SUPPLIER', 'AIRLINETICKETCODE',
            'TICKETNO', 'CLIENTNAME', 'ROUTING',
            'FARE', 'REISSUECHARGES', 'REFUNDPANELTY',
            'MISCELLANEOUSE', 'LANGITAX', 'FORMOFPAYMENT',
            'DISCOUNT', 'DISCOUNTTYPE', 'DISCOUNTAMOUNT',
            'SVCFEE', 'COMMISSION', 'COMMISSIONTYPE', 'COMMISSIONAMOUNT',
            'COMMISSIONAUTHORIZER', 'REMARK']
          
          _self.mandatoryKeys = [...mandatoryKeys]
          const resp = this.gs.checkForEqualityInArray(_self.mandatoryKeys, beforeArr)
          if (resp !== '') {
            this.toastrService.showErrorLong(resp, '')
            this.reset()
          } else {
            this.masterTableArray.forEach((element, index) => {
              console.log(element)
              let keysArr = Object.keys(element)
              let newRow = {}
              for (let j = 0; j < keysArr.length; j++) {
                let key = keysArr[j].trim().toUpperCase()
                newRow[key] = ('' + element[keysArr[j]]).trim()
              }
              // console.log('row : ', newRow)
              newRow = this.gs.removeSpecialCharacters(newRow)
              console.log('row : ', newRow)
              newRow = this.gs.removeSpecialCharacters(newRow)
              newRow['SNO'] = index + 1
              newRow['DISCOUNT'] = +newRow['DISCOUNT']
              newRow['REISSUECHARGES'] = +newRow['REISSUECHARGES']
              newRow['REFUNDPANELTY'] = +newRow['REFUNDPANELTY']
              newRow['MISCELLANEOUSE'] = +newRow['MISCELLANEOUSE']
              newRow['LANGITAX'] = +newRow['LANGITAX']
              newRow['DISCOUNTTYPE'] = +newRow['DISCOUNTTYPE']
              newRow['DISCOUNTAMOUNT'] = +newRow['DISCOUNTAMOUNT']
              newRow['SVCFEE'] = +newRow['SVCFEE']
              newRow['COMMISSION'] = +newRow['COMMISSION']
              newRow['COMMISSIONAMOUNT'] = +newRow['COMMISSIONAMOUNT']
              newRow['COMMISSIONAUTHORIZER'] = +newRow['COMMISSIONAUTHORIZER']
              newRow['COMMISSIONTYPE'] = +newRow['COMMISSIONTYPE']
              newRow['FARE'] = +newRow['FARE']
              newRow['DATE'] = this.gs.checkForValidDayAndMonthForImport(newRow['DATE'])
              newRow['DATEOFTRAVEL'] = this.gs.checkForValidDayAndMonthForImport(newRow['DATEOFTRAVEL'])
              newRow['RETURNDATE'] = (newRow['RETURNDATE']) ? this.gs.checkForValidDayAndMonthForImport(newRow['RETURNDATE']) : ''
              this.masterKeys = Object.keys(newRow)
              console.log(newRow)
              if (!newRow['CLIENTNAME']) {
                this.toastrService.showErrorLong('Client Name is Required at SNO. ' + newRow['SNO'], newRow['CLIENTNAME'])
                this.reset()
              } else if (!newRow['SUPPLIER']) {
                this.toastrService.showErrorLong('Supplier is Required at SNO. ' + newRow['SNO'], newRow['SUPPLIER'])
                this.reset()
              }
              if (!this.gs.isValidDate(newRow['DATE'])) {
                this.toastrService.showErrorLong('Invalid DATE Format' + newRow['DATE'] + 'at SNO. ' + newRow['SNO'], 'Expected mm/dd/yyyy')
                this.reset()
              } else if (!this.gs.checkForValidNumbers(+newRow['DISCOUNT'])) {
                this.toastrService.showErrorLong('Invalid Discount Value ' + 'at SNO. ' + newRow['SNO'], newRow['DISCOUNT'])
                this.reset()
              } else if (!this.gs.checkForValidNumbers(newRow['AIRLINETICKETCODE'])) {
                this.toastrService.showErrorLong('Invalid Airline Sticker Code Value ' + 'at SNO. ' + newRow['SNO'], newRow['AIRLINETICKETCODE'])
                this.reset()
              } else if (!this.gs.checkForValidNumbers(+newRow['CURRENCY']) && !(+newRow['CURRENCY'])) {
                this.toastrService.showErrorLong('Invalid Currency Value ' + 'at SNO. ' + newRow['SNO'], newRow['CURRENCY'])
                this.reset()
              } else if (!this.gs.checkForValidNumbers(+newRow['FARE']) && !(+newRow['FARE'])) {
                this.toastrService.showErrorLong('Invalid Fare Value ' + 'at SNO. ' + newRow['SNO'], +newRow['FARE'])
                this.reset()
              } else if (!this.gs.checkForValidNumbers(+newRow['REISSUECHARGES'])) {
                this.toastrService.showErrorLong('Invalid Reissue Charges Value ' + 'at SNO. ' + newRow['SNO'], newRow['REISSUECHARGES'])
                this.reset()
              } else if (!this.gs.checkForValidNumbers(+newRow['REFUNDPANELTY'])) {
                this.toastrService.showErrorLong('Invalid Refund Panelty Value ' + 'at SNO. ' + newRow['SNO'], newRow['REFUNDPANELTY'])
                this.reset()
              } else if (!this.gs.checkForValidNumbers(+newRow['MISCELLANEOUSE'])) {
                this.toastrService.showErrorLong('Invalid Miscellaneouse Value ' + 'at SNO. ' + newRow['SNO'], newRow['MISCELLANEOUSE'])
                this.reset()
              } else if (!this.gs.checkForValidNumbers(+newRow['LANGITAX'])) {
                this.toastrService.showErrorLong('Invalid Langi Tax Value ' + 'at SNO. ' + newRow['SNO'], newRow['LANGITAX'])
                this.reset()
              } else if (!(+newRow['DISCOUNTTYPE'] === 0 || +newRow['DISCOUNTTYPE'] === 1)) {
                this.toastrService.showErrorLong('Invalid Discount Type Value ' + 'at SNO. ' + 
                newRow['SNO'], newRow['DISCOUNTTYPE'])
                this.reset()
              } else if (!this.gs.checkForValidNumbers(+newRow['DISCOUNTAMOUNT'])) {
                this.toastrService.showErrorLong('Invalid Discount Amount Value ' + 'at SNO. ' + newRow['SNO'], newRow['DISCOUNTAMOUNT'])
                this.reset()
              } else if (!this.gs.checkForValidNumbers(+newRow['SVCFEE'])) {
                this.toastrService.showErrorLong('Invalid SVC FEE Value ' + 'at SNO. ' + newRow['SNO'], newRow['SVCFEE'])
                this.reset()
              } else if (!this.gs.checkForValidNumbers(+newRow['COMMISSION'])) {
                this.toastrService.showErrorLong('Invalid Commission Value ' + 'at SNO. ' + newRow['SNO'], newRow['COMMISSION'])
                this.reset()
              } else if (!this.gs.checkForValidNumbers(+newRow['COMMISSIONAMOUNT'])) {
                this.toastrService.showErrorLong('Invalid Commission Amount Value ' + 'at SNO. ' + newRow['SNO'], newRow['COMMISSIONAMOUNT'])
                this.reset()
              } else if (!this.gs.checkForValidNumbers(+newRow['COMMISSIONAUTHORIZER'])) {
                this.toastrService.showErrorLong('Invalid Commission Authorizer Value ' + 'at SNO. ' + newRow['SNO'], newRow['COMMISSIONAUTHORIZER'])
                this.reset()
              } else if (!this.gs.checkForValidNumbers(+newRow['COMMISSIONTYPE'])) {
                this.toastrService.showErrorLong('Invalid Commssion Type Value ' + 'at SNO. ' + newRow['SNO'], newRow['COMMISSIONTYPE'])
                this.reset()
              } else if (!this.gs.validReturnDateForImport(newRow['DATEOFTRAVEL'], newRow['RETURNDATE'])) {
                this.toastrService.showErrorLong('Invalid Return Date ' + 'at SNO. ' + newRow['SNO'], newRow['RETURNDATE'])
                this.reset()
              } else {
                this.masterData.push(newRow)
                // console.log(this.masterTableArray)
              }
            })
            // this.masterKeys = Object.keys(_self.masterData[0])
            // console.log('masterdata: ', _self.masterData)
          }
        } else {
          this.toastrService.showErrorLong('Oops', 'Remark is not found')
          this.reset()
        }
      } else {
        this.toastrService.showErrorLong('Oops', 'No Data Found')
        this.reset()
      }
      // check validation
    }
      // return this.array
  }
}
