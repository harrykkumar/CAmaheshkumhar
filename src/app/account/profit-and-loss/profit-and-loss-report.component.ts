import { Component, OnInit } from '@angular/core'
import { Subscription } from 'rxjs'
import { FormGroup } from '@angular/forms'
import { SaleTravel, AddCust } from '../../model/sales-tracker.model'
import { UIConstant } from '../../shared/constants/ui-constant'
declare const $: any
import { CommonService } from '../../commonServices/commanmaster/common.services'
import { ToastrCustomService } from '../../commonServices/toastr.service'
import { Settings } from '../../shared/constants/settings.constant'

@Component({
  selector: 'app-profit-and-loss-report',
  templateUrl: './profit-and-loss-report.component.html',
  styleUrls: ['./profit-and-loss-report.component.css']
})
export class ProfitAndLossReportComponent implements OnInit {
  DIRECT_SALE_TYPE: any = 'DirectSale'
  saleDirectDetails: any
  totalDiscount: number
  totaltax: number
  totalBillAmount: number
  newDateSub: Subscription
  dateShow : any
  clientDateFormat: any
  constructor(public _settings: Settings,public _commonService: CommonService, public _toastrCustomService: ToastrCustomService) {
    this.clientDateFormat = this._settings.dateFormat

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
   this.headervalue2 =0
   this.headervalue1 =0
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
    this._commonService.getProfitAndLossList(date).subscribe(data => {
      this.headervalue2 =0
      this.headervalue1 =0
if(data.Code === UIConstant.THOUSAND && data.Data.length  >0 ){
        this.mainData =  data.Data
    

        let getArrayList = data.Data
        let obj = {}
        getArrayList.forEach(element => {
          this.headervalue1 =  this.mainData.filter(
            getvalue => (getvalue.HeadId ===1) &&  (getvalue.LevelNo === 1)
          )
          .map(getvalue => parseFloat(getvalue.Amount1))
          .reduce((sum, current) => sum + current, 0)
          this.headervalue2 =  this.mainData.filter(
            getvalue => (getvalue.HeadId ===2) &&  (getvalue.LevelNo === 1)
          )
          .map(getvalue => parseFloat(getvalue.Amount1))
          .reduce((sum, current) => sum + current, 0)
    
        });
        console.log(this.headervalue1,this.headervalue2 ,'add')


}
    })

  }
}








