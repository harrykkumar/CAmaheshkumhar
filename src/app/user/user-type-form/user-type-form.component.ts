import { ToastrCustomService } from 'src/app/commonServices/toastr.service';
import { UIConstant } from 'src/app/shared/constants/ui-constant';
import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';
import * as _ from 'lodash'
import { UserFormService } from '../user-form/user-form.service';
import { takeUntil } from 'rxjs/operators';

declare var $: any

@Component({
  selector: 'app-user-type-form',
  templateUrl: './user-type-form.component.html',
  styleUrls: ['./user-type-form.component.css']
})
export class UserTypeFormComponent implements OnInit {
  userType: any = {}
  @Input() showUserTypeForm: any
  @Output() closeUserTypeForm = new EventEmitter<any>()
  private unSubscribe$ = new Subject<void>()
  constructor (
    private _userService: UserFormService,
    private toastrService: ToastrCustomService
  ) { }

  ngOnInit() {
  }

  /* Function invoke when profile menu clicked  */
  ngOnChanges(changes: SimpleChanges): void {
    if (this.showUserTypeForm.open === true) {
      $('#user_type_form').modal(UIConstant.MODEL_SHOW)
      this.initFormData()
      if (this.showUserTypeForm.mode === 'EDIT') {
        this.getFormData(this.showUserTypeForm.editId)
      }
    } else {
      $('#user_type_form').modal(UIConstant.MODEL_HIDE)
    }
  }
  
  closeForm = () => {
    this.closeUserTypeForm.emit(this.showUserTypeForm)
    this.resetFormData()
  }

  initFormData = () => {
    this.userType.index = this.showUserTypeForm.indexLength + 1
  }

  getFormData = (id) => {
    this._userService.getUserTypeData(id).pipe().subscribe((response) => {
      const data = response.Data[0]
      this.userType.id = data.Id
      this.userType.name = data.Name
      this.userType.index = data.IndexNo
    })
  }

  saveUserType = () => {
    const data = {
      Name : this.userType.name,
      ID : this.userType.id ? this.userType.id : 0,
      IndexNo : this.userType.index
    }
    this._userService.postUserTypeFormData(data).pipe(
      takeUntil(this.unSubscribe$)
    ).subscribe((response) => {
      if (response.Code === UIConstant.THOUSAND) {
        this.toastrService.showSuccess('Success', 'Saved Successfully')
        this.closeForm()
      }
    }, error => console.log(error))

  }

  resetFormData = () => {
    this.userType = {}
    this.unSubscribe$.next()
    this.unSubscribe$.complete()
  }
}
