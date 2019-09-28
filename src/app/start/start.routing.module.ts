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
        loadChildren: async () => {
          const { AdminModule } = await import('../admin/admin.module');
          return AdminModule;
        },
      },
      {
        path: 'dashboard',
        loadChildren: async () => {
          const { DashboardModule } = await import('../start/dashboard/ims-dashboard/ims-dashboard.module');
          return DashboardModule;
        },
      },
      {
        path: 'ims/sale-travel',
        loadChildren: async () => {
          const { SalesTravelModule } = await import('../sales-travel/sales/sales.module');
          return SalesTravelModule;
        },
      },
      {
        path: 'ims/sale-travel/sale-return',
        loadChildren: async () => {
          const { SalesReturnModule } = await import('../sales-travel/sales-return/sales-return.module');
          return SalesReturnModule;
        },
      },
      {
        path: 'ims/sale-courier',
        loadChildren: async () => {
          const { SalesCourierLocalModule } = await import('../sales-courier-local/sales-courier-local.module');
          return SalesCourierLocalModule;
        },
      },
      {
        path: 'ims/sale-courier-parcel',
        loadChildren: async () => {
          const { SalesCourierParcelModule } = await import('../sales-courier-parcel/sale-courier-parcel.module');
          return SalesCourierParcelModule;
        },
      },
      {
        path: 'ims/unit',
        loadChildren: async () => {
          const { UnitModule } = await import('../transactionMaster/unit/unit.module');
          return UnitModule;
        },
      },
      {
        path: 'ims/category',
        loadChildren: async () => {
          const { CategoryModule } = await import('../transactionMaster/category/category.module');
          return CategoryModule;
        },
      },
      {
        path: 'ims/composite',
        loadChildren: async () => {
          const { CompositeUnitModule } = await import('../transactionMaster/composite-unit/composite-unit.module');
          return CompositeUnitModule;
        },
      },
      {
        path: 'ims/tax',
        loadChildren: async () => {
          const { TaxModule } = await import('../transactionMaster/tax/tax.module');
          return TaxModule;
        },
      },
      {
        path: 'ims/item',
        loadChildren: async () => {
          const { ItemMasterModule } = await import('../transactionMaster/item-master/item-master.module');
          return ItemMasterModule;
        },
      },
      {
        path: 'ims/routing',
        loadChildren: async () => {
          const { RouteModule } = await import('../transactionMaster/route/route.module');
          return RouteModule;
        },
      },
      {
        path: 'ims/customer',
        loadChildren: async () => {
          const { CustomerModule } = await import('../transactionMaster/customer/customer.module');
          return CustomerModule;
        },
      },
      {
        path: 'ims/vendor',
        loadChildren: async () => {
          const { VendorModule } = await import('../transactionMaster/vendor/vendor.module');
          return VendorModule;
        },
      },
      {
        path: 'ims/sale-challan',
        loadChildren: async () => {
          const { SalesChallanModule } = await import('../inventory/sales-challan/sales-challan/sales-challan.module');
          return SalesChallanModule;
        },
      },
      {
        path: 'ims/attribute',
        loadChildren: async () => {
          const { AttributeModule } = await import('../transactionMaster/attribute/attribute.module');
          return AttributeModule;
        },
      },
      {
        path: 'ims/purchase',
        loadChildren: async () => {
          const { PurchaseModule } = await import('../inventory/purchase/purchase.module');
          return PurchaseModule;
        },
      },
      {
        path: 'ims/report',
        loadChildren: async () => {
          const { ItemStockReportModule } = await import('../report/item-stock-report/item-stock-report.module');
          return ItemStockReportModule;
        },
      },
      {
        path: 'ims/profit-report',
        loadChildren: async () => {
          const { ProfitReportModule } = await import('../report/profit-report/profit-report.module');
          return ProfitReportModule;
        },
      },
      {
        path: 'ims/attribute',
        loadChildren: async () => {
          const { AttributeModule } = await import('../transactionMaster/attribute/attribute.module');
          return AttributeModule;
        },
      },
      {
        path: 'owner/branch',
         loadChildren: async () => {
          const { OrgBranchModule } = await import('./org-branch/org-branch-list/org-branch-list.module');
          return OrgBranchModule;
        },
      },
      {
        path: 'owner/branch/office', 
         loadChildren: async () => {
          const { OrgBranchOfficeModule } = await import('./org-branch/org-branch-office-list/org-branch-office-list.module');
          return OrgBranchOfficeModule;
        },
      },
      {
        path: 'users',
        loadChildren: async () => {
          const { UserListModule } = await import('../user/user-list/user-list.module');
          return UserListModule;
        },
      },
      {
        path: 'usertypes',
        loadChildren: async () => {
          const { UserTypeListModule } = await import('../user/user-type-list/user-type-list.module');
          return UserTypeListModule;
        },
      },
      {
        path: 'user-rights',
        loadChildren: async () => {
          const { UserRightsModule } = await import('../user/user-rights/user-rights.module');
          return UserRightsModule;
        },
      },
      {
        path: 'ims/sale',
        loadChildren: async () => {
          const { SalesDirectModule } = await import('../inventory/sale-direct/sale-direct.module');
          return SalesDirectModule;
        },
      },
      {
        path: 'ims/bank',
        loadChildren: async () => {
          const { BankModule } = await import('../transactionMaster/bank/bank.module');
          return BankModule;
        },
      },
      {
        path: 'ims/report/item-category',
        loadChildren: async () => {
          const { ItemSaleCategoryReportModule } = await import('../report/item-category-sale/item-sale-category-report.module');
          return ItemSaleCategoryReportModule;
        },
      },
      {
        path: 'settings',
        loadChildren: async () => {
          const { SettingsModule } = await import('../settings/settings.module');
          return SettingsModule;
        },
      },
      {
        path: 'account/ledgergroup',
        loadChildren: async () => {
          const { LedgerGroupModule } = await import('../transactionMaster/ledger-group/ledger-group.module');
          return LedgerGroupModule;
        },
      },
      {
        path: 'account/ledgercreation',
        loadChildren: async () => {
          const { LedgerCreationModule } = await import('../transactionMaster/ledger-creation/ledger-creation.module');
          return LedgerCreationModule;
        },
      },
         {
        path: 'account/ledger-summary',
        loadChildren: async () => {
          const { LedgerSummaryModule } = await import('../report/ledger-summary/ledger-summary.module');
          return LedgerSummaryModule;
        },
      },
      {
        path: 'account/balance-sheet',
        loadChildren: async () => {
          const { BalanceSheetReportModule } = await import('../account/balance-sheet/balance-sheet-report.module');
          return BalanceSheetReportModule;
        },
      },
      {
        path: 'ims/report/sale-item',
        loadChildren: async () => {
          const { ItemSaleReportModule } = await import('../report/item-sale-report/item-sale-report.module');
          return ItemSaleReportModule;
        },
      },
      {
        path: 'opening-stk',
        loadChildren: async () => {
          const { OpeningStkModule } = await import('../shared/transactionMaster/opening-stk/opening-stk.module');
          return OpeningStkModule;
        },
      },
      {
        path: 'ims/report/purchase-item',
        loadChildren: async () => {
          const { ItemPurchaseReportModule } = await import('../report/item-purchase-report/item-purchase-report.module');
          return ItemPurchaseReportModule;
        },
      },
      {
        path: 'account/Profit-Loss',
        loadChildren: async () => {
          const { ProfitAndLossReportModule } = await import('../account/profit-and-loss/profit-and-loss-report.module');
          return ProfitAndLossReportModule;
        },
      },
      {
        path: 'account/trading',
        loadChildren: async () => {
          const { TradingReportModule } = await import('../account/trading/trading-report.module');
          return TradingReportModule;
        },
      },
      {
        path: 'ims/voucher-entry',
        loadChildren: async () => {
          const { VoucherEntryModule } = await import('../inventory/voucher-entry/voucher-entry.module');
          return VoucherEntryModule;
        },
        pathMatch: 'full'
      },
      {
        path: 'common-menu/:code',
        loadChildren: async () => {
          const { CommonMenuModule } = await import('../start/common-menu/common-menu.module');
          return CommonMenuModule;
        },
      },
      {
        path: 'transaction-number',
        loadChildren: async () => {
          const { TransactionNumberModule } = await import('../shared/transaction-number/transaction-number.module');
          return TransactionNumberModule;
        },
      },
      {
        path: 'sample-approval',
        loadChildren: async () => {
          const { SampleApprovalModule } = await import('../Manufacturer/sample-approval/sample-approval.module');
          return SampleApprovalModule;
        },
      },
      {
        path: 'style',
        loadChildren: async () => {
          const { StyleModule } = await import('../Manufacturer/style/style.module');
          return StyleModule;
        },
      },
      {
        path: 'material-requirement',
        loadChildren: async () => {
          const { ItemRequirementModule } = await import('../Manufacturer/item-requirement/item-requirement.module');
          return ItemRequirementModule;
        },
      } ,
      {
        path: 'ims/report/item-inventory',
        loadChildren: async () => {
          const { ItemInventoryReportModule } = await import('../report/item-inventory-report/item-inventory-report.module');
          return ItemInventoryReportModule;
        },
      } ,
      {
        path: 'account/trail-balance',
        loadChildren: async () => {
          const { TrailBalanceReportModule } = await import('../account/trail-balance/trail-balance-report.module');
          return TrailBalanceReportModule;
        },
      },
      {
        path: 'buyer-order',
        loadChildren: async () => {
          const { BuyerOrderModule } = await import('../Manufacturer/buyer-order/buyer-order.module');
          return BuyerOrderModule;
        },
      } ,
       {
        path: 'ims/report/cashbook',
        loadChildren: async () => {
          const { CashBookModule } = await import('../report/cashbook/cashbook.module');
          return CashBookModule;
        },
      } ,
      {
        path: 'ims/report/daybook',
        loadChildren: async () => {
          const { DayBookModule } = await import('../report/daybook/daybook.module');
          return DayBookModule;
        }
      } ,
      {
        path: 'report/item-group-stock',
        loadChildren: async () => {
          const { ItemGroupStockModule } = await import('../report/item-group-stock/item-group-stock.module');
          return ItemGroupStockModule;
        }
      }
      , {
        path: 'report/outstanding-payables',
       // loadChildren: '../report/outstanding-payables-report/outstanding-payables-report.module#OutStandingPayablesReportModule'
        loadChildren: async () => {
          const { OutStandingPayablesReportModule } = await import('../report/outstanding-payables-report/outstanding-payables-report.module');
          return OutStandingPayablesReportModule;
        }
      }
      , {
        path: 'report/outstanding-receiables',
        //loadChildren: '../report/outstanding-receiables-report/outstanding-receiables-report.module#OutStandingReceiablesReportModule'
        loadChildren: async () => {
          const { OutStandingReceiablesReportModule } = await import('../report/outstanding-receiables-report/outstanding-receiables-report.module');
          return OutStandingReceiablesReportModule;
        }
      }
      , {
        path: 'ims/report/cashbook-day',
      //  loadChildren: '../report/cashbook-dayBalance/cashbook-dayBalance.module#CashBookDayBalanceModule'
        loadChildren: async () => {
          const { CashBookDayBalanceModule } = await import('../report/cashbook-dayBalance/cashbook-dayBalance.module');
          return CashBookDayBalanceModule;
        }
      },
      {
        path: 'ims/report/bankbook',
        // loadChildren: '../report/bankbook/bankbook.module#BankBookModule'
        loadChildren: async () => {
          const { BankBookModule } = await import('../report/bankbook/bankbook.module');
          return BankBookModule;
        }
      } ,
      {
        path: 'ims/report/purchase-register',
      //  loadChildren: '../report/purchase-register/purchase-register.module#PurchaseRegisterModule'
        loadChildren: async () => {
          const { PurchaseRegisterModule } = await import('../report/purchase-register/purchase-register.module');
          return PurchaseRegisterModule;
        }
      } ,
      {
        path: 'ims/report/sale-register',
        // loadChildren: '../report/sale-register/sale-register.module#SaleRegisterModule'
        loadChildren: async () => {
          const { SaleRegisterModule } = await import('../report/sale-register/sale-register.module');
          return SaleRegisterModule;
        }
      } ,
      {
        path: 'ims/report/purchase-summary',
       // loadChildren: '../report/purchase-summary/purchase-summary.module#PurchaseSummaryReportModule'
        loadChildren: async () => {
          const { PurchaseSummaryReportModule } = await import('../report/purchase-summary/purchase-summary.module');
          return PurchaseSummaryReportModule;
        }
      } ,
      {
        path: 'ims/report/sale-summary',
        // loadChildren: '../report/sale-summary/sale-summary.module#SaleSummaryReportModule'
        loadChildren: async () => {
          const { SaleSummaryReportModule } = await import('../report/sale-summary/sale-summary.module');
          return SaleSummaryReportModule;
        }
      } ,
      {
        path: 'ims/report/journal-register',
        // loadChildren: '../report/journal-register/journal-register.module#JournalRegisterModule'
        loadChildren: async () => {
          const { JournalRegisterModule } = await import('../report/journal-register/journal-register.module');
          return JournalRegisterModule;
        }
      } ,
      {
        path: 'ims/service',
        // loadChildren: '../transactionMaster/service-item/service-item.module#ServiceItemMasterModule'
        loadChildren: async () => {
          const { ServiceItemMasterModule } = await import('../transactionMaster/service-item/service-item.module');
          return ServiceItemMasterModule;
        }
      } ,
      {
        path: 'ims/service-billing',
        loadChildren: async ()=>{
         const {serviceBillingModule} =await import ('../inventory/service-billing/serviceBilling.module');
         return serviceBillingModule;
        }
      },
      {
        path: 'ims/sale-return',
        // loadChildren: '../inventory/sale-direct/sales-return/saleReturn.module#SaleDirectReturnModule'
        loadChildren: async ()=>{
          const {SaleDirectReturnModule} =await import ('../inventory/sale-direct/sales-return/saleReturn.module');
          return SaleDirectReturnModule;
         }
      },
      {
        path: 'ims/purchase-return',
        // loadChildren: '../inventory/purchase/purchase-return/purchaseReturn.module#PurchaseReturnModule'
        loadChildren: async ()=>{
          const {PurchaseReturnModule} =await import ('../inventory/purchase/purchase-return/purchaseReturn.module');
          return PurchaseReturnModule;
         }
      },
      {
        path: 'report/gstr-anx-1-summary',
        // loadChildren: '../report/gstr-anx-1-list/gstr-anx-1-list.module#GstrAnx1ListModule'
        loadChildren: async ()=>{
          const {GstrAnx1ListModule} =await import ('../report/gstr-anx-1-list/gstr-anx-1-list.module');
          return GstrAnx1ListModule;
         }
      },
      {
        path: 'report/gstr-anx-1-b2c-details',
        // loadChildren: '../report/gstr-anx-1-b2c-details/gstr-anx-1-b2c-details.module#GstrAnx1B2cDetailsModule'
        loadChildren: async ()=>{
          const {GstrAnx1B2cDetailsModule} =await import ('../report/gstr-anx-1-b2c-details/gstr-anx-1-b2c-details.module');
          return GstrAnx1B2cDetailsModule;
         }
      },
      {
        path: 'report/gstr-anx-1-b2b-details',
        // loadChildren: '../report/gstr-anx-1-b2b-details/gstr-anx-1-b2b-details.module#GstrAnx1B2bDetailsModule'
        loadChildren: async ()=>{
          const {GstrAnx1B2bDetailsModule} =await import ('../report/gstr-anx-1-b2b-details/gstr-anx-1-b2b-details.module');
          return GstrAnx1B2bDetailsModule;
         }
      },
      {
        path: 'report/gstr-anx-2-summary',
        // loadChildren: '../report/gstr-anx-2-list/gstr-anx-2-list.module#GstrAnx2ListModule'
        loadChildren: async ()=>{
          const {GstrAnx2ListModule} =await import ('../report/gstr-anx-2-list/gstr-anx-2-list.module');
          return GstrAnx2ListModule;
         }
      },
      {
        path: 'report/gstr-anx-2-details',
        // loadChildren: '../report/gstr-anx-2-details/gstr-anx-2-details.module#GstrAnxTwoDetailsModule'
        loadChildren: async ()=>{
          const {GstrAnxTwoDetailsModule} =await import ('../report/gstr-anx-2-details/gstr-anx-2-details.module');
          return GstrAnxTwoDetailsModule;
         }
      },
      {
        path: 'ims/Terms&Condition',
        // loadChildren: '../transactionMaster/terms-and-condition/terms-and-condition.module#TermsAndConditionModule'
        loadChildren: async ()=>{
          const {TermsAndConditionModule} =await import ('../transactionMaster/terms-and-condition/terms-and-condition.module');
          return TermsAndConditionModule;
         }
      },
      {
        path: 'report/msmed-outstanding',
        // loadChildren: '../report/msmed-outstanding/msmed-outstanding.module#MsmedOutstandingModule'
        loadChildren: async ()=>{
          const {MsmedOutstandingModule} =await import ('../report/msmed-outstanding/msmed-outstanding.module');
          return MsmedOutstandingModule;
         }
      },
      {
        path: 'report/msmed-outstanding/:id/details',
        // loadChildren: '../report/msmed-outstanding-details/msmed-outstanding-details.module#MsmedOutstandingDetailsModule'
        loadChildren: async ()=>{
          const {MsmedOutstandingDetailsModule} =await import ('../report/msmed-outstanding-details/msmed-outstanding-details.module');
          return MsmedOutstandingDetailsModule;
         }
      },
      {
        path: 'report/msmed-outstanding/details',
        // loadChildren: '../report/msmed-outstanding-details/msmed-outstanding-details.module#MsmedOutstandingDetailsModule'
        loadChildren: async ()=>{
          const {MsmedOutstandingDetailsModule} =await import ('../report/msmed-outstanding-details/msmed-outstanding-details.module');
          return MsmedOutstandingDetailsModule;
         }
      },
      {
        path: 'report/dues-overdues-outstanding',
        // loadChildren: '../report/dues-overdues-outstanding/dues-overdues-outstanding.module#DuesOverduesOutstandingModule'
        loadChildren: async ()=>{
          const {DuesOverduesOutstandingModule} =await import ('../report/dues-overdues-outstanding/dues-overdues-outstanding.module');
          return DuesOverduesOutstandingModule;
         }
      },
      {
        path: 'change-password',
        // loadChildren: './change-password/change-password.module#ChangePasswordModule'
        loadChildren: async ()=>{
          const {ChangePasswordModule} =await import ('./change-password/change-password.module');
          return ChangePasswordModule;
         }
      },
      {
        path: 'ims/discount-master',
        // loadChildren: '../transactionMaster/discount-master/discount-master.module#DiscountMasterModule'
        loadChildren: async ()=>{
          const {DiscountMasterModule} =await import ('../transactionMaster/discount-master/discount-master.module');
          return DiscountMasterModule;
         }
      },
      {
        path: 'super-admin/client',
        // loadChildren: '../super-admin/client/client.module#ClientModule'
        loadChildren: async ()=>{
          const {ClientModule} = await import ('../super-admin/client/client.module');
          return ClientModule;
         }
      },
      {
        path: 'super-admin/menu',
        loadChildren: async ()=>{
          const {MenuModule} = await import ('../super-admin/menu/menu.module');
          return MenuModule;
         }
      },
      {
        path: 'ims',
        loadChildren: async ()=>{
          const {CustomRateModule} = await import ('../transactionMaster/customRate/custom-rate.module');
          return CustomRateModule;
         }
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StartRoutingModule { }
