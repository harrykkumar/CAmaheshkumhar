import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { ForGotPasswordComponent } from './forgot-password.component'
import { ForGotPasswordRoutingModule } from './forgot-password.routing.module'

@NgModule({
  declarations: [
    ForGotPasswordComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ForGotPasswordRoutingModule
  ]
})
export class ForGotPasswordModule { }
