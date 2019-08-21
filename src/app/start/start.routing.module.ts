import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { StartComponent } from './start/start.component'
import { AuthService } from '../commonServices/auth.service';

const routes: Routes = [
  {
    path: '',
    component: StartComponent,
    canActivate: [AuthService],
    canActivateChild: [AuthService],
    children: [
      {
        path: 'admin',
        loadChildren: '../admin/admin.module#AdminModule'
      },
      {
        path: 'dashboard',
        loadChildren: '../start/dashboard/ims-dashboard/ims-dashboard.module#DashboardModule'
      },
      {
        path: 'ims/sale-travel',
        loadChildren: '../sales-travel/sales/sales.module#SalesTravelModule'
      },
      {
        path: 'ims/sale-travel/sale-return',
        loadChildren: '../sales-travel/sales-return/sales-return.module#SalesReturnModule'
      },
      {
        path: 'ims/sale-courier',
        loadChildren: '../sales-courier-local/sales-courier-local.module#SalesCourierLocalModule'
      },
      {
        path: 'ims/sale-courier-parcel',
        loadChildren: '../sales-courier-parcel/sale-courier-parcel.module#SalesCourierParcelModule'
      },
      {
        path: 'ims/unit',
        loadChildren: '../transactionMaster/unit/unit.module#UnitModule'
      },
      {
        path: 'ims/category',
        loadChildren: '../transactionMaster/category/category.module#CategoryModule'
      },
      {
        path: 'ims/composite',
        loadChildren: '../transactionMaster/composite-unit/composite-unit.module#CompositeUnitModule'
      },
      {
        path: 'ims/tax',
        loadChildren: '../transactionMaster/tax/tax.module#TaxModule'
      },
      {
        path: 'ims/item',
        loadChildren: '../transactionMaster/item-master/item-master.module#ItemMasterModule'
      },
      {
        path: 'ims/routing',
        loadChildren: '../transactionMaster/route/route.module#RouteModule'
      },
      {
        path: 'ims/customer',
        loadChildren: '../transactionMaster/customer/customer.module#CustomerModule'
      },
      {
        path: 'ims/vendor',
        loadChildren: '../transactionMaster/vendor/vendor.module#VendorModule'
      },
      {
        path: 'ims/sale-challan',
        loadChildren: '../inventory/sales-challan/sales-challan/sales-challan.module#SalesChallanModule'
      },
      {
        path: 'ims/attribute',
        loadChildren: '../transactionMaster/attribute/attribute.module#AttributeModule'
      },
      {
        path: 'ims/purchase',
        loadChildren: '../inventory/purchase/purchase.module#PurchaseModule'
      },
      {
        path: 'ims/report',
        loadChildren: '../report/item-stock-report/item-stock-report.module#ItemStockReportModule'
      },
      {
        path: 'ims/profit-report',
        loadChildren: '../report/profit-report/profit-report.module#ProfitReportModule'
      },
      {
        path: 'ims/attribute',
        loadChildren: '../transactionMaster/attribute/attribute.module#AttributeModule'
      },
      {
        path: 'owner/branch',
        loadChildren: './org-branch/org-branch-list/org-branch-list.module#OrgBranchModule'
      },
      {
        path: 'owner/branch/office',
        loadChildren: './org-branch/org-branch-office-list/org-branch-office-list.module#OrgBranchOfficeModule'
      },
      {
        path: 'users',
        loadChildren: '../user/user-list/user-list.module#UserListModule'
      },
      {
        path: 'usertypes',
        loadChildren: '../user/user-type-list/user-type-list.module#UserTypeListModule'
      },
      {
        path: 'user-rights',
        loadChildren: '../user/user-rights/user-rights.module#UserRightsModule'
      },
      {
        path: 'ims/sale',
        loadChildren: '../inventory/sale-direct/sale-direct.module#SalesDirectModule'
      },
      {
        path: 'ims/bank',
        loadChildren: '../transactionMaster/bank/bank.module#BankModule'
      },
      {
        path: 'ims/report/item-category',
        loadChildren: '../report/item-category-sale/item-sale-category-report.module#ItemSaleCategoryReportModule'
      },
      {
        path: 'settings',
        loadChildren: '../settings/settings.module#SettingsModule'
      },
      {
        path: 'account/ledgergroup',
        loadChildren: '../transactionMaster/ledger-group/ledger-group.module#LedgerGroupModule'
      },
      {
        path: 'account/ledgercreation',
        loadChildren: '../transactionMaster/ledger-creation/ledger-creation.module#LedgerCreationModule'
      },
         {
        path: 'account/ledger-summary',
        loadChildren: '../report/ledger-summary/ledger-summary.module#LedgerSummaryModule'
      },
      {
        path: 'account/balance-sheet',
        loadChildren: '../account/balance-sheet/balance-sheet-report.module#BalanceSheetReportModule'
      },
      {
        path: 'ims/report/sale-item',
        loadChildren: '../report/item-sale-report/item-sale-report.module#ItemSaleReportModule'
      },
      {
        path: 'opening-stk',
        loadChildren: '../shared/transactionMaster/opening-stk/opening-stk.module#OpeningStkModule'
      },
      {
        path: 'ims/report/purchase-item',
        loadChildren: '../report/item-purchase-report/item-purchase-report.module#ItemPurchaseReportModule'
      },
      {
        path: 'account/Profit-Loss',
        loadChildren: '../account/profit-and-loss/profit-and-loss-report.module#ProfitAndLossReportModule'
      },
      {
        path: 'account/trading',
        loadChildren: '../account/trading/trading-report.module#TradingReportModule'
      },
      {
        path: 'ims/voucher-entry',
        loadChildren: '../inventory/voucher-entry/voucher-entry.module#VoucherEntryModule',
        pathMatch: 'full'
      },
      {
        path: 'common-menu/:code',
        loadChildren: '../start/common-menu/common-menu.module#CommonMenuModule'
      },
      {
        path: 'transaction-number',
        loadChildren: '../shared/transaction-number/transaction-number.module#TransactionNumberModule'
      },
      {
        path: 'sample-approval',
        loadChildren: '../Manufacturer/sample-approval/sample-approval.module#SampleApprovalModule'
      },
      {
        path: 'style',
        loadChildren: '../Manufacturer/style/style.module#StyleModule'
      },
      {
        path: 'material-requirement',
        loadChildren: '../Manufacturer/item-requirement/item-requirement.module#ItemRequirementModule'
      } ,
      {
        path: 'ims/report/item-inventory',
        loadChildren: '../report/item-inventory-report/item-inventory-report.module#ItemInventoryReportModule'
      } ,
      {
        path: 'account/trail-balance',
        loadChildren: '../account/trail-balance/trail-balance-report.module#TrailBalanceReportModule'
      },
      {
        path: 'buyer-order',
        loadChildren: '../Manufacturer/buyer-order/buyer-order.module#BuyerOrderModule'
      } ,
       {
        path: 'ims/report/cashbook',
        loadChildren: '../report/cashbook/cashbook.module#CashBookModule'
      } ,
      {
        path: 'ims/report/daybook',
        loadChildren: '../report/daybook/daybook.module#DayBookModule'
      } ,
      {
        path: 'report/item-group-stock',
        loadChildren: '../report/item-group-stock/item-group-stock.module#ItemGroupStockModule'
      }
      , {
        path: 'report/outstanding-payables',
        loadChildren: '../report/outstanding-payables-report/outstanding-payables-report.module#OutStandingPayablesReportModule'
      }
      , {
        path: 'report/outstanding-receiables',
        loadChildren: '../report/outstanding-receiables-report/outstanding-receiables-report.module#OutStandingReceiablesReportModule'
      }
      , {
        path: 'ims/report/cashbook-day',
        loadChildren: '../report/cashbook-dayBalance/cashbook-dayBalance.module#CashBookDayBalanceModule'
      },
      {
        path: 'ims/report/bankbook',
        loadChildren: '../report/bankbook/bankbook.module#BankBookModule'
      } ,
      {
        path: 'ims/report/purchase-register',
        loadChildren: '../report/purchase-register/purchase-register.module#PurchaseRegisterModule'
      } ,
      {
        path: 'ims/report/sale-register',
        loadChildren: '../report/sale-register/sale-register.module#SaleRegisterModule'
      } ,
      {
        path: 'ims/report/purchase-summary',
        loadChildren: '../report/purchase-summary/purchase-summary.module#PurchaseSummaryReportModule'
      } ,
      {
        path: 'ims/report/sale-summary',
        loadChildren: '../report/sale-summary/sale-summary.module#SaleSummaryReportModule'
      } ,
      {
        path: 'ims/report/journal-register',
        loadChildren: '../report/journal-register/journal-register.module#JournalRegisterModule'
      } ,
      {
        path: 'ims/service',
        loadChildren: '../transactionMaster/service-item/service-item.module#ServiceItemMasterModule'
      } ,
      {
        path: 'ims/service-billing',
        loadChildren: '../inventory/service-billing/serviceBilling.module#serviceBillingModule'
      },
      {
        path: 'ims/sale-return',
        loadChildren: '../inventory/sale-direct/sales-return/saleReturn.module#SaleDirectReturnModule'
      },
      {
        path: 'ims/purchase-return',
        loadChildren: '../inventory/purchase/purchase-return/purchaseReturn.module#PurchaseReturnModule'
      },
      {
        path: 'report/gstr-anx-1-summary',
        loadChildren: '../report/gstr-anx-1-list/gstr-anx-1-list.module#GstrAnx1ListModule'
      },
      {
        path: 'report/gstr-anx-1-b2c-details',
        loadChildren: '../report/gstr-anx-1-b2c-details/gstr-anx-1-b2c-details.module#GstrAnx1B2cDetailsModule'
      },
      {
        path: 'report/gstr-anx-1-b2b-details',
        loadChildren: '../report/gstr-anx-1-b2b-details/gstr-anx-1-b2b-details.module#GstrAnx1B2bDetailsModule'
      },
      {
        path: 'report/gstr-anx-2-summary',
        loadChildren: '../report/gstr-anx-2-list/gstr-anx-2-list.module#GstrAnx2ListModule'
      },
      {
        path: 'report/gstr-anx-2-details',
        loadChildren: '../report/gstr-anx-2-details/gstr-anx-2-details.module#GstrAnxTwoDetailsModule'
      },
      {
        path: 'ims/Terms&Condition',
        loadChildren: '../transactionMaster/terms-and-condition/terms-and-condition.module#TermsAndConditionModule'
      },
      {
        path: 'report/msmed-outstanding',
        loadChildren: '../report/msmed-outstanding/msmed-outstanding.module#MsmedOutstandingModule'
      },
      {
        path: 'report/msmed-outstanding/:id/details',
        loadChildren: '../report/msmed-outstanding-details/msmed-outstanding-details.module#MsmedOutstandingDetailsModule'
      },
      {
        path: 'report/msmed-outstanding/details',
        loadChildren: '../report/msmed-outstanding-details/msmed-outstanding-details.module#MsmedOutstandingDetailsModule'
      }
    ]
  }
]
  
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StartRoutingModule { }
