import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { AdminComponent } from './admin/admin.component'
import { AdminRoutingModule } from './admin-routing.module'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { SharedModule } from '../shared/shared.module'

@NgModule({
  declarations: [AdminComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AdminRoutingModule,
    SharedModule
  ]
})
export class AdminModule { }
