import { FormsModule } from '@angular/forms'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { OrgBranchRoutingModule } from './org-branch-list-routing.module'
import { OrgBranchListComponent } from './org-branch-list.component'
import { SharedModule } from 'src/app/shared/shared.module'

@NgModule({
  declarations: [OrgBranchListComponent],
  imports: [
    CommonModule,
    OrgBranchRoutingModule,
    FormsModule,
    SharedModule
  ]
})
export class OrgBranchModule { }
