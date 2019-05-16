import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { StartComponent } from './start/start.component'

const routes: Routes = [
  {
    path: '',
    component: StartComponent,
    children: [
      {
        path: '',
        redirectTo: 'admin'
      },
      {
        path: 'admin',
        loadChildren: '../admin/admin.module#AdminModule'
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
        path: 'ims/sale-direct',
        loadChildren: '../inventory/sale-direct/sales-direct/sales-direct.module#SalesDirectModule'
      },
      {
        path: 'ims/bank',
        loadChildren: '../transactionMaster/bank/bank.module#BankModule'
      },
      {
        path: 'ims/report',
        loadChildren: '../report/item-category-sale/item-sale-report.module#ItemSaleReportModule'
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StartRoutingModule { }
