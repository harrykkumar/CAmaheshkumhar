import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserBranchesComponent } from './user-branches.component';
import { BranchGuard } from './branch.guard';

const routes: Routes = [
  {
    path: '',
    component: UserBranchesComponent,
    canActivate: [BranchGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserBranchesRoutingModule { }
