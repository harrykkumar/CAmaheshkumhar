import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { SalesReturnListComponent } from './sales-return-list/sales-return-list.component'

const routes: Routes = [
  { path: '', component: SalesReturnListComponent }
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class SalesReturnRoutingModule {}
