import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientComponent } from './client.component';
import { ClientAddComponent } from './client-add/client-add.component';
import { ClientRoutingModule } from './client.routing.module';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClientSearchComponent } from './client-search/client-search.component';

@NgModule({
  declarations: [
    ClientComponent,
    ClientAddComponent,
    ClientSearchComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ClientRoutingModule,
    SharedModule
  ]
})
export class ClientModule { }