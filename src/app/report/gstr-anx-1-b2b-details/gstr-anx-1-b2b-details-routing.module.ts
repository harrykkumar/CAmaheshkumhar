import { GstrAnx1B2bDetailsComponent } from './gstr-anx-1-b2b-details.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [{
  path: '', component: GstrAnx1B2bDetailsComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GstrAnx1B2bDetailsRoutingModule { }
