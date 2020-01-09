import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DealerRoutingModule } from './dealer-routing.module';
import { DealerComponent } from './dealer.component';
import { AddDealerComponent } from '../add-dealer/add-dealer.component';

@NgModule({
  declarations: [DealerComponent, AddDealerComponent],
  imports: [
    CommonModule,
    DealerRoutingModule,
    SharedModule
  ],
  entryComponents: [AddDealerComponent]
})
export class DealerModule { }
