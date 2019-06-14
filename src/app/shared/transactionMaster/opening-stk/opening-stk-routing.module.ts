import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OpeningStkComponent } from './opening-stk.component';

const routes: Routes = [{
  path: '', component: OpeningStkComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OpeningStkRoutingModule { }
