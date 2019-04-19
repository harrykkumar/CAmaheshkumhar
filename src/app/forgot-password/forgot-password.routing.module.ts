import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { ForGotPasswordComponent } from './forgot-password.component'

const routes: Routes = [
  { path: '', component: ForGotPasswordComponent }
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ForGotPasswordRoutingModule {}
