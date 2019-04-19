import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SharedModule } from '../../shared.module'
import { DeleteModalComponent } from './delete-modal.component'
@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [
    DeleteModalComponent
  ],
  exports: [DeleteModalComponent],
  bootstrap: []
})
export class DeleteModule {

}
