import { Component, OnInit } from '@angular/core'
import { ItemModel } from '../../model/sales-tracker.model'
import { Subscription } from 'rxjs/Subscription'
import { Select2OptionData } from 'ng2-select2'
import { ItemmasterServices } from '../../commonServices/TransactionMaster/item-master.services'
import { ToastrCustomService } from '../../commonServices/toastr.service'
import { UIConstant } from '../../shared/constants/ui-constant'
import { ErrorConstant } from '../../shared/constants/error-constants'
import { CommonService } from 'src/app/commonServices/commanmaster/common.services';
declare const $: any
@Component({
  selector: 'app-route',
  templateUrl: './route.component.html',
  styleUrls: ['./route.component.css']
})
export class RouteComponent implements OnInit {
  unitId: number
  taxId: number
  id: number
  categoryId: number
  itemDetail: ItemModel[]
  subscribe: Subscription
  public subCategoryType: Array<Select2OptionData>
  public selectUnitType: Array<Select2OptionData>
  public selectTax: Array<Select2OptionData>
  taxTypePlaceHolder: Select2Options
  subCategoryPlaceHolder: Select2Options
  unitTypePlaceHolder: Select2Options
  categoryPlaceHolder: Select2Options
  isTradeDiscountApply: number
  isVolumeDiscountApply: number
  isNotDiscountable: number
  newRouteSub: Subscription
  deleteSub: Subscription
  recordNotFoundMessage: string = ''
  constructor (private _itemmasterServices: ItemmasterServices,
    private commonService: CommonService,
    private toastrService: ToastrCustomService) {
    this.deleteSub = this.commonService.getDeleteStatus().subscribe(
      (obj) => {
        if (obj.id && obj.type && obj.type === 'route') {
          this.deleteItem(obj.id)
        }
      }
    )

    this.newRouteSub = this.commonService.newRouteStatus().subscribe(
      (obj) => {
        this.id = UIConstant.ZERO
        this.itemDetail = []
        this.getItemMasterDetail()
      }
    )
  }

  ngOnDestroy () {
    this.newRouteSub.unsubscribe()
  }

  deleteItem (id) {
    if (id) {
      this._itemmasterServices.deleteItem(id).subscribe(Data => {
        if (Data.Code === UIConstant.DELETESUCCESS) {
          console.log(Data,'deleted route')
          this.toastrService.showSuccess('Sucess', 'Deleted Successfully')
          this.commonService.closeDelete('')
          this.getItemMasterDetail()
        }
        if (Data.Code === UIConstant.NORECORDFOUND) {
          this.toastrService.showInfo('Info', Data.Message)
          this.commonService.closeDelete('')

        }
      })
    }
  }

  ngOnInit () {
    this.itemDetail = []
    this.getItemMasterDetail()
  }

  editRoute (id) {
    this.commonService.openRouting(id)
  }

  getItemMasterDetail () {
    this.subscribe = this._itemmasterServices.getItemMasterDetail().subscribe(Data => {
      console.log('route data : ', Data)
      if (Data.Code === UIConstant.THOUSAND && Data.Data) {
        this.itemDetail = Data.Data
      } else {
        this.recordNotFoundMessage = ErrorConstant.RECORD_NOT_FOUND_TABLE
      }
    })
  }

  openSearch = false
  toggleSearch () {
    this.openSearch = !this.openSearch
  }
  addRoutinPopup () {
    this.commonService.openRouting('')
  }

  deleteRoute (id) {
    this.commonService.openDelete(id, 'route')
  }

}
