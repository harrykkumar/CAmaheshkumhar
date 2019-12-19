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
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CrmRoutingModule { }
