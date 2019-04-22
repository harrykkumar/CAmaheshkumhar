import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { UserListRoutingModule } from './user-list-routing.module'
import { UserListComponent } from './user-list.component'
import { FormsModule } from '@angular/forms'
import { SharedModule } from 'src/app/shared/shared.module'

@NgModule({
  declarations: [UserListComponent],
  imports: [
    CommonModule,
    UserListRoutingModule,
    FormsModule,
    SharedModule
  ]
})
export class UserListModule { }
