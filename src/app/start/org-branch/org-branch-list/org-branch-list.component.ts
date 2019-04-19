import { Component, OnInit } from '@angular/core'
import { Observable, of, throwError } from 'rxjs';
import { OrganisationProfileService } from '../../header/organisation-profile/organisation-profile.service';
import { UIConstant } from 'src/app/shared/constants/ui-constant';
import { map } from 'rxjs/internal/operators/map';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-org-branch-list',
  templateUrl: './org-branch-list.component.html',
  styleUrls: ['./org-branch-list.component.css']
})
export class OrgBranchListComponent implements OnInit {
  branchList: Observable<Array<any>> = of([])
  openModal: any = {}
  constructor (
    private _orgService: OrganisationProfileService
  ) { }

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
  searchBranch = () => {

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

  deleteBranch = (id) => {

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
