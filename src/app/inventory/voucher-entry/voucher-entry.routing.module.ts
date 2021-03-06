import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';
import { VoucherEntryMainComponent } from './voucher-entry-main/voucher-entry-main.component';

const childRoute: Routes = [
  { path: '', component: VoucherEntryMainComponent, data: { title: 'Voucher' } },
  { path: ':type/:id', component: VoucherEntryMainComponent, data: { title: 'Voucher' } }
]
@NgModule({
  imports: [
    RouterModule.forChild(childRoute)
  ],
  exports: [RouterModule]
})
export class VoucherEntryRoutingModule {

}
