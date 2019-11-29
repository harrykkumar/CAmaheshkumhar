import { SharedModule } from 'src/app/shared/shared.module';
import { GodownComponent } from './godown.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GodownRoutingModule } from './godown-routing.module';
import { AddGodownComponent } from '../add-godown/add-godown.component';

@NgModule({
  declarations: [ GodownComponent, AddGodownComponent],
  imports: [
    CommonModule,
    GodownRoutingModule,
    SharedModule
  ],
  entryComponents: [AddGodownComponent]
})
export class GodownModule { }
