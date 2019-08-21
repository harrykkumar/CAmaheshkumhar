import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GstrAnx1B2cDetailsComponent } from './gstr-anx-1-b2c-details.component';

const routes: Routes = [
  {
    path: '',
    component: GstrAnx1B2cDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GstrAnx1B2cDetailsRoutingModule { }
