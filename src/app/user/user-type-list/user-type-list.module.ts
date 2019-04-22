import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { UserTypeListRoutingModule } from './user-type-list-routing.module'
import { UserTypeListComponent } from './user-type-list.component'
import { SharedModule } from 'src/app/shared/shared.module'
import { FormsModule } from '@angular/forms'

@NgModule({
  declarations: [UserTypeListComponent],
  imports: [
    CommonModule,
    UserTypeListRoutingModule,
    FormsModule,
    SharedModule
  ]
})
export class UserTypeListModule { }
