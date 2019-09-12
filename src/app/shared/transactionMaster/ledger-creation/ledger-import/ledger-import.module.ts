import { NgModule } from '@angular/core';
import { LedgerImportComponent } from './ledger-import.component';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared.module';
@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    LedgerImportComponent
  ],
  declarations: [
    LedgerImportComponent
  ]
})
export class LedgerImportModule {

}