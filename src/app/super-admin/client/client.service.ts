import { Injectable, Inject } from "@angular/core";
import { BehaviorSubject, Observable, throwError, Subject } from 'rxjs';
import { AddCust, ResponseSale } from '../../model/sales-tracker.model';
import { BaseServices } from '../../commonServices/base-services';
import { ApiConstant } from '../../shared/constants/api';
import { filter, catchError, map } from 'rxjs/internal/operators';
import { UIConstant } from '../../shared/constants/ui-constant';
import { select2Return } from '../super-admin.model';

@Injectable({providedIn: 'root'})
export class ClientService {
  private openClientModalSub = new BehaviorSubject<AddCust>({open: false})
  public clientModalOpenStatus$ = this.openClientModalSub.asObservable()
  private select2Sub = new Subject<select2Return>()
  public select2$ = this.select2Sub.asObservable()
  private onClientAddSub = new Subject()
  public onClientAdd$ = this.onClientAddSub.asObservable()
  private queryStrSub = new Subject<string>()
  public queryStr$ = this.queryStrSub.asObservable()
  constructor(@Inject(BaseServices) private baseService) {}
  onOpenClientModal () {
    this.openClientModalSub.next({open: true})
  }

  onCloseClientModal () {
    this.openClientModalSub.next({open: false})
  }

  getModulesList (): Observable<any> {
    return this.manipulateResponse(this.baseService.getRequest(`${ApiConstant.SUPER_ADMIN_MODULES_LIST}`))
  }

  getIndustryList (): Observable<any> {
    return this.manipulateResponse(this.baseService.getRequest(`${ApiConstant.SUPER_ADMIN_INDUSTRY_LIST}`))
  }

  getSubMenuList (queryParams): Observable<any> {
    return this.manipulateResponse(this.baseService.getRequest(`${ApiConstant.GET_SUB_MENU_LIST}${queryParams}`))
  }

  postClient (data): Observable<any> {
    return this.manipulateResponse(this.baseService.postRequest(`${ApiConstant.POST_CLIENT_SUPER_ADMIN}`, data))
  }

  getClientList (queryParams): Observable<any> {
    return this.manipulateResponse(this.baseService.getRequest(`${ApiConstant.POST_CLIENT_SUPER_ADMIN}${queryParams}`))
  }

  manipulateResponse (obs: Observable<any>): Observable<any> {
    return obs.pipe(filter((data: ResponseSale) => {
      if (data.Code === UIConstant.THOUSAND) { return true } else { throw new Error(data.Description) }
    }), catchError(error => { return throwError(error) }), map((data: ResponseSale) => data.Data))
  }

  returnSelect2List (array: any, type: string) {
    let newData = [ {id: '0', text: `Select ${type}`} ]
    array.forEach((data) => {
      newData.push({
        id: data.Id,
        text: data.Name
      })
    })
    this.select2Sub.next({ 'data': newData , 'type': type})
  }

  onClientAdd () {
    this.onClientAddSub.next()
  }

  
  setSearchQueryParamsStr (str) {
    this.queryStrSub.next(str)
  }
}
