import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GstrAnx2ListRoutingModule } from './gstr-anx-2-list-routing.module';
import { GstrAnx2ListComponent } from './gstr-anx-2-list.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [GstrAnx2ListComponent],
  imports: [
    CommonModule,
    GstrAnx2ListRoutingModule,
    SharedModule
  ]
})
export class GstrAnx2ListModule { }
