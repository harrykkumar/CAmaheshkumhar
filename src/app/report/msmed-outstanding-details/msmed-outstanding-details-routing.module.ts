import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MsmedOutstandingDetailsComponent } from './msmed-outstanding-details.component';

const routes: Routes = [
  {
    path: '',
    component: MsmedOutstandingDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MsmedOutstandingDetailsRoutingModule { }
