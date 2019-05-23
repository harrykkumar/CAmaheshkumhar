import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { StartComponent } from './start/start.component'
import { HeaderComponent } from './header/header.component'
import { DashboardComponent } from './dashboard/dashboard.component'
import { FooterComponent } from './footer/footer.component'
import { HttpModule } from '@angular/http'
import { HttpClientModule } from '@angular/common/http'
import { StartRoutingModule } from './start.routing,module'
import { CustomerAddModule } from '../shared/transactionMaster/customer/customer-add/customer-add.module'
import { BankAddModule } from '../shared/transactionMaster/bank/bank-add/bank-add.module'
import { RoutingAddModule } from '../shared/transactionMaster/routing/routing-add/routing-add.module'
import { VendorAddModule } from '../shared/transactionMaster/vendor/vendor-add/vendor-add.module'
import { CompositeUnitAddModule } from '../shared/transactionMaster/composite-unit/composite-unit-add/composite-unit-add.module'
import { ItemAddModule } from '../shared/transactionMaster/item-master/item-master-add/item-add.module'
import { TaxAddModule } from '../shared/transactionMaster/tax/tax-add/tax-add.module'
import { CouponComponent } from '../transactionMaster/coupon/coupon.component'
import { DiscountComponent } from '../transactionMaster/discount/discount.component'
import { LoyalityComponent } from '../transactionMaster/loyality/loyality.component'
import { OfferComponent } from '../transactionMaster/offer/offer.component'
import { TaxProcessComponent } from '../transactionMaster/tax-process/tax-process.component'
import { DeleteModule } from '../shared/transactionMaster/delete-modal/delete-modal.module'
import { ImageModalModule } from '../shared/transactionMaster/images-modal/image-modal.module'
import { CategoryAddModule } from '../shared/transactionMaster/category/category-add/category-add.module'
import { UnitAddModule } from '../shared/transactionMaster/unit/unit-add/unit-add.module'
import { AddressAddModule } from '../shared/transactionMaster/address/address-add/address-add.module'
import { AttributeAddModule } from '../shared/transactionMaster/attribute-add/attribute-add.module'
import { OrganisationProfileComponent } from './header/organisation-profile/organisation-profile.component'
import { FormsModule } from '@angular/forms'
import { Select2Module } from 'ng2-select2'
import { PrintModule } from '../transactionMaster/print/print-add/print.module'
import { BankModule } from '../transactionMaster/bank/bank.module'
import {LedgerGroupAddModule} from '../shared/transactionMaster/ledger-group/ledger-group-add/ledger-group.module'
import {LedgerCreationAddModule} from '../shared/transactionMaster/ledger-creation/ledger-creation-add/ledger-creation.module'
@NgModule({
  declarations: [
    HeaderComponent,
    DashboardComponent,
    FooterComponent,
    StartComponent,
    CouponComponent,
    DiscountComponent,
    LoyalityComponent,
    OfferComponent,
    TaxProcessComponent,
    OrganisationProfileComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
// tslint:disable-next-line: deprecation
    HttpModule,
    Select2Module,
    FormsModule,
    StartRoutingModule,
    CustomerAddModule,
    BankAddModule,
    CompositeUnitAddModule,
    RoutingAddModule,
    VendorAddModule,
    ItemAddModule,
    TaxAddModule,
    DeleteModule,
    ImageModalModule,
    CategoryAddModule,
    UnitAddModule,
    TaxAddModule,
    AddressAddModule,
    AttributeAddModule,
    PrintModule,
    BankModule,
    LedgerGroupAddModule,
    LedgerCreationAddModule
  ],
  bootstrap: []
})
export class StartModule { }
