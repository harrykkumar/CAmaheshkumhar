import { LoginService } from './../../commonServices/login/login.services';
import { UserFormService } from './../user-form/user-form.service'
import { Component, OnInit } from '@angular/core'
import { Observable, of, throwError } from 'rxjs'
import { map, catchError, tap } from 'rxjs/operators'
import * as _ from 'lodash'

@Component({
  selector: 'app-user-type-list',
  templateUrl: './user-type-list.component.html',
  styleUrls: ['./user-type-list.component.css']
})
export class UserTypeListComponent implements OnInit {
  searchString: string;
  showUserType: any = {}
  indexLength: number
  userTypeList: Observable<Array<any>> = of([])
  menuData: any;
  constructor(
    private _userService: UserFormService,
    private _loginService: LoginService
  ) {
    this.menuData = this._loginService.getMenuDetails(45, 28);
  }

  ngOnInit() {
    this.getUserTypeListData()
  }

  searchUserType() {
  }
  deleteUserType(id) {
    if (id > 0) {
      // no any delete api provided
    }
  }
  getUserTypeListData = () => {
    this.userTypeList = this._userService.getUserTypeList().pipe(
      map((Data) => {
        return Data.Data
      }),
      tap((data) => this.indexLength = data.length),
      catchError(this.handleError)
    )
  }

  handleError = (error) => {
    console.error(error)
    return throwError(error.message)
  }

  addNewUserType = () => {
    this.showUserType = {
      open: true,
      mode: 'CREATE',
      indexLength: this.indexLength
    }
  }

  editUserType = (item) => {
    this.showUserType = {
      open: true,
      mode: 'EDIT',
      editId: item.Id,
      indexLength: this.indexLength
    }
  }

  closeUserTypeForm = (event) => {
    this.showUserType = {
      open: false,
      mode: event.mode
    }
    this.getUserTypeListData()
  }
}
