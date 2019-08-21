import { LoginService } from './../../../commonServices/login/login.services';
import { Component, OnInit } from '@angular/core'
import { Observable, of, throwError } from 'rxjs'
import { CompanyProfileService } from '../../company-profile/company-profile.service'
import { map, catchError } from 'rxjs/operators'

@Component({
  selector: 'app-org-branch-office-list',
  templateUrl: './org-branch-office-list.component.html',
  styleUrls: ['./org-branch-office-list.component.css']
})
export class OrgBranchOfficeListComponent implements OnInit {
  menuData: any;
  searchString:any
  searchOffice:any
  officeList: Observable<Array<any>> = of([])
  openModal: any = {}
  constructor (
    private _orgService: CompanyProfileService,
    private _loginService: LoginService
  ) {
    this.menuData = this._loginService.getMenuPermission('Configuration', 'Offices');
   }

  ngOnInit () {
    this.getOfficeListData()
  }

  getOfficeListData = () => {
    this.officeList = this._orgService.getOfficeList().pipe(
      map(Data => Data.Data),
      catchError(this.handleError)
    )
  }

  handleError = (error) => {
    console.error(error)
    return throwError(error.message)
  }

  addNewOffice = () => {
    this.openModal = {
      open: true,
      type: 'OFFICE',
      mode: 'CREATE'
    }
  }

  editOffice = (item) => {
    this.openModal = {
      open: true,
      type: 'OFFICE',
      mode: 'EDIT',
      editId: item.Id
    }
  }

  /* Function invoke on click of save and close of branch modal */
  closeModal = (event) => {
    this.openModal = {
      open: false,
      type: event.type,
      mode: event.mode
    }
  }

}
