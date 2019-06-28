import { ValidateTokenService } from './commonServices/validate-token.service';
import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { AuthService } from './commonServices/auth.service'

const routes: Routes = [
  {
    path: '', 
    loadChildren: './start/start.module#StartModule',
    canActivate: [AuthService]
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
    canActivate: [AuthService]
  },
  {
    path: 'organizations',
    loadChildren: './start/user-organizations/user-organizations.module#UserOrganizationsModule',
    canActivate: [ValidateTokenService]
  },
  {
    path: 'no-organization',
    loadChildren: './start/no-organization/no-organization.module#NoOrganizationModule',
    canActivate: [ValidateTokenService]
  },
  {
    path: 'organization/settings',
    loadChildren: './settings/settings.module#SettingsModule',
    canActivate: [ValidateTokenService]
  },
  {
    path: 'organization/transaction-number',
    loadChildren: './shared/transaction-number/transaction-number.module#TransactionNumberModule',
    canActivate: [ValidateTokenService]
  },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
