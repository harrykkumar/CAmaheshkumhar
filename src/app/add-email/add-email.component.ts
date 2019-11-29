import { CommonService } from 'src/app/commonServices/commanmaster/common.services';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-add-email',
  templateUrl: './add-email.component.html',
  styleUrls: ['./add-email.component.css']
})
export class AddEmailComponent implements OnInit {
  @Output() closeModal = new EventEmitter();
  editEmailId: number;
  emailTypeList: Array<any> = []
  emailTypeId: number;
  email: string;
  constructor(
    private _commonService: CommonService,
  ) {
    this.getEmailTypeList();
  }

  ngOnInit() {
  }
/* Function to get all the email type list */
  getEmailTypeList = () => {
    const data = [
      {
        id: 1,
        text: 'Personal'
      },
      {
        id: 2,
        text: 'Work'
      },
      {
        id: 3,
        text: 'Home'
      },
      {
        id: 4,
        text: 'Other'
      }
    ]
    this.emailTypeList = JSON.parse(JSON.stringify(data))
    this.emailTypeId = 1;
  }

  openModal(item) {
    this._commonService.openModal('add_new_email');
    if (!_.isEmpty(item)) {
      this.editEmailId = item.editEmailId
      this.emailTypeId = item.id
      this.email = item.email
    }
  }

  closePopUp(data?) {
    this._commonService.closeModal('add_new_email')
    this.closeModal.emit(data);
  }

  submit() {
    const emailTypeIndex = _.findIndex(this.emailTypeList, { id: this.emailTypeId })
    const data = {
      editEmailId: this.editEmailId ? this.editEmailId : 0,
      id: this.emailTypeId,
      email: this.email,
      emailTypeName: emailTypeIndex !== -1 ? this.emailTypeList[emailTypeIndex].text : ''
    }
    this.closePopUp(data);
  }
}
