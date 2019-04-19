import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { OrgBranchOfficeListComponent } from './org-branch-office-list.component'
import { OrgBranchOfficeRoutingModule } from './org-branch-office-list.routing.module'
import { SharedModule } from 'src/app/shared/shared.module'

@NgModule({
  declarations: [OrgBranchOfficeListComponent],
  imports: [
    CommonModule,
    OrgBranchOfficeRoutingModule,
    SharedModule
  ]
})
export class OrgBranchOfficeModule { }
