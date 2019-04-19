import { Component, OnInit } from '@angular/core'
import { Observable, of, throwError } from 'rxjs'
import { OrganisationProfileService } from '../../header/organisation-profile/organisation-profile.service';
import { map, catchError } from 'rxjs/operators'

@Component({
  selector: 'app-org-branch-office-list',
  templateUrl: './org-branch-office-list.component.html',
  styleUrls: ['./org-branch-office-list.component.css']
})
export class OrgBranchOfficeListComponent implements OnInit {
  officeList: Observable<Array<any>> = of([])
  openModal: any = {}
  constructor(
    private _orgService: OrganisationProfileService
  ) { }

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

  searchOffice = () => {

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

  deleteOffice = (id) => {

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
