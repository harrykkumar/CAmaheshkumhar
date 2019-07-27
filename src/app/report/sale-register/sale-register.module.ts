import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SaleRegisterRoutingModule} from './sale-register.routing.module'
import { SaleRegisterComponent } from './sale-register.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [SaleRegisterComponent],
  imports: [
    SaleRegisterRoutingModule,
    CommonModule,
    SharedModule
  ]
})
export class SaleRegisterModule { }
