import { ToastrService } from 'ngx-toastr'
import { Injectable } from '@angular/core'
@Injectable({ providedIn: 'root' })
export class ToastrCustomService {
  constructor (private toastr: ToastrService) {}

  showSuccess (mess1, mess2) {
    this.toastr.success(mess1, mess2, {
      timeOut: 1000
    })
  }

  showError (mess1, mess2) {
    this.toastr.error(mess1, mess2, {
      timeOut: 5000 
    })
  }

  showErrorLong (mess1, mess2) {
    this.toastr.error(mess1, mess2, {
      timeOut: 6000 
    })
  }

  showWarningLong (mess1, mess2) {
    this.toastr.warning(mess1, mess2, {
      timeOut: 6000 
    })
  }

  showInfo (mess1, mess2) {
    this.toastr.info(mess1, mess2, {
      timeOut: 5000
    })
  }

  showWarning (mess1, mess2) {
    this.toastr.warning(mess1, mess2, {
      timeOut: 5000
    })
  }
}
