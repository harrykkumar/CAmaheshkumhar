import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ItemRequirementListComponent } from './item-requirement-list/item-requirement-list.component';

const routes: Routes = [{
  path: '', component: ItemRequirementListComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItemRequirementRoutingModule { }
