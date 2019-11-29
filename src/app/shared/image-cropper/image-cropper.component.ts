import { CommonService } from 'src/app/commonServices/commanmaster/common.services';
import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';
@Component({
  selector: 'app-image-cropper',
  templateUrl: './image-cropper.component.html',
  styleUrls: ['./image-cropper.component.css']
})
export class CropImageComponent implements OnInit {
  @Output() closeModal = new EventEmitter();
  imageChangedEvent: any = '';
  croppedImage: any = '';
  showCropper = false;
  @ViewChild(ImageCropperComponent) imageCropper: ImageCropperComponent;

  constructor(
    private commonService: CommonService
  ) { }

  ngOnInit() {
  }

  closePopUp(data?) {
    this.commonService.closeModal('crop_image')
    this.closeModal.emit(data)
  }

  fileChangeEvent(event: any): void {
    this.commonService.openModal('crop_image')
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    console.log(event);
  }
  imageLoaded() {
    this.showCropper = true;
    console.log('Image loaded')
  }
  cropperReady() {
    console.log('Cropper ready')
  }
  loadImageFailed() {
    console.log('Load failed');
  }
  rotateLeft() {
    this.imageCropper.rotateLeft();
  }
  rotateRight() {
    this.imageCropper.rotateRight();
  }
  flipHorizontal() {
    this.imageCropper.flipHorizontal();
  }
  flipVertical() {
    this.imageCropper.flipVertical();
  }

}
