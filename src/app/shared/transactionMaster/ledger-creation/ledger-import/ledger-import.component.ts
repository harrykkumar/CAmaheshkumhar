import { Component, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { GlobalService } from 'src/app/commonServices/global.service';
import * as XLSX from 'xlsx';
import { CommonService } from '../../../../commonServices/commanmaster/common.services';
import { ToastrCustomService } from '../../../../commonServices/toastr.service';
import { UIConstant } from 'src/app/shared/constants/ui-constant';
import { LedgerCreationService } from '../../../../transactionMaster/ledger-creation/ledger-creation.service';
import { Subject } from 'rxjs/internal/Subject';
import { filter } from 'rxjs/internal/operators';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
import { Select2Component } from 'ng2-select2';
import { ledgerImportExcel } from './ledger-import.model';
declare const $: any;
@Component({
  selector: 'ledger-import',
  templateUrl: './ledger-import.component.html'
})
export class LedgerImportComponent {
  OnDestroy$ = new Subject()
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
  parentGroupData: Array<any> = []
  glIdValue: any
  GlId: number
  @ViewChild('groupSelect2') group_select2: Select2Component
  constructor (private commonService: CommonService,
     private gs: GlobalService, private toastrService: ToastrCustomService,
     private ledgerService: LedgerCreationService
     ) {
    this.modalOpen = this.ledgerService.openLedgerImport$.subscribe(
      (status: any) => {
        if (status.open) {
          this.getParentGroupData()
          this.openModal()
        } else {
          this.closeModal()
        }
      }
    )
  }

  getParentGroupData () {
    this.commonService.getLedgerGroupParentData('')
    .pipe(
      filter(data => {
        if (data.Code === UIConstant.THOUSAND) {
          return true
        } else {
          throw new Error(data.Description)
        }
      }),
      catchError(error => {
        return throwError(error)
      }),
      map(data => data.Data),
      map(data => {
        let newData = []
        data.forEach(element => {
          newData.push({
            id: element.Id,
            text: element.GlName
          })
        })
        return newData
      })
    ).subscribe(data => {
      console.log('parent ledgers : ', data)
      this.parentGroupData = data
      this.GlId = +this.parentGroupData[0].id
    })
  }

  ngOnDestroy () {
    this.modalOpen.unsubscribe()
  }

  initComp () {
    this.sheetname = []
    this.masterTableArray = []
    this.file = []
    this.masterKeys = []
    this.masterData = []
    $('.fixTable').tableHeadFixer({
      'thead': false,
      'left': 1
    })
    this.reset()
    this.uploadData('')
  }

  openModal () {
    this.reset()
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
    arrToSend.forEach((element, index) => {
      element['ID'] = 0
      element['SNO'] = index
      element['GlId'] = this.GlId
    });
    const itemElement = {
      itemObj: {
        ImportLedgers: arrToSend
      }
    }
    console.log('obj: ', JSON.stringify(itemElement.itemObj))
    return itemElement.itemObj
  }

  saveImport (value) {
    this.ledgerService.postLedgerImport(this.importParams()).subscribe(data => {
      console.log('ledger import : ', data)
      if (data.Code === UIConstant.THOUSAND) {
        this.toastrService.showSuccess('Success', 'File Saved')
        if (value === 'new') {
          this.ledgerService.onSaveLedgerImport()
          this.ledgerService.closeLedgerImport()
        }
        if (value === 'reset') {
          this.modeOfForm = 'reset'
          this.initComp()
        }
      } else {
        this.toastrService.showError('Oops', data.Message)
      }
    })
  }

  public uploadData (event: any): void {
    if (event) {
      // console.log('file event : ', event)
      this.sheetname = []
      this.masterTableArray = []
      this.masterData = []
      if (event.target && event.target.files.length > 0) {
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
      if (this.sheetname[0] === 'Ledger') {
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
        const mandatoryKeys = ['SNO','NAME','SHORTNAME','GSTTYPE','ACCOUNTNO','CREDITLIMIT',
        'CREDITDAYS','CONTACTNO','EMAIL','PANNO','GSTNO','OPENINGBALANCE','CRDR','COUNTRY',
        'STATE','CITY','ADDRESS']
        if (mandatoryKeys.length === keysArr.length) {
          if (this.gs.checkForEqualityInArray(mandatoryKeys, keysArr) !== '') {
            this.toastrService.showError(this.gs.checkForEqualityInArray(mandatoryKeys, keysArr), 'Missing Field')
            this.reset()
          } else {
            this.masterData = []
            this.masterKeys = ['SNO','NAME','SHORTNAME','GSTTYPE','ACCOUNTNO','CREDITLIMIT',
            'CREDITDAYS','CONTACTNO','EMAIL','PANNO','GSTNO','OPENINGBALANCE','CRDR','COUNTRY',
            'STATE','CITY','ADDRESS']
            this.masterTableArray.forEach((element, index) => {
              let toAdd = true
              let keysArr = Object.keys(element)
              let newRow = {}
              for (let j = 0; j < keysArr.length; j++) {
                let key = keysArr[j].trim().toUpperCase()
                newRow[key] = this.gs.removeSpecialCharacter('' + element[keysArr[j]])
              }
              // console.log('row : ', newRow)
              newRow['SNO'] = index + 1
              newRow['CREDITLIMIT'] = +newRow['CREDITLIMIT']
              newRow['CREDITDAYS'] = +newRow['CREDITDAYS']
              newRow['OPENINGBALANCE'] = +newRow['OPENINGBALANCE']
              newRow = this.gs.removeSpecialCharacters(newRow)
              // if (isNaN(newRow['CREDITLIMIT'])) {
              //   this.toastrService.showErrorLong('CREDITLIMIT is Required at Sno. ' + newRow['SNO'], '')
              //   this.reset()
              //   toAdd = false
              // }
              // if (isNaN(newRow['CREDITDAYS'])) {
              //   this.toastrService.showErrorLong('CREDITDAYS is Required at Sno. ' + newRow['SNO'], '')
              //   this.reset()
              //   toAdd = false
              // }
              if (!isNaN(newRow['OPENINGBALANCE']) && newRow['OPENINGBALANCE'] > 0) {
                if (!newRow['CRDR']) {
                  this.toastrService.showErrorLong('CRDR is reqquired at Sno. ' + newRow['SNO'], '')
                  this.reset()
                  toAdd = false
                }
              }
              if (!newRow['NAME']) {
                this.toastrService.showErrorLong('NAME is Required at Sno. ' + newRow['SNO'], '')
                this.reset()
                toAdd = false
              }
              // if (!newRow['SHORTNAME']) {
              //   this.toastrService.showErrorLong('SHORTNAME is Required at Sno. ' + newRow['SNO'], '')
              //   this.reset()
              //   toAdd = false
              // }
              if (newRow['GSTTYPE'] === 'Regular') {
                if (!newRow['GSTNO']) {
                  this.toastrService.showErrorLong('NAME is Required at Sno. ' + newRow['SNO'], '')
                  this.reset()
                  toAdd = false
                }
                if (!newRow['STATE']) {
                  this.toastrService.showErrorLong('STATE is Required at Sno. ' + newRow['SNO'], '')
                  this.reset()
                  toAdd = false
                }
                if (!newRow['COUNTRY']) {
                  this.toastrService.showErrorLong('COUNTRY is Required at Sno. ' + newRow['SNO'], '')
                  this.reset()
                  toAdd = false
                }
              }
              if (newRow['PANNO']) {
                if (!this.commonService.panNumberRegxValidation(newRow['PANNO'])) {
                  this.toastrService.showErrorLong(newRow['PANNO'], 'PANNO is Incorrect at Sno. ' + newRow['SNO'])
                  this.reset()
                  toAdd = false
                }
              }
              // if (!newRow['CRDR']) {
              //   this.toastrService.showErrorLong('CRDR is reqquired at Sno. ' + newRow['SNO'], '')
              //   this.reset()
              //   toAdd = false
              // }
              if (toAdd) {
                let obj = { ...newRow }
                console.log('obj : ', obj);
                this.masterData.push(obj)
              }
            })
            // this.masterKeys = Object.keys(_self.masterData[0])
            console.log('masterdata: ', JSON.stringify(_self.masterData))
          }
        } else {
          this.toastrService.showError('', 'Some fields are missing')
          this.reset()
        }
      } else {
        this.toastrService.showError('', 'No Data Found')
        this.reset()
      }
    }
  }

  closeImportModal () {
    this.reset()
    this.masterData = []
    this.sheetname = []
    this.masterTableArray = []
    this.file = []
    this.masterKeys = []
    this.ledgerService.closeLedgerImport()
  }
}