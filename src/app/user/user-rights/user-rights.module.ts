import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { UserRightsRoutingModule } from './user-rights-routing.module'
import { UserRightsComponent } from './user-rights.component'

@NgModule({
  declarations: [UserRightsComponent],
  imports: [
    CommonModule,
    UserRightsRoutingModule,
    SharedModule
  ]
})
export class UserRightsModule { }
