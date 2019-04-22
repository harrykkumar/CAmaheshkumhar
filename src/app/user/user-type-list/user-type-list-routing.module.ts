import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserTypeListComponent } from './user-type-list.component'

const routes: Routes = [
  { path: '', component: UserTypeListComponent }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserTypeListRoutingModule { }
