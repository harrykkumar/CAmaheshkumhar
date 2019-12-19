import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';
import { ManualStockComponent } from './manual-stock.component'

const childRoute: Routes = [
  { path: '', component: ManualStockComponent }
]
@NgModule({
  imports: [
    RouterModule.forChild(childRoute)
  ],
  exports: [RouterModule]
})
export class ManualStockRoutingModule {

}