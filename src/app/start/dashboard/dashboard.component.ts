import { Component } from '@angular/core'
import { Router } from '@angular/router'
import { URLConstant } from '../../shared/constants/urlconstant'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  constructor (private _route: Router) { }

  routeCategory () {
    this._route.navigate([URLConstant.IMS_CATEGORY_URL])
  }

  itemMaster () {
    this._route.navigate([URLConstant.IMS_ITEM_MASTER_URL])
    console.log(URLConstant.IMS_ITEM_MASTER_URL)
  }
  routeUnit () {
    this._route.navigate([URLConstant.IMS_UNIT_URL])
  }
  routeComposite () {
    this._route.navigate([URLConstant.IMS_COMPOSITE_URL])
  }

  routeTax () {
    this._route.navigate([URLConstant.IMS_TAX_URL])
  }

  routeCustomer () {
    this._route.navigate([URLConstant.IMS_COUSTMER_URL])
  }
  routeVendor () {
    this._route.navigate([URLConstant.IMS_VENDOR_URL])
  }
  routeVouture () {
    this._route.navigate([URLConstant.IMS_VOUCHER_URL])
  }

  routePurchases () {
    this._route.navigate([URLConstant.PURCHASES])
  }

  routeSaleTourism () {
    this._route.navigate([URLConstant.SALE_TOURISM])
  }

  routeSaleCourier () {
    this._route.navigate([URLConstant.SALE_COURIER])
  }

  routeSalesCourierParcel () {
    this._route.navigate([URLConstant.SALE_COURIER_PARCEL])
  }

  routeRouting () {
    this._route.navigate([URLConstant.IMS_ROUTING_URL])
  }

  routeSaleReturn () {
    this._route.navigate([URLConstant.SALE_RETURN_URL])
  }

  routeSalesChallan () {
    this._route.navigate([URLConstant.SALE_CHALLAN])
  }

  routePurchase () {
    this._route.navigate([URLConstant.PURCHASE])
  }

  routeItemStockReport () {
    this._route.navigate([URLConstant.REPORT_ITEM_STOCK])
  }

  routeProfitReport () {
    this._route.navigate([URLConstant.PROFIT_REPORT])
  }

  routeDirectSale () {
    this._route.navigate([URLConstant.SALE_DIRECT])
  }
  routeAttribute () {
    this._route.navigate([URLConstant.ATTRIBUTE_ADD])
  }
  routeBank () {
    this._route.navigate([URLConstant.BANK_URL])
  }
  routeItemSaleByCategoryReport (){
    this._route.navigate([URLConstant.REPORT_ITEM_BY_CATEGORY_SALE])
  }

  routeUser () {
    this._route.navigate([URLConstant.USERS])
  }

  routeUserRights () {
    this._route.navigate([URLConstant.USER_RIGHTS])
  }

  routeUserTypes () {
    this._route.navigate([URLConstant.USER_TYPES])
  }

  routeOffice () {
    this._route.navigate([URLConstant.OFFICE_PAGE])
  }

  routeBranch () {
    this._route.navigate([URLConstant.BRANCH_PAGE])
  }

  routeSettings () {
    this._route.navigate([URLConstant.SETTINGS_PAGE])
  }

  showProfileStatus: any = {
    profileOpen: false,
    editMode: false
  }
  closeProfile = () => {
    this.showProfileStatus = {
      profileOpen: false,
      editMode: false
    }
  }

  /* Function invoke on click of organisation profile menu */
  showProfile = () => {
    this.showProfileStatus = {
      profileOpen: true,
      editMode: true
    }
  }

  routeCreation () {
    this._route.navigate([URLConstant.LEDGER_CREATION])
  }
  routeGroup () {
    this._route.navigate([URLConstant.LEDGER_GROUP])
  }
   
}
