import { NgModule } from '@angular/core'
import { FileDropDirective, FileSelectDirective } from 'ng2-file-upload'
import { FileUploaderComponent } from './file-uploader.component'
import { SharedModule } from '../shared.module'
import { CommonModule } from '@angular/common'
@NgModule({
  declarations: [
    FileDropDirective,
    FileSelectDirective,
    FileUploaderComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    FileUploaderComponent
  ]
})
export class FileUploadModule {

}
