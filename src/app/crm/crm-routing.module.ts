import { DailyActivityReportComponent } from './daily-activity-report/daily-activity-report.component';
import { AddUserDealerLinkComponent } from './add-user-dealer-link/add-user-dealer-link.component';
import { AddCustomerAgentComponent } from './../super-admin/add-customer-agent/add-customer-agent.component';
import { CrmComponent } from './crm.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: CrmComponent,
    children: [
      {
        path: 'lead',
        loadChildren: './lead/lead.module#LeadModule'
      },
      {
        path: 'follow-up',
        loadChildren: './follow-up-list/follow-up-list.module#FollowUpListModule'
      },
      {
        path: 'dashboard',
        loadChildren: './crm-dashboard/crm-dashboard.module#CrmDashboardModule'
      },
      {
        path: 'customer',
        loadChildren: './crm-customer/crm-customer.module#CrmCustomerModule'
      },
      {
        path: 'order-request',
        loadChildren: './order-request/order-request.module#OrderRequestModule'
      },
      {
        path: 'order-request-details/:id/:parentTypeId',
        loadChildren: './order-request-details/order-request-details.module#OrderRequestDetailsModule'
      },
      {
        path: 'current-location',
        loadChildren: './current-location/current-location.module#CurrentLocationModule'
      },
      {
        path: 'dealer',
        loadChildren: './dealer/dealer.module#DealerModule'
      },
      {
        path: 'customer-visit',
        loadChildren: './customer-visit/customer-visit.module#CustomerVisitModule'
      },
      {
        path: 'user-dealer-link',
        component: AddUserDealerLinkComponent
      },
      {
        path: 'daily-activity',
        loadChildren: './daily-activity-report/daily-activity-report.module#DailyActivityReportModule'
      },
      {
        path: 'action',
        loadChildren: './action-report/action-report.module#ActionReportModule'
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CrmRoutingModule { }
