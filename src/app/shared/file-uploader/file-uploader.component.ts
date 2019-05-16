import { Component, Output, EventEmitter, OnInit } from '@angular/core'
import { FileUploader } from 'ng2-file-upload'
import { DomSanitizer } from '@angular/platform-browser'
import { ToastrCustomService } from '../../commonServices/toastr.service'
@Component({
  selector: 'file-upload',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploaderComponent implements OnInit {
  images: any = []
  safeUrls: string[] = []
  baseImages: number[] = []
  queue: any = []
  id: number[] = []
  len: number = 0
  allowedMimeTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'image/jpe', 'image/bmp']
  @Output() uploadedImages = new EventEmitter<{'images': string[], 'queue': any[], 'safeUrls': string[], 'baseImages': number[], 'id': number[]}>()
  public uploader: FileUploader = new FileUploader({
    isHTML5: true,
    allowedMimeType: this.allowedMimeTypes,
    allowedFileType: ['image'],
    maxFileSize: 1 * 1024 * 1024
  })
  constructor (private domSanitizer: DomSanitizer, private toastrService: ToastrCustomService) { }

  onFileSelect (blob) {
    // console.log('blob : ',blob)
    // console.log('uploader.queue : ', this.uploader.queue)
    for (const key in blob) {
      // console.log('blob[key] : ', blob[key])
      if (blob[key] instanceof File) {
        console.log(blob[key] instanceof Blob)
        // console.log(blob[key].type)
        if (this.allowedMimeTypes.indexOf(blob[key].type) > -1) {
          this.len += 1
          this.blobToString(blob[key])
        } else {
          this.toastrService.showError('Only image file types are supportive', '')
        }
      }
    }
  }

  ngOnInit () {
    this.uploader = new FileUploader({
      isHTML5: true,
      allowedMimeType: this.allowedMimeTypes,
      allowedFileType: ['image'],
      maxFileSize: 1 * 1024 * 1024
    })
    this.images = []
    this.safeUrls = []
    this.queue = []
    this.baseImages = []
    this.len = 0
  }

  blobToString (blob) {
    let reader = new FileReader()
    reader.readAsDataURL(blob)
    let _self = this
    reader.onloadend = function () {
      let base64data = reader.result as string
      // console.log('unsafe : ', base64data)
      let base64Image = _self.domSanitizer.bypassSecurityTrustUrl(base64data)
      // console.log('safe : ', base64Image)
      _self.images.push(base64Image)
      _self.safeUrls.push(base64data)
      _self.baseImages.push(1)
      _self.queue.push(blob.name)
      _self.id.push(0)
      if (_self.len === _self.images.length) {
        // console.log(_self.images)
        // console.log(_self.safeUrls)
        // console.log(_self.queue)
        // console.log(_self.baseImages)
        let images = [..._self.images]
        let safeUrls = [..._self.safeUrls]
        let queue = [..._self.queue]
        let baseImages = [..._self.baseImages]
        let id = [..._self.id]
        _self.images = []
        _self.safeUrls = []
        _self.queue = []
        _self.baseImages = []
        _self.id = []
        _self.len = 0
        _self.uploadedImages.emit({ 'images': images, 'queue': queue, 'safeUrls': safeUrls, 'baseImages': baseImages, 'id': id })
      }
      // console.log('images array : ', _self.images)
    }
  }

  ngOnDestroy () {
    this.images = []
    this.safeUrls = []
    this.queue = []
    this.baseImages = []
    this.id = []
    this.len = 0
  }
}
