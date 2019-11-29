import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItemRequirementRoutingModule } from './item-requirement-routing.module';
import { ItemRequirementComponent } from '../../Manufacturer/item-requirement/item-requirement/item-requirement.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ItemRequirementListComponent } from '../../Manufacturer/item-requirement/item-requirement-list/item-requirement-list.component';
import { ItemRequirementSearchComponent } from './item-requirement-search/item-requirement-search.component';

@NgModule({
  declarations: [ItemRequirementComponent, ItemRequirementListComponent, ItemRequirementSearchComponent],
  imports: [
    CommonModule,
    SharedModule,
    ItemRequirementRoutingModule
  ]
})
export class ItemRequirementModule { }
