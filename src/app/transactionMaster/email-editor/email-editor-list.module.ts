import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailEditorListComponent } from './email-editor-list.component';
import { EmailEditorRoutingModule } from './email-editor.routing.module';
import { SharedModule } from '../../shared/shared.module';
@NgModule({
  declarations: [
    EmailEditorListComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    EmailEditorRoutingModule
  ]
})
export class EmailEditorListModule { }
