import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PackagingMainComponent } from './packaging-main/packaging-main.component';
import { SharedModule } from '../../shared/shared.module';
import { PackagingRoutingModule } from './packaging.routing.module';
import { PackagingChallanComponent } from './challan/challan.component';

@NgModule({
  declarations: [
    PackagingMainComponent,
    PackagingChallanComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    PackagingRoutingModule
  ]
})
export class PackagingModule { }
