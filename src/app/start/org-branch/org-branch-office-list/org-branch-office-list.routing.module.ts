import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { OrgBranchOfficeListComponent } from './org-branch-office-list.component';

const routes: Routes = [
  { path: '', component: OrgBranchOfficeListComponent }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrgBranchOfficeRoutingModule { }
