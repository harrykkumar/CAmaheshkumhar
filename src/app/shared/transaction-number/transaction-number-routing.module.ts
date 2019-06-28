import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TransactionNumberComponent } from './transaction-number.component';

const routes: Routes = [{
  path: '', component: TransactionNumberComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransactionNumberRoutingModule { }
