import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GstrAnxTwoDetailsComponent } from './gstr-anx-2-details.component';

const routes: Routes = [
  {
    path: '',
    component: GstrAnxTwoDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GstrAnxTwoDetailsRoutingModule { }
