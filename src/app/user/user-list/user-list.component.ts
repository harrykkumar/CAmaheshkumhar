import { Router } from '@angular/router';
import { ConfirmDialogComponent } from './../../shared/components/confirm-dialog/confirm-dialog.component';
import { UserFormComponent } from './../user-form/user-form.component';
import { CommonService } from 'src/app/commonServices/commanmaster/common.services';
import { LoginService } from './../../commonServices/login/login.services';
import { Component, OnInit, ViewContainerRef, ViewChild, ComponentFactoryResolver } from '@angular/core'
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
  @ViewChild('confirmDialogRef') confirmDialogRef : ConfirmDialogComponent;
  @ViewChild('addUserContainerRef', { read: ViewContainerRef }) addUserContainerRef: ViewContainerRef;
  addUserRef: any
  constructor(
    private _userService: UserFormService,
    private _loginService: LoginService,
    private resolver: ComponentFactoryResolver,
    private commonService: CommonService,
    private router: Router
  ) {
    this.menuData = this._loginService.getMenuDetails(44, 28);
  }

  ngOnInit() {
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

  addNewUser = (item?) => {
    this.commonService.loadModalDynamically(this, 'addUserContainerRef', 'addUserRef', UserFormComponent,
      (res) => {
        if (this.commonService.isEmpty(item) && res) {
          this.confirmDialogRef.title = 'Set User Permission'
          this.confirmDialogRef.message = 'Want to Set Created User Permission ?'
          this.confirmDialogRef.openModal()
          this.confirmDialogRef.closeModal.subscribe((data) => {
            if (data) {
              this.router.navigate(['user-rights'])
            } else {
              this.getUserListData()
            }
          })
        } else {
          this.getUserListData()
        }
      }, item);
  }
}
