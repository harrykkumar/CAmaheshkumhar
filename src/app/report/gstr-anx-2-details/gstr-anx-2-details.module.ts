import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GstrAnxTwoDetailsRoutingModule } from './gstr-anx-2-details-routing.module';
import { GstrAnxTwoDetailsComponent } from './gstr-anx-2-details.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [GstrAnxTwoDetailsComponent],
  imports: [
    CommonModule,
    GstrAnxTwoDetailsRoutingModule,
    SharedModule
  ]
})
export class GstrAnxTwoDetailsModule { }
