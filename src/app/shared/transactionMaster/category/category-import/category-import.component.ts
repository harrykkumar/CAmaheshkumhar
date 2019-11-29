import { Component, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { CommonService } from '../../../../commonServices/commanmaster/common.services';
import { GlobalService } from 'src/app/commonServices/global.service';
import { ToastrCustomService } from '../../../../commonServices/toastr.service';
import { UIConstant } from '../../../constants/ui-constant';
import * as XLSX from 'xlsx';
import { CategoryServices } from 'src/app/commonServices/TransactionMaster/category.services';
import { CategoryImportExcel } from './category-import.model';
declare const $: any;
@Component({
  selector: 'category-import',
  templateUrl: './category-import.component.html'
})
export class CategoryImportComponent {
  arrayBuffer: any
  sheetname: any = []
  masterData: any
  modalOpen: Subscription
  masterTableArray: any[]
  file: any
  loading: boolean = true
  @ViewChild('myInput')
  myInputVariable: ElementRef
  firstSheetName: any
  modeOfForm: string = 'new'
  constructor(private commonService: CommonService,
    private gs: GlobalService, private toastrService: ToastrCustomService,
    private catService: CategoryServices
  ) {
    this.modalOpen = this.commonService.getCatImportStatus().subscribe(
      (status: any) => {
        if (status.open) {
          this.openModal()
        } else {
          this.closeModal()
        }
      }
    )
  }

  ngOnDestroy() {
    this.modalOpen.unsubscribe()
  }

  initComp() {
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

  openModal() {
    this.reset()
    this.initComp()
    $('#category-import-modal').removeClass('fadeOut')
    $('#category-import-modal').addClass('fadeInDown')
    $('#category-import-modal').modal(UIConstant.MODEL_SHOW)
  }

  closeModal() {
    if ($('#category-import-modal').length > 0) {
      $('#category-import-modal').modal(UIConstant.MODEL_HIDE)
    }
  }

  reset() {
    if (this.myInputVariable && this.myInputVariable.nativeElement.files.length > 0) {
      this.myInputVariable.nativeElement.value = ''
    }
  }

  private importParams(): CategoryImportExcel {
    let arrToSend = JSON.parse(JSON.stringify(this.masterData))
    arrToSend.forEach((element, index) => {
      element['ID'] = index
      element['SNO'] = 0
      element['PARENTNAME'] = element['PARENTNAME'] ? element['PARENTNAME'] : element['NAME']
    });
    const itemElement = {
      itemObj: {
        Importcategories: arrToSend
      }
    }
    console.log('obj: ', JSON.stringify(itemElement.itemObj))
    return itemElement.itemObj
  }

  saveImport(value) {
    this.catService.postCatImport(this.importParams()).subscribe(data => {
      console.log('cat import : ', data)
      if (data.Code === UIConstant.THOUSAND) {
        this.toastrService.showSuccess('Success', 'File Saved')
        if (value === 'new') {
          this.commonService.onAddCatImport()
          this.commonService.closeCatImport()
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

  public uploadData(event: any): void {
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
  readingData() {
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
      if (this.sheetname[0] === 'Category') {
        masterTableArray = XLSX.utils.sheet_to_json(worksheet, { raw: true })
      }
      this.masterTableArray = masterTableArray.splice(0, masterTableArray.length)
      // console.log('masterTableArray : ', this.masterTableArray)
      // check validation
      if (this.masterTableArray.length > 0) {
        let keysArr = Object.values(XLSX.utils.sheet_to_json(worksheet, { header: 1 })[0])
        keysArr = this.gs.removeSpecialCharacters(keysArr)
        // console.log('keysArr : ', keysArr)
        const mandatoryKeys = ['SNO', 'NAME', 'PARENTNAME']
        if (mandatoryKeys.length === keysArr.length) {
          if (this.gs.checkForEqualityInArray(mandatoryKeys, keysArr) !== '') {
            this.toastrService.showError(this.gs.checkForEqualityInArray(mandatoryKeys, keysArr), 'Missing Field')
            this.reset()
          } else {
            this.masterData = []
            this.masterTableArray.forEach((element) => {
              let keysArr = Object.keys(element)
              let newRow = {}
              for (let j = 0; j < keysArr.length; j++) {
                let key = keysArr[j].trim().toUpperCase()
                newRow[key] = this.gs.removeSpecialCharacter('' + element[keysArr[j]])
              }
              newRow = this.gs.removeSpecialCharacters(newRow)
              newRow['NAME'] = newRow['NAME'] ? newRow['NAME'] : ''
              newRow['PARENTNAME'] = newRow['PARENTNAME'] ? newRow['PARENTNAME'] : newRow['NAME']
              this.masterKeys = ['SNO', 'NAME', 'PARENTNAME']
              if (newRow['NAME'].length < 2 || newRow['PARENTNAME'].length < 2) {
                if (newRow['NAME'].length < 2) {
                  this.toastrService.showErrorLong('NAME is less than 2 characters at Sno. ' + newRow['ID'],
                  newRow['NAME'])
                }
                if (newRow['PARENTNAME'].length < 2) {
                  this.toastrService.showErrorLong('PARENTNAME is less than 2 characters at Sno. ' + newRow['ID'],
                  newRow['PARENTNAME'])
                }
                this.reset()
                this.masterData = []
              } else {
                let obj = { ...newRow }
                this.masterData.push(obj)
              }
            })
            console.log('masterdata: ', JSON.stringify(_self.masterData))
          }
        } else {
          this.toastrService.showError('', '')
        }
      } else {
        this.toastrService.showError('Oops', 'No Data Found')
        this.reset()
      }
    }
  }
  yesConfirmationClose() {
    $('#close_confirmCate').modal(UIConstant.MODEL_HIDE)
    this.reset()
    this.masterData = []
    this.sheetname = []
    this.masterTableArray = []
    this.file = []
    this.masterKeys = []
    this.commonService.closeCatImport()
  }
  closeConfirmation() {
    $('#close_confirmCate').modal(UIConstant.MODEL_SHOW)
  }
  closeImportModal() {
    this.closeConfirmation()
   
  }
}