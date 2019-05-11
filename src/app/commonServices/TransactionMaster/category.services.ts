import { Injectable } from '@angular/core'
import { Observable, BehaviorSubject } from 'rxjs'
import { BaseServices } from '../base-services'
import { ApiConstant } from '../../shared/constants/api'
@Injectable({
  providedIn: 'root'
})

export class CategoryServices {

  constructor (private _basesService: BaseServices) { }

  private sendArrayData = new BehaviorSubject<any>([])
  castArray = this.sendArrayData.asObservable()

  sendDataWithObservable (e) {
    this.sendArrayData.next(e)
  }
  private stringData = new BehaviorSubject<any>({})
  castString = this.stringData.asObservable()

  sendStringDataWithObservable (e) {
    this.stringData.next(e)
  }

  editDataSource: BehaviorSubject<Array<any>> = new BehaviorSubject([])
  editableData = this.editDataSource.asObservable()

  editUpdateData (data) {
    return this.editDataSource.next(data)
  }

  public GetCatagoryDetail (queryParams) {
    return this._basesService.getRequest(ApiConstant.CATEGORY_DETAIL_URL + queryParams)
  }

  public GetCatagory (id) {
    return this._basesService.getRequest(ApiConstant.GET_CATEGORY_BY_ID + id)
  }

  public saveAndUpdateCategory (parms: any): Observable<any> {
    return this._basesService.postRequest(ApiConstant.GET_SAVE_AND_UPDATE_CATEGORY_URL, parms)
  }

  public deleteCatagory (deletedId) {
    return this._basesService.deleteRequest(ApiConstant.DELETE_CATEGORY_URL + deletedId)
  }

  public getCategoryLevel () {
    return this._basesService.getRequest(ApiConstant.SETTING_SETUP)
  }
}
