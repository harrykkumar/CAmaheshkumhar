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
    // loadChildren: () => import('./login/login.module').then(m => m.LoginModule)
    // loadChildren: async () => {
    //   const { LoginModule } = await import('./login/login.module');
    //   return LoginModule;
    // }
  },
  {
    path: 'forgot-password',
    loadChildren: './forgot-password/forgot-password.module#ForGotPasswordModule'

    // loadChildren: () => import('./forgot-password/forgot-password.module').then(m => m.ForGotPasswordModule)

  },
  {
    path: 'modules',
    loadChildren: '../app/start/user-modules/user-modules.module#UserModulesModule',
    // loadChildren: () => import('../app/start/user-modules/user-modules.module').then(m => m.UserModulesModule),

    canLoad: [ModuleGuard]
  },
  {
    path: 'organizations',
    loadChildren: './start/user-organizations/user-organizations.module#UserOrganizationsModule',

    // loadChildren: () => import('./start/user-organizations/user-organizations.module').then(m => m.UserOrganizationsModule),

    canLoad: [OrganizationGuard]
  },
  {
    path: 'org-financial-years',
    loadChildren: './start/user-financial-years/user-financial-years.module#UserFinancialYearsModule',
    // loadChildren: async () => {
    //   const { UserFinancialYearsModule } = await import('./start/user-financial-years/user-financial-years.module');
    //   return UserFinancialYearsModule;
    // },
    // loadChildren: () => import('./start/user-financial-years/user-financial-years.module').then(m => m.UserFinancialYearsModule),

    canLoad: [FinancialYearGuard]
  },
  {
    path: 'org-branches',
    loadChildren: './start/user-branches/user-branches.module#UserBranchesModule',
    // loadChildren: () => import('./start/user-branches/user-branches.module').then(m => m.UserBranchesModule),


    canLoad: [BranchGuard]
  },
  {
    path: 'no-organization',
    loadChildren: './start/no-organization/no-organization.module#NoOrganizationModule',
    // loadChildren: () => import('./start/no-organization/no-organization.module').then(m => m.NoOrganizationModule),

    canActivate: [OrganizationGuard]
  },
  {
    path: 'organization/settings',
    loadChildren: './settings/settings.module#SettingsModule',

    // loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule),

    canActivate: [OrganizationGuard]
  },
  {
    path: 'organization/transaction-number',
    loadChildren: './shared/transaction-number/transaction-number.module#TransactionNumberModule',

    // loadChildren: () => import('./shared/transaction-number/transaction-number.module').then(m => m.TransactionNumberModule),

    canActivate: [OrganizationGuard]
  },
  {
    path: '404',
    loadChildren: './page-not-found/page-not-found.module#PageNotFoundModule'

    // loadChildren: () => import('./page-not-found/page-not-found.module').then(m => m.PageNotFoundModule),

  },
  {
    path: 'noconnection',
    component: NoconnectionComponent,
    canDeactivate: [NoConnectionRouteGaurd]
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
