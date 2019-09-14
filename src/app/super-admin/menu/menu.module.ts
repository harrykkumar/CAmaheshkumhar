import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuRoutingModule } from './menu.routing.module';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MenuComponent } from './menu.component';
import { MenuAddComponent } from './menu-add/menu-add.component';

@NgModule({
  declarations: [
    MenuComponent,
    MenuAddComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MenuRoutingModule,
    SharedModule
  ]
})
export class MenuModule { }