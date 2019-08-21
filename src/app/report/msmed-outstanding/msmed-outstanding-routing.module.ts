import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MsmedOutstandingComponent } from './msmed-outstanding.component';

const routes: Routes = [
  {
    path: '', component: MsmedOutstandingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MsmedOutstandingRoutingModule { }
