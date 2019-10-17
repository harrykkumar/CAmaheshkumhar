import { Injectable } from "@angular/core";
import { BaseServices } from '../commonServices/base-services';
import { Observable, Subject } from 'rxjs';
import { ResponseSale } from '../model/sales-tracker.model';
import { ApiConstant } from '../shared/constants/api';

@Injectable({
  providedIn: 'root'
})
export class AdditionalSettingsService {
  private saveSub = new Subject<any>()
  public saveSub$ = this.saveSub.asObservable()
  private searchSub = new Subject<any>()
  public search$ = this.searchSub.asObservable()
  constructor (private baseServices: BaseServices) {}

  getFormFields (query): Observable<ResponseSale> {
    return this.baseServices.getRequest(ApiConstant.ADDITIONAL_SETTINGS + query)
  }

  postFormValues (obj): Observable<ResponseSale> {
    return this.baseServices.postRequest(ApiConstant.ADDITIONAL_SETTINGS, obj)
  }

  saveForm () {
    this.saveSub.next(true)
  }

  onSearch (search) {
    this.searchSub.next(search)
  }
}