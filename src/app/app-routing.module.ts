import { BranchGuard } from './start/user-branches/branch.guard';
import { FinancialYearGuard } from './start/user-financial-years/financial-year.guard';
import { NgModule } from '@angular/core'
//import { commonjs } from '@angular/core'

import { RouterModule, Routes } from '@angular/router'
import { OrganizationGuard } from './start/user-organizations/organization.guard';
import { ModuleGuard } from './start/user-modules/module.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    //loadChildren: './login/login.module#LoginModule'
    loadChildren: async () => {
      const { LoginModule } = await import('./login/login.module');
      return LoginModule;
    }
  },
  {
    path: 'forgot-password',
    // loadChildren: './forgot-password/forgot-password.module#ForGotPasswordModule'
    loadChildren: async () => {
      const { ForGotPasswordModule } = await import('./forgot-password/forgot-password.module');
      return ForGotPasswordModule;
    },
  },
  {
    path: 'modules',
   // loadChildren: '../app/start/user-modules/user-modules.module#UserModulesModule',
    loadChildren: async () => {
      const { UserModulesModule } = await import('../app/start/user-modules/user-modules.module');
      return UserModulesModule;
    },
    canLoad: [ModuleGuard]
  },
  {
    path: 'organizations',
    // loadChildren: './start/user-organizations/user-organizations.module#UserOrganizationsModule',
    loadChildren: async () => {
      const { UserOrganizationsModule } = await import('./start/user-organizations/user-organizations.module');
      return UserOrganizationsModule;
    },
    canLoad: [OrganizationGuard]
  },
  {
    path: 'org-financial-years',
    //loadChildren: './start/user-financial-years/user-financial-years.module#UserFinancialYearsModule',
    loadChildren: async () => {
      const { UserFinancialYearsModule } = await import('./start/user-financial-years/user-financial-years.module');
      return UserFinancialYearsModule;
    },
    canLoad: [FinancialYearGuard]
  },
  {
    path: 'org-branches',
    //loadChildren: './start/user-branches/user-branches.module#UserBranchesModule',
    loadChildren: async () => {
      const { UserBranchesModule } = await import('./start/user-branches/user-branches.module');
      return UserBranchesModule;
    },
    canLoad: [BranchGuard]
  },
  {
    path: 'no-organization',
    // loadChildren: './start/no-organization/no-organization.module#NoOrganizationModule',
    loadChildren: async () => {
      const { NoOrganizationModule } = await import('./start/no-organization/no-organization.module');
      return NoOrganizationModule;
    },
    canActivate: [OrganizationGuard]
  },
  {
    path: 'organization/settings',
    //loadChildren: './settings/settings.module#SettingsModule',
    loadChildren: async () => {
      const { SettingsModule } = await import('./settings/settings.module');
      return SettingsModule;
    },
    canActivate: [OrganizationGuard]
  },
  {
    path: 'organization/transaction-number',
    //loadChildren: './shared/transaction-number/transaction-number.module#TransactionNumberModule',
    loadChildren: async () => {
      const { TransactionNumberModule } = await import('./shared/transaction-number/transaction-number.module');
      return TransactionNumberModule;
    },
    canActivate: [OrganizationGuard]
  },
  {
    path: '404',
    // loadChildren: './page-not-found/page-not-found.module#PageNotFoundModule'
    loadChildren: async () => {
      const { PageNotFoundModule } = await import('./page-not-found/page-not-found.module');
      return PageNotFoundModule;
    },
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
