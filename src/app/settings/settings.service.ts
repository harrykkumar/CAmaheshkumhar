import { Injectable } from "@angular/core";
import { BaseServices } from '../commonServices/base-services';
import { Observable, Subject } from 'rxjs';
import { ResponseSale } from '../model/sales-tracker.model';
import { ApiConstant } from '../shared/constants/api';
import { GlobalService } from '../commonServices/global.service';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private saveSub = new Subject<any>()
  public saveSub$ = this.saveSub.asObservable()
  private searchSub = new Subject<any>()
  public search$ = this.searchSub.asObservable()
  constructor (private baseServices: BaseServices, private _gs: GlobalService) {}

  getFormFields(type?): Observable<ResponseSale> {
    if (type) {
      return this.baseServices.getRequest(`${ApiConstant.GET_DYNAMIC_SETUP_FIELDS}?Type=OrgSetup`)
    } else {
      return this.baseServices.getRequest(ApiConstant.GET_DYNAMIC_SETUP_FIELDS)
    }
  }

  postFormValues (obj): Observable<ResponseSale> {
    return this.baseServices.postRequest(ApiConstant.POST_DYNAMIC_SETUP_FIELDS, obj)
  }

  saveForm () {
    this.saveSub.next(true)
  }

  onSearch (search) {
    this.searchSub.next(search)
  }

  getSettingsById(id) {
    return this.baseServices.getRequest(ApiConstant.MENU_SETTING_RIGHTS_BY_ID + id)
  }
}
