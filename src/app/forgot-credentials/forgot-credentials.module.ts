import { NgModule } from "@angular/core";
import { ForgotCredentialsComponent } from './forgot-credentials.component';
import { CommonModule } from '@angular/common';
import { ForgotCredentialsRoutingModule } from './forgot-credentials.routing.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ForgotCredentialsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ForgotCredentialsRoutingModule
  ]
})
export class ForgotCredentialsModule {

}