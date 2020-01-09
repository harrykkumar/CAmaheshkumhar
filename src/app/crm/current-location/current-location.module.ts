import { SharedModule } from 'src/app/shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CurrentLocationRoutingModule } from './current-location-routing.module';
import { CurrentLocationComponent } from './current-location.component';

@NgModule({
  declarations: [CurrentLocationComponent],
  imports: [
    CommonModule,
    CurrentLocationRoutingModule,
    SharedModule
  ]
})
export class CurrentLocationModule { }
