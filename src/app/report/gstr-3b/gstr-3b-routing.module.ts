import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Gstr3bComponent } from './gstr3b/gstr3b.component';

const routes: Routes = [
  {
    path: '',
    component: Gstr3bComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Gstr3bRoutingModule { }
