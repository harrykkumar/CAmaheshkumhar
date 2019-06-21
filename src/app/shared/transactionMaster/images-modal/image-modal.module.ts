import { NgModule } from '@angular/core'
import { ImageModalComponent } from './image-modal.component'
import { FileUploadCustomModule } from '../../file-uploader/file-upload.module'
import { CommonModule } from '@angular/common'
import { SharedModule } from '../../shared.module'

@NgModule({
  declarations: [
    ImageModalComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FileUploadCustomModule
  ],
  exports: [
    ImageModalComponent
  ]
})
export class ImageModalModule {

}
