import { NgModule } from "@angular/core";
import { ForgotCredentialsComponent } from './forgot-credentials.component';
import { Routes, RouterModule } from '@angular/router';
const routes: Routes = [
  { path: '', component: ForgotCredentialsComponent }
]
@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class ForgotCredentialsRoutingModule {

}