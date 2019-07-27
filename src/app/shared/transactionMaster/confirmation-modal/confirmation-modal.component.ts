import { Component,ViewChild , OnDestroy } from '@angular/core'
import { Subscription } from 'rxjs'
import { UIConstant } from '../../constants/ui-constant'
import { CommonService } from 'src/app/commonServices/commanmaster/common.services'
declare const $: any
@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html'
})
export class ConfirmationModalComponent implements OnDestroy {
  confirmSUB: Subscription
  title: string = ''
  openpopupFlag:any
  constructor (private commonService: CommonService) {
    this.confirmSUB = this.commonService.getConfirmationStatus().subscribe(
      (obj) => {
        if (obj.open) {
          this.openpopupFlag = obj.name
          this.openModal()
        } else {
          this.closeModal()
        }
      }
    )
  }
 // this.ledgerName.nativeElement.focus()

@ViewChild('yes_focus') yesButtonFocus
  openModal () {
    $('#confirmation_popup1').modal(UIConstant.MODEL_SHOW)
    setTimeout(function(){ 
      $("#yesFocus").focus();
    }, 150);
  }

  closeModal () {
    $('#confirmation_popup1').modal(UIConstant.MODEL_HIDE)
  }

  Response (confarmationMsg) {
    let obj;
    if (confarmationMsg === UIConstant.CONFARMATION_POPUP) {
       obj = { type:confarmationMsg}
      this.commonService.closeConfirmation(obj)
    } else {
       obj = { type:confarmationMsg}
      this.commonService.closeConfirmation(obj)
    }
  }
  openVendor (){
 this.commonService.openVend('', false)
 this.closeModal()

  }
  openCustomer (){
    this.commonService.openCust('', false)
    this.closeModal()

  }
  openLedger () {
      this.commonService.openledgerCretion('',0) 
       this.closeModal()
  }
   ngOnDestroy () {
    this.confirmSUB.unsubscribe()
  }
}
