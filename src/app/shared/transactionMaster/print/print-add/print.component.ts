import { Component, Output, EventEmitter, ViewChild } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Subscription } from 'rxjs'
import { Select2OptionData, Select2Component } from 'ng2-select2'
import { UIConstant } from '../../../constants/ui-constant'
import { Addresses ,SaleTravel} from '../../../../model/sales-tracker.model'
import { VendorServices } from '../../../../commonServices/TransactionMaster/vendoer-master.services'
import { CommonService } from '../../../../commonServices/commanmaster/common.services'
import { ToastrCustomService } from '../../../../commonServices/toastr.service'
declare const $: any

@Component({
  selector: 'app-print',
  templateUrl: './print.component.html',
  styleUrls: ['./print.component.css']
})
export class PrintComponent {
  subscribe: Subscription
  modalSub: Subscription
  arrayBuffer: any
  file: any
  saleDirectDetails:any
  sheetname: any
  masterData: any
  subcribe: Subscription
  saleTravelDetails: SaleTravel[]
  saletravelForm: FormGroup
  bankForm: FormGroup
  newBillSub: Subscription
  printOpenData:Subscription
  transactions: any = []
  printData: any
  salesData: any
  ItemTransactionactions: any
  netAmount: number
  salesItemDatails: any = []
  salesSummuryItemDatails: any
  totalRefundPanelty: any
  totalReIssueCharge: any
  totalmiscellanouseChange: any
  customerAddress: any[]
  orgAddress: any[]
  customerMobileData: any[]
  customerEmailData: any[]
  orgMobileData: any[]
  orgEmailData: any[]
  orgImageData: any[]
  orgWebData: any[]
  orgImage: string

  totalTaxAmount: any
   // bar code variable
  elementType = 'svg'
  value = '0123456789012'
  format = 'CODE128'
  lineColor = '#000000'
  width = 2
  height = 100
  displayValue = true
  fontOptions = ''
  font = 'monospace'
  textAlign = 'center'
  textPosition = 'bottom'
  textMargin = 2
  fontSize = 20
  background = '#ffffff'
  margin = 10
  marginTop = 10
  marginBottom = 10
  marginLeft = 10
  marginRight = 10

  codeList: string[] = [
    '', 'CODE128',
    'CODE128A', 'CODE128B', 'CODE128C',
    'UPC', 'EAN8', 'EAN5', 'EAN2',
    'CODE39',
    'ITF14',
    'MSI', 'MSI10', 'MSI11', 'MSI1010', 'MSI1110',
    'pharmacode',
    'codabar'
  ]



  printId: any
  type:any
  constructor (private _formBuilder: FormBuilder,
    private _coustomerServices: VendorServices,
    private _CommonService: CommonService,
    private toastrService: ToastrCustomService) {

    this.modalSub = this._CommonService.getprintStatus().subscribe(
      (status: any) => {
        if (status.open) {
          this.printId = status.id
          this.type = status.type
          this.openModal(this.type)
        } else {
          this.closeModal()
        }
      }
    )
  }

  ngOnDestroy () {
    this.modalSub.unsubscribe()
  }

  openModal (type) {
    if(type ==='DirectSale')
    this.onPrintForDirectSale(this.printId,'sale_Direct_print_id')
  }

  closeModal () {
    $('#sale_Direct_print_id').modal(UIConstant.MODEL_HIDE)
  }

// generate bar code
  InventoryTransactionSales: any
  barcode: any
  ItemAttributesTransactions:any
  reciverContData: any
  reciverAddress: any
  itemAttributeDatails: any
  itemAttbute:any
  website:any
  ContactCustInfo:any
  ContactOrgInfo:any

  onPrintForDirectSale (id ,htmlId) {
    this.orgImage = 'http://app.saniiro.com/uploads/2/2/2/Images/Organization/ologorg.png'
    let _self = this
    _self._CommonService.printDirectSale(id).subscribe(data => {
      console.log(JSON.stringify(data)  , 'salechallan')
      if (data.Code === UIConstant.THOUSAND) {

        if (data.Data && data.Data.SaleTransactionses.length > 0) {
          _self.InventoryTransactionSales = []

          _self.InventoryTransactionSales = data.Data.SaleTransactionses
          _self.barcode = data.Data.SaleTransactionses[0].BarcodeBill

        //  console.log(_self.InventoryTransactionSales ,'fffffffffffffff')
        } else {
          _self.InventoryTransactionSales = []
        }

        _self.ItemTransactionactions = []
        if (data.Data && data.Data.ItemTransactions.length > 0) {
          _self.ItemTransactionactions = []
          _self.ItemTransactionactions = data.Data.ItemTransactions
        } else {
          _self.ItemTransactionactions = []
        }
        if (data.Data.AttributeValues.length > 0) {
          _self.itemAttributeDatails = []

          _self.itemAttributeDatails = data.Data.AttributeValues
        } else {
          _self.itemAttributeDatails = []

        }
           if (data.Data.ItemTransactions.length > 0) {
          _self.ItemTransactionactions = []
          _self.itemAttbute=[]
          _self.ItemTransactionactions = data.Data.ItemTransactions
          for(let i=0; i < data.Data.ItemTransactions.length; i++){
             for(let j=0; j < data.Data.ItemAttributesTrans.length; j++)
            if(data.Data.ItemTransactions[i].Id === data.Data.ItemAttributesTrans[j].ItemTransId){
               this.itemAttbute.push({
                 attr:data.Data.ItemAttributesTrans[j].AttributeName,
                 ItemId:data.Data.ItemAttributesTrans[j].ItemId,
                 rowId :data.Data.ItemAttributesTrans[j].ItemTransId,
                 Id:data.Data.ItemAttributesTrans[j].Id
               })
              // console.log(this.itemAttbute ,"colorr")
            }

          }
        } else {
          _self.ItemTransactionactions = []

        }

        if (data.Data.AddressDetails.length > 0) {
          _self.customerAddress = []
           _self.customerAddress =data.Data.AddressDetails
         
        } else {
          _self.customerAddress = []
          
        }

        if (data.Data.AddressDetailsOrg.length > 0) {
          _self.orgAddress = [] 
           _self.orgAddress =data.Data.AddressDetailsOrg
         
        } else {
          _self.orgAddress = []
          
        }
        if(data.Data.Websites.length > 0){
           this.website =[]
           this.website = data.Data.Websites
        }
        else{
           this.website =[]
        }
          if(data.Data.ContactInfos.length > 0){
           this.ContactCustInfo =[]
           this.ContactCustInfo = data.Data.ContactInfos
        }
        else{
           this.ContactCustInfo =[]
        }
              if(data.Data.ContactInfosOrg.length > 0){
           this.ContactOrgInfo =[]
           this.ContactOrgInfo = data.Data.ContactInfosOrg
        }
        else{
           this.ContactOrgInfo =[]
        }
        setTimeout(function () {
          _self.InitializedPrintForDirectSale(htmlId)
        },0)
        $('#'+htmlId).modal(UIConstant.MODEL_SHOW)
      }
    }
       )

  }

  
  get values (): string[] {
    if (this.barcode) {
      return this.barcode.split('\n')
    }
  }
  InitializedPrintForDirectSale (cmpName) {
    let title = document.title
    let divElements = document.getElementById(cmpName).innerHTML
    let printWindow = window.open('', '_blank', '')
    printWindow.document.open()
    printWindow.document.write('<html><head><title>' + title + '</title><style>body{font-family:calibri;font-size:12px}#page-wrap{width:900px;margin:0 auto;background:#fff}#header{width:100%;text-align:center;color:#000;text-decoration:uppercase;letter-spacing:10px;padding:2px 0;font-size:16px;font-weight:600;border-bottom:1px solid #000}#header12{width:100%;text-align:center;color:#000;padding:2px 0;font-size:16px;font-weight:600;border-top:1px solid #000;border-bottom:1px solid #000}.invoice{border-bottom:1px solid #000;border-left:1px solid #000;border-right:1px solid #000;margin-top:10px;width:100%}.invoiveN{width:60%;float:left}.invoiveN span{padding:5px}.logo{width:40%;float:right}.invoice_table tr td{border:medium none}.invoice_table tr td{border:medium none}.state td{border:1px solid #000;padding:1px 10px}.billT th{border-top:1px solid #000;border-bottom:1px solid #000}.payment th{border:1px solid #000}.payment td{border:1px solid #000}.payment{font-family:calibri;text-align:right}.record th{border-right:1px solid #000;background:#e9e9ea;text-align:left;border-bottom:1px solid #000}.record td{border-right:1px solid #000}.bank{border:1px solid #000}tfoot td{border-top:1px solid #000!important;border-right:1px solid #000!important}table.record{font-size:14px}</style></head><body>')
    printWindow.document.write(divElements)
    printWindow.document.write('</body></html>')
    printWindow.document.close()
    printWindow.focus()
    $('#'+cmpName).modal(UIConstant.MODEL_HIDE)
    setTimeout(function () {
      printWindow.print()
      printWindow.close()
    }, 10)

  }


importExcelFile(data) {
  
 //this._saleTravelServices.exportAsExcelFile(this.saleTravelDetails, 'sample');
}




}
