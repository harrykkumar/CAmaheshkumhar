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
        loadChildren: '../sales-challan/sales-challan/sales-challan.module#SalesChallanModule'
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
      }
      //  {
      //   path: 'ims/sale-billing/billing',
      //   loadChildren: '../sales-challan/sales-billing/sales-challan-bill.module#SalesChallanBillingModule'
      // }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StartRoutingModule { }
