import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { ActiveInventoryItemRoutingModule } from './active-inventory-item.routing.module';
import { ActiveInventoryItemComponent } from './active-inventory-item.component';

@NgModule({
  declarations: [ActiveInventoryItemComponent],
  imports: [
    ActiveInventoryItemRoutingModule,
    CommonModule,
    SharedModule
  ]
})
export class ActiveInventoryItemModule { }
