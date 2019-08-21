import { LoginService } from './../../../commonServices/login/login.services';
import { Component, OnInit } from '@angular/core'
import { Observable, of, throwError } from 'rxjs'
import { CompanyProfileService } from '../../company-profile/company-profile.service'
import { map } from 'rxjs/internal/operators/map'
import { catchError } from 'rxjs/operators'

@Component({
  selector: 'app-org-branch-list',
  templateUrl: './org-branch-list.component.html',
  styleUrls: ['./org-branch-list.component.css']
})
export class OrgBranchListComponent implements OnInit {
  menuData: any;
  searchString: any
  searchBranch: any
  branchList: Observable<Array<any>> = of([])
  openModal: any = {}
  constructor (
    private _orgService: CompanyProfileService,
    private _loginService: LoginService
  ) { 
    this.menuData = this._loginService.getMenuPermission('Configuration', 'Branches');
  }

  ngOnInit () {
    this.getBranchListData()
  }

  getBranchListData = () => {
    this.branchList = this._orgService.getBranchList().pipe(
      map(Data => Data.Data),
      catchError(this.handleError)
    )
  }

  handleError = (error) => {
    console.error(error)
    return throwError(error.message)
  }

  addNewBranch = () => {
    this.openModal = {
      open: true,
      type: 'BRANCH',
      mode: 'CREATE'
    }
  }

  addNewOffice = () => {
    this.openModal = {
      open: true,
      type: 'OFFICE',
      mode: 'CREATE'
    }
  }

  editBranch = (item) => {
    this.openModal = {
      open: true,
      type: 'BRANCH',
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
