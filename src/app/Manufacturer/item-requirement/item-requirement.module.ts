import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItemRequirementRoutingModule } from './item-requirement-routing.module';
import { ItemRequirementComponent } from '../../Manufacturer/item-requirement/item-requirement/item-requirement.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ItemRequirementListComponent } from '../../Manufacturer/item-requirement/item-requirement-list/item-requirement-list.component';

@NgModule({
  declarations: [ItemRequirementComponent, ItemRequirementListComponent],
  imports: [
    CommonModule,
    ItemRequirementRoutingModule,
    SharedModule
  ]
})
export class ItemRequirementModule { }
