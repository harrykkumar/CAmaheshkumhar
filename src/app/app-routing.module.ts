import { NoconnectionComponent } from './noconnection/noconnection.component';
import { BranchGuard } from './start/user-branches/branch.guard';
import { FinancialYearGuard } from './start/user-financial-years/financial-year.guard';
import { NgModule } from '@angular/core'
//import { commonjs } from '@angular/core'

import { RouterModule, Routes } from '@angular/router'
import { OrganizationGuard } from './start/user-organizations/organization.guard';
import { ModuleGuard } from './start/user-modules/module.guard';
import { NoConnectionRouteGaurd } from './noconnection/noconnection.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadChildren: './login/login.module#LoginModule'
  },
  {
    path: 'forgot-password',
    loadChildren: './forgot-password/forgot-password.module#ForGotPasswordModule'
   },
  {
    path: 'modules',
    loadChildren: '../app/start/user-modules/user-modules.module#UserModulesModule',
    canLoad: [ModuleGuard]
  },
  {
    path: 'organizations',
    loadChildren: './start/user-organizations/user-organizations.module#UserOrganizationsModule',
    canLoad: [OrganizationGuard]
  },
  {
    path: 'org-financial-years',
    loadChildren: './start/user-financial-years/user-financial-years.module#UserFinancialYearsModule',
    canLoad: [FinancialYearGuard]
  },
  {
    path: 'org-branches',
    loadChildren: './start/user-branches/user-branches.module#UserBranchesModule',
    canLoad: [BranchGuard]
  },
  {
    path: 'no-organization',
    loadChildren: './start/no-organization/no-organization.module#NoOrganizationModule',
    canActivate: [OrganizationGuard]
  },
  {
    path: 'organization/settings',
    loadChildren: './settings/settings.module#SettingsModule',
    canActivate: [OrganizationGuard]
  },
  {
    path: 'organization/transaction-number',
    loadChildren: './shared/transaction-number/transaction-number.module#TransactionNumberModule',
    canActivate: [OrganizationGuard]
  },
  {
    path: '404',
    loadChildren: './page-not-found/page-not-found.module#PageNotFoundModule'
  },
  {
    path: 'noconnection',
    component: NoconnectionComponent,
    canDeactivate: [NoConnectionRouteGaurd]
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes, {enableTracing: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
