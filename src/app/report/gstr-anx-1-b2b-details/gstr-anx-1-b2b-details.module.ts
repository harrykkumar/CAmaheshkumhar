import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GstrAnx1B2bDetailsRoutingModule } from './gstr-anx-1-b2b-details-routing.module';
import { GstrAnx1B2bDetailsComponent } from './gstr-anx-1-b2b-details.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [GstrAnx1B2bDetailsComponent],
  imports: [
    CommonModule,
    GstrAnx1B2bDetailsRoutingModule,
    SharedModule
  ]
})
export class GstrAnx1B2bDetailsModule { }
