import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserBranchesRoutingModule } from './user-branches-routing.module';
import { UserBranchesComponent } from './user-branches.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [UserBranchesComponent],
  imports: [
    CommonModule,
    UserBranchesRoutingModule,
    SharedModule
  ]
})
export class UserBranchesModule { }
