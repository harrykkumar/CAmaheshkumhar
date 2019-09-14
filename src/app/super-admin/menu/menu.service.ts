import { Injectable, Inject } from "@angular/core";
import { BehaviorSubject, Observable, throwError, Subject } from 'rxjs';
import { AddCust, ResponseSale } from '../../model/sales-tracker.model';
import { BaseServices } from '../../commonServices/base-services';
import { ApiConstant } from '../../shared/constants/api';
import { filter, catchError, map } from 'rxjs/internal/operators';
import { UIConstant } from '../../shared/constants/ui-constant';
import { select2Return } from '../super-admin.model';

@Injectable({providedIn: 'root'})
export class MenuService {
  private openModalSub = new BehaviorSubject<AddCust>({open: false})
  public modalOpenStatus$ = this.openModalSub.asObservable()
  private select2Sub = new Subject<select2Return>()
  public select2$ = this.select2Sub.asObservable()
  private onMenuAddSub = new Subject()
  public onMenuAdd$ = this.onMenuAddSub.asObservable()
  constructor(@Inject(BaseServices) private baseService) {}
  onOpenModal () {
    this.openModalSub.next({open: true})
  }

  onCloseModal () {
    this.openModalSub.next({open: false})
  }

  getModulesList (): Observable<any> {
    return this.manipulateResponse(this.baseService.getRequest(`${ApiConstant.SUPER_ADMIN_MODULES_LIST}`))
  }

  getIndustryList (): Observable<any> {
    return this.manipulateResponse(this.baseService.getRequest(`${ApiConstant.SUPER_ADMIN_INDUSTRY_LIST}`))
  }

  postMenu (data): Observable<any> {
    return this.manipulateResponse(this.baseService.postRequest(`${ApiConstant.MENU_SUPERADMIN}`, data))
  }

  postModule (data): Observable<any> {
    return this.manipulateResponse(this.baseService.postRequest(`${ApiConstant.POST_MODULE_SUPERADMIN}`, data))
  }

  getMenuList (queryParams): Observable<any> {
    return this.manipulateResponse(this.baseService.getRequest(`${ApiConstant.MENU_SUPERADMIN}${queryParams}`))
  }

  getModuleInIndustry (queryParams): Observable<any> {
    return this.manipulateResponse(this.baseService.getRequest(`${ApiConstant.POST_MODULE_SUPERADMIN}${queryParams}`))
  }

  getSubModuleList () {
    return this.manipulateResponse(this.baseService.getRequest(`${ApiConstant.GET_SUBMODULES_LIST}`))
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

  onMenuAdd () {
    this.onMenuAddSub.next()
  }
}
