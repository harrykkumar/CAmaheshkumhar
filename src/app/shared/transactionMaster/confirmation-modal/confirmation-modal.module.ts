import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SharedModule } from '../../shared.module'
import { ConfirmationModalComponent } from './confirmation-modal.component'
@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [
    ConfirmationModalComponent
  ],
  exports: [ConfirmationModalComponent],
  bootstrap: []
})
export class ConfirmationModule {

}
