import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SharedModule } from '../../shared.module'
import { ConfirmationPrintComponent } from './confirmation-print.component'
@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [
    ConfirmationPrintComponent
  ],
  exports: [ConfirmationPrintComponent],
  bootstrap: []
})
export class ConfirmationPrintModule {

}
