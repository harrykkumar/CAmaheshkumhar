import { Component, OnInit } from '@angular/core'
import { Observable, of, throwError } from 'rxjs'
import { catchError } from 'rxjs/internal/operators/catchError'
import { map } from 'rxjs/operators'
import { UserFormService } from '../user-form/user-form.service'
import * as _ from 'lodash'

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  showUser: any = {}
  userList: Observable<Array<any>> = of([])

  constructor (
    private _userService: UserFormService
  ) { }

  ngOnInit () {
    this.getUserListData()
  }

  getUserListData = () => {
    this.userList = this._userService.getUserListData().pipe(
      map((Data) => {
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
