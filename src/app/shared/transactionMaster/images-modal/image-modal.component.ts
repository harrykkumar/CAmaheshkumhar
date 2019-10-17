import { Component, OnDestroy } from '@angular/core'
import { Subscription } from 'rxjs'
import { UIConstant } from '../../constants/ui-constant'
import { ItemmasterServices } from '../../../commonServices/TransactionMaster/item-master.services'
import { Image } from '../../../model/sales-tracker.model'

declare const $: any
@Component({
  selector: 'app-image-modal',
  templateUrl: './image-modal.component.html',
  styleUrls: ['./image-modal.component.css']
})
export class ImageModalComponent implements OnDestroy {
  private modalOpen: Subscription
  images: Image
  imageAddedBefore: boolean = false
  imageType: any;
  constructor (private itemMaster: ItemmasterServices) {
    this.images = { 'images': [], 'queue': [], 'safeUrls': [], 'baseImages': [], 'id': [] }
    this.modalOpen = this.itemMaster.getImageModalStatus().subscribe(
      data => {
        if (data.open) {
          this.imageType = data.imageType
          this.openModal()
          if (data.images && data.images.length > 0) {
            this.imageAddedBefore = true
            this.images = { 'images': [...data.images], 'queue': [...data.queue], 'safeUrls': [...data.images], 'baseImages': [...data.baseImages], 'id': [...data.id] }
          } else {
            this.images = { 'images': [], 'queue': [], 'safeUrls': [], 'baseImages': [], 'id': [] }
            this.imageAddedBefore = false
          }
          console.log('images from item master : ', this.images)
        } else {
          this.closeModal()
        }
      }
    )
  }

  onUploadImages (evt) {
    console.log('from files : ', evt)
    console.log('this.images : ', this.images)
    if (this.imageAddedBefore) {
      this.images.safeUrls = this.images.safeUrls.concat(evt.safeUrls)
      this.images.baseImages = this.images.baseImages.concat(evt.baseImages)
      this.images.images = this.images.images.concat(evt.images)
      this.images.queue = this.images.queue.concat(evt.queue)
      this.images.id = this.images.id.concat(evt.id)
    } else {
      this.images.safeUrls = evt.safeUrls
      this.images.baseImages = evt.baseImages
      this.images.images = evt.images
      this.images.queue = evt.queue
      this.images.id = evt.id
      this.imageAddedBefore = true
    }
    console.log('images : ', this.images)
  }

  removeImage (i) {
    this.images.images.splice(i, 1)
    this.images.queue.splice(i, 1)
    this.images.safeUrls.splice(i, 1)
    this.images.baseImages.splice(i, 1)
    this.images.id.splice(i, 1)
    console.log('images leftover : ', this.images)
  }

  openModal () {
    this.reset()
    $('#item_image').removeClass('fadeOut')
    $('#item_image').addClass('fadeInDown')
    $('#item_image').modal({ backdrop: 'static', keyboard: true })
  }

  closeModal () {
    if ($('#item_image').length > 0) {
      this.reset()
      $('#item_image').removeClass('fadeInDown')
      $('#item_image').modal(UIConstant.MODEL_HIDE)
      $('#item_image').addClass('fadeOut')
    }
  }

  ngOnDestroy () {
    this.modalOpen.unsubscribe()
  }

  closeImageModal () {
    this.itemMaster.closeImageModal()
  }

  reset () {
    this.images.images = []
    this.images.queue = []
    this.images.safeUrls = []
    this.images.baseImages = []
    this.images.id = []
    this.imageAddedBefore = false
  }

  addToQueue () {
    this.itemMaster.imagesAdded({ ...this.images })
    this.itemMaster.closeImageModal()
  }

}
