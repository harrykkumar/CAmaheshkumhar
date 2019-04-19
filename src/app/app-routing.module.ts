import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { AuthService } from './commonServices/auth.service'

const routes: Routes = [
  { path: '', loadChildren: './start/start.module#StartModule', canActivate: [AuthService] },
  { path: 'login', loadChildren: './login/login.module#LoginModule' },
  { path: 'forgot-password', loadChildren: './forgot-password/forgot-password.module#ForGotPasswordModule' }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
