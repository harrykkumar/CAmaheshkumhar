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
        // loadChildren: async () => {
        //   const { AdminModule } = await import('../admin/admin.module');
        //   return AdminModule;
        // },
        loadChildren: () => import('../admin/admin.module').then(m => m.AdminModule),

      },
      {
        path: 'dashboard',
        loadChildren: () => import('../start/dashboard/ims-dashboard/ims-dashboard.module').then(m => m.DashboardModule),

      },
      {
        path: 'ims/sale-travel',
        loadChildren: () =>  import('../sales-travel/sales/sales.module').then(m => m.SalesTravelModule)
      },
      {
        path: 'ims/sale-travel/sale-return',
        loadChildren: () =>  import('../sales-travel/sales-return/sales-return.module').then(m => m.SalesReturnModule)
       
      },
      {
        path: 'ims/sale-courier',
        loadChildren: () =>  import('../sales-courier-local/sales-courier-local.module').then(m => m.SalesCourierLocalModule)
         
      },
      {
        path: 'ims/sale-courier-parcel',
        loadChildren: () => import('../sales-courier-parcel/sale-courier-parcel.module').then(m => m.SalesCourierParcelModule)
         
      },
      {
        path: 'ims/unit',
        loadChildren:  () => import('../transactionMaster/unit/unit.module').then(m => m.UnitModule)
          
      },
      {
        path: 'ims/category',
        loadChildren:  () =>  import('../transactionMaster/category/category.module').then(m => m.CategoryModule)
               
      },
      {
        path: 'ims/composite',
        loadChildren:  () =>  import('../transactionMaster/composite-unit/composite-unit.module').then(m => m.CompositeUnitModule)
          
        
      },
      {
        path: 'ims/tax',
        loadChildren:  () =>  import('../transactionMaster/tax/tax.module').then(m => m.TaxModule)
          
      },
      {
        path: 'ims/item',
        loadChildren:  () =>  import('../transactionMaster/item-master/item-master.module').then(m => m.ItemMasterModule)
                
      },
      {
        path: 'ims/routing',
        loadChildren:  () =>  import('../transactionMaster/route/route.module').then(m => m.RouteModule)
           
      },
      {
        path: 'ims/customer',
        loadChildren:  () =>  import('../transactionMaster/customer/customer.module').then(m => m.CustomerModule)
             },
      {
        path: 'ims/vendor',
        loadChildren:  () => import('../transactionMaster/vendor/vendor.module').then(m => m.VendorModule)
            
      },
      {
        path: 'ims/sale-challan',
        loadChildren:  () =>  import('../inventory/sales-challan/sales-challan/sales-challan.module').then(m => m.SalesChallanModule)
       
      },
      {
        path: 'ims/attribute',
        loadChildren:  () =>  import('../transactionMaster/attribute/attribute.module').then(m => m.AttributeModule)
         
      },
      {
        path: 'ims/purchase',
        loadChildren:  () =>  import('../inventory/purchase/purchase.module').then(m => m.PurchaseModule)
         
      },
      {
        path: 'ims/report',
        loadChildren:  () =>  import('../report/item-stock-report/item-stock-report.module').then(m => m.ItemStockReportModule)
          
      },
      {
        path: 'ims/profit-report',
        loadChildren:  () => import('../report/profit-report/profit-report.module').then(m => m.ProfitReportModule)
       
      },
      {
        path: 'ims/attribute',
        loadChildren:  () => import('../transactionMaster/attribute/attribute.module').then(m => m.AttributeModule)
         
      },
      {
        path: 'owner/branch',
        loadChildren:  () => import('./org-branch/org-branch-list/org-branch-list.module').then(m => m.OrgBranchModule)
         
      },
      {
        path: 'owner/branch/office',
        loadChildren:  () =>  import('./org-branch/org-branch-office-list/org-branch-office-list.module').then(m => m.OrgBranchOfficeModule)
        
      },
      {
        path: 'users',
        loadChildren:  () =>  import('../user/user-list/user-list.module').then(m => m.UserListModule)
        
      },
      {
        path: 'usertypes',
        loadChildren:  () =>  import('../user/user-type-list/user-type-list.module').then(m => m.UserTypeListModule)
          
      },
      {
        path: 'user-rights',
        loadChildren:  () =>  import('../user/user-rights/user-rights.module').then(m => m.UserRightsModule)
         
      },
      {
        path: 'ims/sale',
        loadChildren:  () => import('../inventory/sale-direct/sale-direct.module').then(m => m.SalesDirectModule)
         
      },
      {
        path: 'ims/bank',
        loadChildren:  () =>  import('../transactionMaster/bank/bank.module').then(m => m.BankModule)
         
      },
      {
        path: 'ims/report/item-category',
        loadChildren:  () =>  import('../report/item-category-sale/item-sale-category-report.module').then(m => m.ItemSaleCategoryReportModule)
        
      },
      {
        path: 'settings',
        loadChildren:  () => import('../settings/settings.module').then(m => m.SettingsModule)
         
      },
      {
        path: 'account/ledgergroup',
        loadChildren:  () =>  import('../transactionMaster/ledger-group/ledger-group.module').then(m => m.LedgerGroupModule)
         
      },
      {
        path: 'account/ledgercreation',
        loadChildren:  () =>  import('../transactionMaster/ledger-creation/ledger-creation.module').then(m => m.LedgerCreationModule)
        
      },
      {
        path: 'account/ledger-summary',
        loadChildren:  () =>  import('../report/ledger-summary/ledger-summary.module').then(m => m.LedgerSummaryModule)
         
      },
      {
        path: 'account/balance-sheet',
        loadChildren:  () => import('../account/balance-sheet/balance-sheet-report.module').then(m => m.BalanceSheetReportModule)
          
      },
      {
        path: 'ims/report/sale-item',
        loadChildren:  () =>  import('../report/item-sale-report/item-sale-report.module').then(m => m.ItemSaleReportModule)
         
      },
      {
        path: 'opening-stk',
        loadChildren:  () =>  import('../shared/transactionMaster/opening-stk/opening-stk.module').then(m => m.OpeningStkModule)
         
      },
      {
        path: 'ims/report/purchase-item',
        loadChildren:  () =>  import('../report/item-purchase-report/item-purchase-report.module').then(m => m.ItemPurchaseReportModule)
          
      },
      {
        path: 'account/Profit-Loss',
        loadChildren:  () => import('../account/profit-and-loss/profit-and-loss-report.module').then(m => m.ProfitAndLossReportModule)
         
      },
      {
        path: 'account/trading',
        loadChildren:  () =>  import('../account/trading/trading-report.module').then(m => m.TradingReportModule)
          
      },
      {
        path: 'ims/voucher-entry',
        loadChildren:  () =>  import('../inventory/voucher-entry/voucher-entry.module').then(m => m.VoucherEntryModule)
    ,
        pathMatch: 'full'
      },
      {
        path: 'common-menu/:code',
        loadChildren:  () => import('../start/common-menu/common-menu.module').then(m => m.CommonMenuModule)
         
      },
      {
        path: 'transaction-number',
        loadChildren:  () =>  import('../shared/transaction-number/transaction-number.module').then(m => m.TransactionNumberModule)
        
      },
      {
        path: 'sample-approval',
        loadChildren:  () => import('../Manufacturer/sample-approval/sample-approval.module').then(m => m.SampleApprovalModule)
        
      },
      {
        path: 'style',
        loadChildren:  () => import('../Manufacturer/style/style.module').then(m => m.StyleModule)
      
      },
      {
        path: 'material-requirement',
        loadChildren:  () =>  import('../Manufacturer/item-requirement/item-requirement.module').then(m => m.ItemRequirementModule)
         
      },
      {
        path: 'ims/report/item-inventory',
        loadChildren:  () => import('../report/item-inventory-report/item-inventory-report.module').then(m => m.ItemInventoryReportModule)
          
      },
      {
        path: 'account/trail-balance',
        loadChildren:  () =>  import('../account/trail-balance/trail-balance-report.module').then(m => m.TrailBalanceReportModule)
          
      },
      {
        path: 'ims/report/cashbook',
        loadChildren:  () => import('../report/cashbook/cashbook.module').then(m => m.CashBookModule)
         
      },
      {
        path: 'ims/report/daybook',
        loadChildren:  () =>  import('../report/daybook/daybook.module').then(m => m.DayBookModule)
         
      },
      {
        path: 'report/item-group-stock',
        loadChildren:  () =>  import('../report/item-group-stock/item-group-stock.module').then(m => m.ItemGroupStockModule)
         
      }
      , {
        path: 'report/outstanding-payables',
        // loadChildren: '../report/outstanding-payables-report/outstanding-payables-report.module#OutStandingPayablesReportModule'
        loadChildren:  () => import('../report/outstanding-payables-report/outstanding-payables-report.module').then(m => m.OutStandingPayablesReportModule)
         
      }
      , {
        path: 'report/outstanding-receiables',
        //loadChildren: '../report/outstanding-receiables-report/outstanding-receiables-report.module#OutStandingReceiablesReportModule'
        loadChildren:  () => import('../report/outstanding-receiables-report/outstanding-receiables-report.module').then(m => m.OutStandingReceiablesReportModule)
         
      }
      , {
        path: 'ims/report/cashbook-day',
        //  loadChildren: '../report/cashbook-dayBalance/cashbook-dayBalance.module#CashBookDayBalanceModule'
        loadChildren:  () =>  import('../report/cashbook-dayBalance/cashbook-dayBalance.module').then(m => m.CashBookDayBalanceModule)
          
      },
      {
        path: 'ims/report/bankbook',
        // loadChildren: '../report/bankbook/bankbook.module#BankBookModule'
        loadChildren:  () => import('../report/bankbook/bankbook.module').then(m => m.BankBookModule)
          
      },
      {
        path: 'ims/report/purchase-register',
        //  loadChildren: '../report/purchase-register/purchase-register.module#PurchaseRegisterModule'
        loadChildren:  () =>  import('../report/purchase-register/purchase-register.module').then(m => m.PurchaseRegisterModule)
          
      },
      {
        path: 'ims/report/sale-register',
        // loadChildren: '../report/sale-register/sale-register.module#SaleRegisterModule'
        loadChildren:  () =>  import('../report/sale-register/sale-register.module').then(m => m.SaleRegisterModule)
        
      },
      {
        path: 'ims/report/purchase-summary',
        // loadChildren: '../report/purchase-summary/purchase-summary.module#PurchaseSummaryReportModule'
        loadChildren:  () =>  import('../report/purchase-summary/purchase-summary.module').then(m => m.PurchaseSummaryReportModule)
         
      },
      {
        path: 'ims/report/sale-summary',
        // loadChildren: '../report/sale-summary/sale-summary.module#SaleSummaryReportModule'
        loadChildren:  () => import('../report/sale-summary/sale-summary.module').then(m => m.SaleSummaryReportModule)
         
      },
      {
        path: 'ims/report/journal-register',
        // loadChildren: '../report/journal-register/journal-register.module#JournalRegisterModule'
        loadChildren:  () =>  import('../report/journal-register/journal-register.module').then(m => m.JournalRegisterModule)
         
      },
      {
        path: 'ims/service',
        // loadChildren: '../transactionMaster/service-item/service-item.module#ServiceItemMasterModule'
        loadChildren:  () =>  import('../transactionMaster/service-item/service-item.module').then(m => m.ServiceItemMasterModule)
          
      },
      {
        path: 'ims/service-billing',
        loadChildren:  () =>  import('../inventory/service-billing/serviceBilling.module').then(m => m.serviceBillingModule)
         
      },
      {
        path: 'ims/sale-return',
        // loadChildren: '../inventory/sale-direct/sales-return/saleReturn.module#SaleDirectReturnModule'
        loadChildren:  () => import('../inventory/sale-direct/sales-return/saleReturn.module').then(m => m.SaleDirectReturnModule)
         
      },
      {
        path: 'ims/purchase-return',
        // loadChildren: '../inventory/purchase/purchase-return/purchaseReturn.module#PurchaseReturnModule'
        loadChildren:  () =>  import('../inventory/purchase/purchase-return/purchaseReturn.module').then(m => m.PurchaseReturnModule)
         
      },
      {
        path: 'report/gstr-anx-1-summary',
        // loadChildren: '../report/gstr-anx-1-list/gstr-anx-1-list.module#GstrAnx1ListModule'
        loadChildren: async () => import('../report/gstr-anx-1-list/gstr-anx-1-list.module').then(m => m.GstrAnx1ListModule)
         
      },
      {
        path: 'report/gstr-anx-1-b2c-details',
        // loadChildren: '../report/gstr-anx-1-b2c-details/gstr-anx-1-b2c-details.module#GstrAnx1B2cDetailsModule'
        loadChildren:  () =>  import('../report/gstr-anx-1-b2c-details/gstr-anx-1-b2c-details.module').then(m => m.GstrAnx1B2cDetailsModule)
         
      },
      {
        path: 'report/gstr-anx-1-b2b-details',
        // loadChildren: '../report/gstr-anx-1-b2b-details/gstr-anx-1-b2b-details.module#GstrAnx1B2bDetailsModule'
        loadChildren:  () =>  import('../report/gstr-anx-1-b2b-details/gstr-anx-1-b2b-details.module').then(m => m.GstrAnx1B2bDetailsModule)
 
      },
      {
        path: 'report/gstr-anx-2-summary',
        // loadChildren: '../report/gstr-anx-2-list/gstr-anx-2-list.module#GstrAnx2ListModule'
        loadChildren:  () =>import('../report/gstr-anx-2-list/gstr-anx-2-list.module').then(m => m.GstrAnx2ListModule)
   
      },
      {
        path: 'report/gstr-anx-2-details',
        // loadChildren: '../report/gstr-anx-2-details/gstr-anx-2-details.module#GstrAnxTwoDetailsModule'
        loadChildren: () => import('../report/gstr-anx-2-details/gstr-anx-2-details.module').then(m => m.GstrAnxTwoDetailsModule)
  
      },
      {
        path: 'ims/Terms&Condition',
        // loadChildren: '../transactionMaster/terms-and-condition/terms-and-condition.module#TermsAndConditionModule'
        loadChildren: async () =>  import('../transactionMaster/terms-and-condition/terms-and-condition.module').then(m => m.TermsAndConditionModule)
   
      },
      {
        path: 'report/msmed-outstanding',
        // loadChildren: '../report/msmed-outstanding/msmed-outstanding.module#MsmedOutstandingModule'
        loadChildren: () =>  import('../report/msmed-outstanding/msmed-outstanding.module').then(m => m.MsmedOutstandingModule)
         
      },
      {
        path: 'report/msmed-outstanding/:id/details',
        // loadChildren: '../report/msmed-outstanding-details/msmed-outstanding-details.module#MsmedOutstandingDetailsModule'
        loadChildren:  () =>  import('../report/msmed-outstanding-details/msmed-outstanding-details.module').then(m => m.MsmedOutstandingDetailsModule)
        
      },
      {
        path: 'report/msmed-outstanding/details',
        // loadChildren: '../report/msmed-outstanding-details/msmed-outstanding-details.module#MsmedOutstandingDetailsModule'
        loadChildren:  () =>  import('../report/msmed-outstanding-details/msmed-outstanding-details.module').then(m => m.MsmedOutstandingDetailsModule)
   
      },
      {
        path: 'report/dues-overdues-outstanding',
        // loadChildren: '../report/dues-overdues-outstanding/dues-overdues-outstanding.module#DuesOverduesOutstandingModule'
        loadChildren:  () =>  import('../report/dues-overdues-outstanding/dues-overdues-outstanding.module').then(m => m.DuesOverduesOutstandingModule)
         
      },
      {
        path: 'change-password',
        // loadChildren: './change-password/change-password.module#ChangePasswordModule'
        loadChildren:  () =>  import('./change-password/change-password.module').then(m => m.ChangePasswordModule)
  
      },
      {
        path: 'ims/discount-master',
        // loadChildren: '../transactionMaster/discount-master/discount-master.module#DiscountMasterModule'
        loadChildren:  () =>  import('../transactionMaster/discount-master/discount-master.module').then(m => m.DiscountMasterModule)
        
      },
      {
        path: 'super-admin/client',
        loadChildren:  () =>  import('../super-admin/client/client.module').then(m => m.ClientModule)
      },
      {
        path: 'super-admin/menu',
        loadChildren:  () =>  import('../super-admin/menu/menu.module').then(m => m.MenuModule)
      },
      {
        path: 'ims',
        loadChildren:  () =>  import('../transactionMaster/customRate/custom-rate.module').then(m => m.CustomRateModule)
      },
      {
        path: 'additional',
        loadChildren:  () =>  import('../additional-settings/additional-settings.module').then(m => m.AdditionalSettingsModule)
      },
      {
        path: 'manufacturing',
        loadChildren:  () =>  import('../Manufacturer/manufacturing.module').then(m => m.ManufacturingModule)
      },
      {
        path: 'ims/item-active-status',  
        loadChildren:  () =>  import('../transactionMaster/active-inventory/activeInventory.module').then(m => m.ActiveInventoryModule)
         
      },
      
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StartRoutingModule { }
