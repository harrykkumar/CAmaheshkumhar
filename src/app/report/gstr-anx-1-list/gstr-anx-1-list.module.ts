import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GstrAnx1ListRoutingModule } from './gstr-anx-1-list-routing.module';
import { GstrAnx1ListComponent } from './gstr-anx-1-list.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [GstrAnx1ListComponent],
  imports: [
    CommonModule,
    GstrAnx1ListRoutingModule,
    SharedModule
  ]
})
export class GstrAnx1ListModule { }
