import { Injectable } from "@angular/core";
import { BaseServices } from '../commonServices/base-services';
import { Observable, Subject } from 'rxjs';
import { ResponseSale } from '../model/sales-tracker.model';
import { ApiConstant } from '../shared/constants/api';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private saveSub = new Subject<any>()
  public saveSub$ = this.saveSub.asObservable()
  constructor (private baseServices: BaseServices) {}

  getFormFields (): Observable<ResponseSale> {
    return this.baseServices.getRequest(ApiConstant.GET_DYNAMIC_SETUP_FIELDS)
  }

  postFormValues (obj): Observable<ResponseSale> {
    return this.baseServices.postRequest(ApiConstant.POST_DYNAMIC_SETUP_FIELDS, obj)
  }

  saveForm () {
    this.saveSub.next(true)
  }
}