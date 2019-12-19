import { NgModule } from '@angular/core'
import { FileUploadModule } from 'ng2-file-upload';
import { FileUploaderComponent } from './file-uploader.component'
import { CommonModule } from '@angular/common'
@NgModule({
  declarations: [
    FileUploaderComponent
  ],
  imports: [
    CommonModule,
    FileUploadModule
  ],
  exports: [
    FileUploaderComponent
  ]
})
export class FileUploadCustomModule {

}


