import { Component, OnInit } from '@angular/core'
import { Subscription } from 'rxjs'
import { FormGroup } from '@angular/forms'
import { SaleTravel, AddCust } from '../../model/sales-tracker.model'
import { UIConstant } from '../../shared/constants/ui-constant'
declare const $: any
import { CommonService } from '../../commonServices/commanmaster/common.services'
import { ToastrCustomService } from '../../commonServices/toastr.service'
//balance-sheet-search.component
@Component({
  selector: 'app-balance-sheet-report',
  templateUrl: './balance-sheet-report.component.html',
  styleUrls: ['./balance-sheet-report.component.css']
})
export class BalanceSheetReportComponent implements OnInit {
  DIRECT_SALE_TYPE: any = 'DirectSale'
  saleDirectDetails: any
  totalDiscount: number
  totaltax: number
  totalBillAmount: number
  newDateSub: Subscription
  dateShow : any
  constructor(public _commonService: CommonService, public _toastrCustomService: ToastrCustomService) {
    //  this.getSaleChallanDetail()
    this.newDateSub = this._commonService.getsearchByDateForBalancesheetStatus().subscribe(
      (obj: any) => {
        this.getbalancesheetdata(obj.date)
         this.dateShow = obj.date
      }
    )

  }

  ngOnInit () {
    this._commonService.fixTableHF('cat-table')
   this.getbalancesheetdata(this.dateShow)
  }

  toShowSearch = false

  toggleSearch() {
    this.toShowSearch = !this.toShowSearch
  }
  Attributelabel: any
  ItemDetails: any
  attributePerLableValue: any
  attributevalue: any
  allAttributeData: any
  localArray: any
  labelLength: any
  mainData: any
  AttributeValues: any
  headervalue1 : any
  headervalue2: any
  getbalancesheetdata (date) {
    debugger


    //indirect Expences
this.mainData =[]
    this._commonService.getBalanceSheetList(date).subscribe(data => {
if(data.Code === UIConstant.THOUSAND && data.Data.length  >0 ){
        this.mainData =  data.Data
    

        let getArrayList = data.Data
        let obj = {}
        getArrayList.forEach(element => {
          this.headervalue1 =  this.mainData.filter(
            getvalue => (getvalue.HeadId ===1) &&  (getvalue.LevelNo === 1)
          )
          .map(getvalue => parseFloat(getvalue.Amount))
          .reduce((sum, current) => sum + current, 0)
          this.headervalue2 =  this.mainData.filter(
            getvalue => (getvalue.HeadId ===2) &&  (getvalue.LevelNo === 1)
          )
          .map(getvalue => parseFloat(getvalue.Amount))
          .reduce((sum, current) => sum + current, 0)
    
        });
        console.log(this.headervalue1,this.headervalue2 ,'add')


}
    })

  }
}








