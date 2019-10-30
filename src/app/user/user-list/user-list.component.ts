import { LoginService } from './../../commonServices/login/login.services';
import { Component, OnInit } from '@angular/core'
import { Observable, of, throwError } from 'rxjs'
import { catchError } from 'rxjs/internal/operators/catchError'
import { map } from 'rxjs/operators'
import * as _ from 'lodash'
import { ResponseSale } from '../../model/sales-tracker.model'
import { UserFormService } from '../user-form/user-form.service'

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  showUser: any = {}
  userList: Observable<Array<any>> = of([])
  menuData: any;
  searchString: string;

  constructor (
    private _userService: UserFormService,
    private _loginService: LoginService
  ) {
    this.menuData = this._loginService.getMenuDetails(44, 28);
   }

  ngOnInit () {
    this.getUserListData()
  }

  getUserListData = () => {
    this.userList = this._userService.getUserListData().pipe(
      map((Data: ResponseSale) => {
        return _.map(Data.Data.LoginUserDetails, (element) => {
          const contactObject = _.find(Data.Data.ContactInfos, (contactList) => {
            if (contactList.ParentId === element.Id) {
              return true
            }
          })
          const emailObject = _.find(Data.Data.Emails, (emailList) => {
            if (emailList.ParentId === element.Id) {
              return true
            }
          })
          element.contactNo = contactObject ? contactObject.ContactNo : ''
          element.countryCode = contactObject ? contactObject.CountryCode : ''
          element.email = emailObject ? emailObject.EmailAddress : ''
          return element
        })
      }),
      catchError(this.handleError)
    )
  }

  handleError = (error) => {
    console.error(error)
    return throwError(error.message)
  }

  // tslint:disable-next-line:no-empty
  searchUser = () => {

  }

  addNewUser = () => {
    this.showUser = {
      open: true,
      mode: 'CREATE'
    }
  }

  editUser = (item) => {
    this.showUser = {
      open: true,
      mode: 'EDIT',
      editId: item.Id
    }
  }

  // tslint:disable-next-line:no-empty
  deleteUser = (id) => {

  }

  closeUserForm = (event) => {
    if (event.addNew === true) {
      this.showUser = {
        open: true,
        mode: 'CREATE',
        addNew : false
      }
    } else {
      this.showUser = {
        open: false,
        mode: event.mode
      }
      this.getUserListData()
    }
  }
}
