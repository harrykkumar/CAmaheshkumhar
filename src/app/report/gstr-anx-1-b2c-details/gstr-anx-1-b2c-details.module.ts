import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GstrAnx1B2cDetailsRoutingModule } from './gstr-anx-1-b2c-details-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { GstrAnx1B2cDetailsComponent } from './gstr-anx-1-b2c-details.component';

@NgModule({
  declarations: [GstrAnx1B2cDetailsComponent],
  imports: [
    CommonModule,
    GstrAnx1B2cDetailsRoutingModule,
    SharedModule
  ]
})
export class GstrAnx1B2cDetailsModule { }
