import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailEditorModule } from 'angular-email-editor';
import { EmailEditorCustomComponent } from './email-editor.component';
import { FormsModule } from '@angular/forms';
import { Select2Module } from 'ng2-select2';
@NgModule({
  declarations: [
    EmailEditorCustomComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    Select2Module,
    EmailEditorModule
  ],
  exports: [
    EmailEditorCustomComponent
  ]
})
export class EmailEditorCustomModule { }
