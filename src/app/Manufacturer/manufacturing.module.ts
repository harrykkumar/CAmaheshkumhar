import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { ManufacturingRoutingModule } from './manufacturing.routing.module';
import { ManufacturingComponent } from './manufacturing.component';

@NgModule({
  declarations: [
    ManufacturingComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ManufacturingRoutingModule
  ],
  providers: [
  ]
})
export class ManufacturingModule {

}