import { LoginService } from './../../../commonServices/login/login.services';
import { OrganisationProfileService } from './../../header/organisation-profile/organisation-profile.service';
import { Component, OnInit } from '@angular/core';
import { map, catchError } from 'rxjs/internal/operators';
import { throwError, Observable, of } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-company-profile-list',
  templateUrl: './company-profile-list.component.html',
  styleUrls: ['./company-profile-list.component.css']
})
export class CompanyProfileListComponent implements OnInit {
  companyDataList: Observable<Array<any>> = of([]);
  modalData: any = {}
  searchString: any
  searchBranch: any
  constructor (
    private _orgService: OrganisationProfileService,
    private _loginService: LoginService,
    private router: Router
  ) { 
  }

  ngOnInit () {
    this.getCompanyListData()
  }

  getCompanyListData = () => {
    this.companyDataList = this._orgService.getCompanyProfile().pipe(
      map(Data => Data.Data),
      catchError(this.handleError)
    )
  }

  handleError = (error) => {
    console.error(error)
    return throwError(error.message)
  }

  addNewCompany = () => {
    this.modalData = {
      open: true
    }
  }

  editCompany = (item) => {
    this.modalData = {
      open: true,
      editId: item.Id
    }
  }

  /* Function invoke on click of save and close of branch modal */
  closeModal = (data) => {
    this.modalData = {
      open: false
    }
    if(data){
      this.getCompanyListData();
    }
  }
}

