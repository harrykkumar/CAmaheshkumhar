import { CommonService } from 'src/app/commonServices/commanmaster/common.services';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent implements OnInit {
  @Output() closeModal = new EventEmitter();
  title: string;
  message: string;
  constructor(
    private commonService: CommonService
  ) { }

  ngOnInit() {
  }

  openModal(){
    this.commonService.openModal('confirm_dialog')
  }

  setResponse(res){
    this.commonService.closeModal('confirm_dialog')
    this.closeModal.emit(res)
  }
}
