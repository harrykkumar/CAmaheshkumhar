import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Gstr3bRoutingModule } from './gstr-3b-routing.module';
import { Gstr3bComponent } from './gstr3b/gstr3b.component';

@NgModule({
  declarations: [Gstr3bComponent],
  imports: [
    CommonModule,
    Gstr3bRoutingModule,
    SharedModule
  ]
})
export class Gstr3bModule { }
