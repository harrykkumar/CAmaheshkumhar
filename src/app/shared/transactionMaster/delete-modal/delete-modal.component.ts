import { Component, OnDestroy } from '@angular/core'
import { Subscription } from 'rxjs'
import { UIConstant } from '../../constants/ui-constant'
import { CommonService } from 'src/app/commonServices/commanmaster/common.services'
declare const $: any
@Component({
  selector: 'app-delete-modal',
  templateUrl: './delete-modal.component.html'
})
export class DeleteModalComponent implements OnDestroy {
  modalSub: Subscription
  title: string = ''
  constructor (private commonService: CommonService) {
    this.modalSub = this.commonService.getDeleteStatus().subscribe(
      (obj) => {
        if (obj.open) {
          this.title = obj.title
          this.openModal()
        } else {
          this.closeModal()
        }
      }
    )
  }

  openModal () {
    $('#delete_popup').modal(UIConstant.MODEL_SHOW)
  }

  closeModal () {
    $('#delete_popup').modal(UIConstant.MODEL_HIDE)
  }

  deleteResponse (confarmationMsg) {
    console.log(confarmationMsg)
    if (confarmationMsg === UIConstant.DELTE_CONFARMATION_YES) {
      let obj = { id: this.commonService.deleteId, type: this.commonService.type }
      this.commonService.closeDelete(obj)
    } else {
      this.commonService.closeDelete('')
      // $('#delete_popup').modal(UIConstant.MODEL_HIDE)
    }
  }

  ngOnDestroy () {
    this.modalSub.unsubscribe()
  }
}
