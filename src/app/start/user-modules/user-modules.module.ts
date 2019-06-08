import { SharedModule } from 'src/app/shared/shared.module'
import { UserModulesRoutingModule } from './user-modules-routing.module'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { UserModulesComponent } from './user-modules.component'

@NgModule({
  declarations: [
    UserModulesComponent
  ],
  imports: [
    CommonModule,
    UserModulesRoutingModule,
    SharedModule
  ]
})
export class UserModulesModule { }
