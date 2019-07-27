import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PurchaseRegisterRoutingModule} from './purchase-register.routing.module'
import { PurchaseRegisterComponent } from './purchase-register.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [PurchaseRegisterComponent],
  imports: [
    PurchaseRegisterRoutingModule,
    CommonModule,
    SharedModule
  ]
})
export class PurchaseRegisterModule { }
