import { NgModule } from "@angular/core";
import { ForgotCredentialsComponent } from './forgot-credentials.component';
import { CommonModule } from '@angular/common';
import { ForgotCredentialsRoutingModule } from './forgot-credentials.routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ForgotCredentialsComponent
  ],
  imports: [
    CommonModule,
    ForgotCredentialsRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ForgotCredentialsModule {

}