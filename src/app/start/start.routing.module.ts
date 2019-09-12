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
      //  loadChildren: '../admin/admin.module#AdminModule'
        loadChildren: async () => {
          const { AdminModule } = 
          await import('../admin/admin.module');
          return AdminModule;
        },
      },
      {
        path: 'dashboard',
        // loadChildren: '../start/dashboard/ims-dashboard/ims-dashboard.module#DashboardModule'
        //loadChildren: () => import('../start/dashboard/ims-dashboard/ims-dashboard.module').then(m => m.DashboardModule)
        loadChildren: async () => {
          const { DashboardModule } = await import('../start/dashboard/ims-dashboard/ims-dashboard.module');
          return DashboardModule;
        }
      },
      {
        path: 'ims/sale-travel',
        loadChildren: async () => {
          const { SalesTravelModule } = 
          await import('../sales-travel/sales/sales.module');
          return SalesTravelModule;
        }
       // loadChildren: '../sales-travel/sales/sales.module#SalesTravelModule'
      },
      {
        path: 'ims/sale-travel/sale-return',
        //loadChildren: '../sales-travel/sales-return/sales-return.module#SalesReturnModule'
        loadChildren: async () => {
          const { SalesReturnModule } = 
          await import('../sales-travel/sales-return/sales-return.module');
          return SalesReturnModule;
        }
      },
      {
        path: 'ims/sale-courier',
      //  loadChildren: '../sales-courier-local/sales-courier-local.module#SalesCourierLocalModule'
      loadChildren: async () => {
        const { SalesCourierLocalModule } = 
        await import('../sales-courier-local/sales-courier-local.module');
        return SalesCourierLocalModule;
      }
      },
      {
        path: 'ims/sale-courier-parcel',
       // loadChildren: '../sales-courier-parcel/sale-courier-parcel.module#SalesCourierParcelModule'
       loadChildren: async () => {
        const { SalesCourierParcelModule } = 
        await import('../sales-courier-parcel/sale-courier-parcel.module');
        return SalesCourierParcelModule;
      }
      },
      {
        path: 'ims/unit',
        //loadChildren: '../transactionMaster/unit/unit.module#UnitModule'
        loadChildren: async () => {
          const { UnitModule } = 
          await import('../transactionMaster/unit/unit.module');
          return UnitModule;
        }
      },
      {
        path: 'ims/category',
      //  loadChildren: '../transactionMaster/category/category.module#CategoryModule'
      loadChildren: async () => {
        const { CategoryModule } = 
        await import('../transactionMaster/category/category.module');
        return CategoryModule;
      }
      },
      {
        path: 'ims/composite',
        loadChildren: async () => {
          const { CompositeUnitModule } = 
          await import('../transactionMaster/composite-unit/composite-unit.module');
          return CompositeUnitModule;
        }
       // loadChildren: '../transactionMaster/composite-unit/composite-unit.module#CompositeUnitModule'
      },
      {
        path: 'ims/tax',
        //loadChildren: '../transactionMaster/tax/tax.module#TaxModule'
        loadChildren: async () => {
          const { TaxModule } = 
          await import('../transactionMaster/tax/tax.module');
          return TaxModule;
        }
      },
      {
        path: 'ims/item',
  //loadChildren: '../transactionMaster/item-master/item-master.module#ItemMasterModule'
        loadChildren: async () => {
          const { ItemMasterModule } = 
          await import('../transactionMaster/item-master/item-master.module');
          return ItemMasterModule;
        }
      },
      {
        path: 'ims/routing',
        loadChildren: async () => {
          const { RouteModule } = 
          await import('../transactionMaster/route/route.module');
          return RouteModule;
        }
        //loadChildren: '../transactionMaster/route/route.module#RouteModule'
      },
      {
        path: 'ims/customer',
      //  loadChildren: '../transactionMaster/customer/customer.module#CustomerModule'
        loadChildren: async () => {
          const { CustomerModule } = 
          await import('../transactionMaster/customer/customer.module');
          return CustomerModule;
        }
      },
      {
        path: 'ims/vendor',
       // loadChildren: '../transactionMaster/vendor/vendor.module#VendorModule'
        loadChildren: async () => {
          const { VendorModule } = 
          await import('../transactionMaster/vendor/vendor.module');
          return VendorModule;
        }
      },
      {
        path: 'ims/sale-challan',
        //loadChildren: '../inventory/sales-challan/sales-challan/sales-challan.module#SalesChallanModule'
        loadChildren: async () => {
          const { SalesChallanModule } = 
          await import('../inventory/sales-challan/sales-challan/sales-challan.module');
          return SalesChallanModule;
        }
      },
      {
        path: 'ims/attribute',
       // loadChildren: '../transactionMaster/attribute/attribute.module#AttributeModule'
        loadChildren: async () => {
          const { AttributeModule } = 
          await import('../transactionMaster/attribute/attribute.module');
          return AttributeModule;
        }
      },
      {
        path: 'ims/purchase',
       // loadChildren: '../inventory/purchase/purchase.module#PurchaseModule'
        loadChildren: async () => {
          const { PurchaseModule } = 
          await import('../inventory/purchase/purchase.module');
          return PurchaseModule;
        }
      },
      {
        path: 'ims/report',
        loadChildren: () => import('../report/item-stock-report/item-stock-report.module').then(m => m.ItemStockReportModule)
      },
      {
        path: 'ims/profit-report',
        loadChildren: () => import('../report/profit-report/profit-report.module').then(m => m.ProfitReportModule)
      },
      {
        path: 'ims/attribute',
        loadChildren: () => import('../transactionMaster/attribute/attribute.module').then(m => m.AttributeModule)
      },
      {
        path: 'owner/branch',
        loadChildren: () => import('./org-branch/org-branch-list/org-branch-list.module').then(m => m.OrgBranchModule)
      },
      {
        path: 'owner/branch/office',
        loadChildren: () => import('./org-branch/org-branch-office-list/org-branch-office-list.module').then(m => m.OrgBranchOfficeModule)
      },
      {
        path: 'users',
        loadChildren: () => import('../user/user-list/user-list.module').then(m => m.UserListModule)
      },
      {
        path: 'usertypes',
        loadChildren: () => import('../user/user-type-list/user-type-list.module').then(m => m.UserTypeListModule)
      },
      {
        path: 'user-rights',
        loadChildren: () => import('../user/user-rights/user-rights.module').then(m => m.UserRightsModule)
      },
      {
        path: 'ims/sale',
        //loadChildren: '../inventory/sale-direct/sale-direct.module#SalesDirectModule'
        loadChildren: async () => {
          const { SalesDirectModule } = 
          await import('../inventory/sale-direct/sale-direct.module');
          return SalesDirectModule;
        }
      },
      {
        path: 'ims/bank',
        loadChildren: () => import('../transactionMaster/bank/bank.module').then(m => m.BankModule)
      },
      {
        path: 'ims/report/item-category',
        loadChildren: () => import('../report/item-category-sale/item-sale-category-report.module').then(m => m.ItemSaleCategoryReportModule)
      },
      {
        path: 'settings',
        loadChildren: () => import('../settings/settings.module').then(m => m.SettingsModule)
      },
      {
        path: 'account/ledgergroup',
        loadChildren: () => import('../transactionMaster/ledger-group/ledger-group.module').then(m => m.LedgerGroupModule)
      },
      {
        path: 'account/ledgercreation',
        loadChildren: () => import('../transactionMaster/ledger-creation/ledger-creation.module').then(m => m.LedgerCreationModule)
      },
         {
        path: 'account/ledger-summary',
        loadChildren: () => import('../report/ledger-summary/ledger-summary.module').then(m => m.LedgerSummaryModule)
      },
      {
        path: 'account/balance-sheet',
        loadChildren: () => import('../account/balance-sheet/balance-sheet-report.module').then(m => m.BalanceSheetReportModule)
      },
      {
        path: 'ims/report/sale-item',
        loadChildren: () => import('../report/item-sale-report/item-sale-report.module').then(m => m.ItemSaleReportModule)
      },
      {
        path: 'opening-stk',
        loadChildren: () => import('../shared/transactionMaster/opening-stk/opening-stk.module').then(m => m.OpeningStkModule)
      },
      {
        path: 'ims/report/purchase-item',
        loadChildren: () => import('../report/item-purchase-report/item-purchase-report.module').then(m => m.ItemPurchaseReportModule)
      },
      {
        path: 'account/Profit-Loss',
        loadChildren: () => import('../account/profit-and-loss/profit-and-loss-report.module').then(m => m.ProfitAndLossReportModule)
      },
      {
        path: 'account/trading',
        loadChildren: () => import('../account/trading/trading-report.module').then(m => m.TradingReportModule)
      },
      {
        path: 'ims/voucher-entry',
        loadChildren: () => import('../inventory/voucher-entry/voucher-entry.module').then(m => m.VoucherEntryModule),
        pathMatch: 'full'
      },
      {
        path: 'common-menu/:code',
        loadChildren: () => import('../start/common-menu/common-menu.module').then(m => m.CommonMenuModule)
      },
      {
        path: 'transaction-number',
        loadChildren: () => import('../shared/transaction-number/transaction-number.module').then(m => m.TransactionNumberModule)
      },
      {
        path: 'sample-approval',
        loadChildren: () => import('../Manufacturer/sample-approval/sample-approval.module').then(m => m.SampleApprovalModule)
      },
      {
        path: 'style',
        loadChildren: () => import('../Manufacturer/style/style.module').then(m => m.StyleModule)
      },
      {
        path: 'material-requirement',
        loadChildren: () => import('../Manufacturer/item-requirement/item-requirement.module').then(m => m.ItemRequirementModule)
      } ,
      {
        path: 'ims/report/item-inventory',
        loadChildren: () => import('../report/item-inventory-report/item-inventory-report.module').then(m => m.ItemInventoryReportModule)
      } ,
      {
        path: 'account/trail-balance',
        loadChildren: () => import('../account/trail-balance/trail-balance-report.module').then(m => m.TrailBalanceReportModule)
      },
      {
        path: 'buyer-order',
        loadChildren: () => import('../Manufacturer/buyer-order/buyer-order.module').then(m => m.BuyerOrderModule)
      } ,
       {
        path: 'ims/report/cashbook',
        loadChildren: () => import('../report/cashbook/cashbook.module').then(m => m.CashBookModule)
      } ,
      {
        path: 'ims/report/daybook',
        loadChildren: () => import('../report/daybook/daybook.module').then(m => m.DayBookModule)
      } ,
      {
        path: 'report/item-group-stock',
        loadChildren: () => import('../report/item-group-stock/item-group-stock.module').then(m => m.ItemGroupStockModule)
      }
      , {
        path: 'report/outstanding-payables',
        loadChildren: () => import('../report/outstanding-payables-report/outstanding-payables-report.module').then(m => m.OutStandingPayablesReportModule)
      }
      , {
        path: 'report/outstanding-receiables',
        loadChildren: () => import('../report/outstanding-receiables-report/outstanding-receiables-report.module').then(m => m.OutStandingReceiablesReportModule)
      }
      , {
        path: 'ims/report/cashbook-day',
        loadChildren: () => import('../report/cashbook-dayBalance/cashbook-dayBalance.module').then(m => m.CashBookDayBalanceModule)
      },
      {
        path: 'ims/report/bankbook',
        loadChildren: () => import('../report/bankbook/bankbook.module').then(m => m.BankBookModule)
      } ,
      {
        path: 'ims/report/purchase-register',
        loadChildren: () => import('../report/purchase-register/purchase-register.module').then(m => m.PurchaseRegisterModule)
      } ,
      {
        path: 'ims/report/sale-register',
        loadChildren: () => import('../report/sale-register/sale-register.module').then(m => m.SaleRegisterModule)
      } ,
      {
        path: 'ims/report/purchase-summary',
        loadChildren: () => import('../report/purchase-summary/purchase-summary.module').then(m => m.PurchaseSummaryReportModule)
      } ,
      {
        path: 'ims/report/sale-summary',
        loadChildren: () => import('../report/sale-summary/sale-summary.module').then(m => m.SaleSummaryReportModule)
      } ,
      {
        path: 'ims/report/journal-register',
        loadChildren: () => import('../report/journal-register/journal-register.module').then(m => m.JournalRegisterModule)
      } ,
      {
        path: 'ims/service',
        loadChildren: () => import('../transactionMaster/service-item/service-item.module').then(m => m.ServiceItemMasterModule)
      } ,
      {
        path: 'ims/service-billing',
        loadChildren: () => import('../inventory/service-billing/serviceBilling.module').then(m => m.serviceBillingModule)
      },
      {
        path: 'ims/sale-return',
        loadChildren: () => import('../inventory/sale-direct/sales-return/saleReturn.module').then(m => m.SaleDirectReturnModule)
      },
      {
        path: 'ims/purchase-return',
        loadChildren: () => import('../inventory/purchase/purchase-return/purchaseReturn.module').then(m => m.PurchaseReturnModule)
      },
      {
        path: 'report/gstr-anx-1-summary',
        loadChildren: () => import('../report/gstr-anx-1-list/gstr-anx-1-list.module').then(m => m.GstrAnx1ListModule)
      },
      {
        path: 'report/gstr-anx-1-b2c-details',
        loadChildren: () => import('../report/gstr-anx-1-b2c-details/gstr-anx-1-b2c-details.module').then(m => m.GstrAnx1B2cDetailsModule)
      },
      {
        path: 'report/gstr-anx-1-b2b-details',
        loadChildren: () => import('../report/gstr-anx-1-b2b-details/gstr-anx-1-b2b-details.module').then(m => m.GstrAnx1B2bDetailsModule)
      },
      {
        path: 'report/gstr-anx-2-summary',
        loadChildren: () => import('../report/gstr-anx-2-list/gstr-anx-2-list.module').then(m => m.GstrAnx2ListModule)
      },
      {
        path: 'report/gstr-anx-2-details',
        loadChildren: () => import('../report/gstr-anx-2-details/gstr-anx-2-details.module').then(m => m.GstrAnxTwoDetailsModule)
      },
      {
        path: 'ims/Terms&Condition',
        loadChildren: () => import('../transactionMaster/terms-and-condition/terms-and-condition.module').then(m => m.TermsAndConditionModule)
      },
      {
        path: 'report/msmed-outstanding',
        loadChildren: () => import('../report/msmed-outstanding/msmed-outstanding.module').then(m => m.MsmedOutstandingModule)
      },
      {
        path: 'report/msmed-outstanding/:id/details',
        loadChildren: () => import('../report/msmed-outstanding-details/msmed-outstanding-details.module').then(m => m.MsmedOutstandingDetailsModule)
      },
      {
        path: 'report/msmed-outstanding/details',
        loadChildren: () => import('../report/msmed-outstanding-details/msmed-outstanding-details.module').then(m => m.MsmedOutstandingDetailsModule)
      },
      {
        path: 'report/dues-overdues-outstanding',
        loadChildren: () => import('../report/dues-overdues-outstanding/dues-overdues-outstanding.module').then(m => m.DuesOverduesOutstandingModule)
      },
      {
        path: 'change-password',
        loadChildren: () => import('./change-password/change-password.module').then(m => m.ChangePasswordModule)
      },
      {
        path: 'ims/discount-master',
        loadChildren: () => import('../transactionMaster/discount-master/discount-master.module').then(m => m.DiscountMasterModule)

      }
      //
      
      // DiscountMasterModule
    ]
  }
]
  
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StartRoutingModule { }
