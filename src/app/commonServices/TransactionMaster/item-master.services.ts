import { Injectable } from '@angular/core'
import { BaseServices } from '../base-services'
import { ApiConstant } from '../../shared/constants/api'
import { BehaviorSubject, Subject, Observable, throwError } from 'rxjs'
import { AddCust, Image, ResponseSale } from '../../model/sales-tracker.model';
import { debounceTime } from 'rxjs/operators/debounceTime'
import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged'
import { switchMap } from 'rxjs/operators/switchMap'
import { filter, map } from 'rxjs/operators';
import { catchError } from 'rxjs/internal/operators/catchError';
import { UIConstant } from '../../shared/constants/ui-constant';
@Injectable({
  providedIn: 'root' 
})
export class ItemmasterServices {
  private openImageModalSub = new BehaviorSubject<AddCust>({ 'open': false })
  private imageAddSub = new Subject<Image>()
  public imageAdd$ = this.imageAddSub.asObservable()
  private queryStrSub = new Subject<string>()
  public queryStr$ = this.queryStrSub.asObservable()
  constructor (private _basesService: BaseServices) { }

  public getItemMasterDetail (queryParams) {
    return this._basesService.getRequest(ApiConstant.ITEM_MASTER_DETAIL_URL + queryParams)
  }
  public getTaxDetail () {
    return this._basesService.getRequest(ApiConstant.GET_TAX_DETAIL_URL)
  }
  public getItemDetail () {
    return this._basesService.getRequest(ApiConstant.ITEM_DETAIL_URL)
  }
  public getPackingDetail () {
    return this._basesService.getRequest(ApiConstant.GET_PACKING_DETAIL)
  }
  public getUnitDetail () {
    return this._basesService.getRequest(ApiConstant.GET__SUB_UNIT_DETAIL)
  }

  public getBrandDetail () {
    return this._basesService.getRequest(ApiConstant.GET_BRAND_DETAIL)
  }

  public addNewItem (parmas: any) {
    return this._basesService.postRequest(ApiConstant.ITEM_MASTER_DETAIL_URL, parmas)
  }

  public addUnit (parmas) {
    return this._basesService.postRequest(ApiConstant.ADD_UNIT_URL, parmas)
  }

  deleteItem (id) {
    return this._basesService.deleteRequest(ApiConstant.ITEM_MASTER_DETAIL_URL + '?id=' + id)
  }

  editRoute (id) {
    return this._basesService.getRequest(ApiConstant.ITEM_MASTER_DETAIL_URL + '?id=' + id)
  }

  openImageModal (addedImages: Image) {
    this.openImageModalSub.next({ 'open': true, 'images': addedImages.images, 'queue': addedImages.queue, 'baseImages': addedImages.baseImages, 'id': addedImages.id, 'imageType': addedImages.imageType })
  }

  closeImageModal () {
    this.openImageModalSub.next({ 'open': false })
  }

  getImageModalStatus () {
    return this.openImageModalSub.asObservable()
  }

  imagesAdded (images) {
    this.imageAddSub.next(images)
  }

  getAllSubCategories (type) {
    return this._basesService.getRequest(ApiConstant.GET_ALL_SUB_CATEGORIES + type)
  }

  postItemImport (imports) {
    return this._basesService.postRequest(ApiConstant.IMPORT_ITEM_MASTER, imports)
  }

  getPendingList () {
    return this._basesService.getRequest(ApiConstant.IMPORT_ITEM_MASTER)
  }

  postPendingList (imports) {
    return this._basesService.postRequest(ApiConstant.UPDATE_PENDING_LIST, imports)
  }

  getBarCode (type) {
    return this._basesService.getRequest(ApiConstant.GET_BAR_CODE + type)
  }

  nameExistence (query) {
    return this._basesService.getRequest(ApiConstant.NAME_EXISTENCE + query)
  }

  search (barCode$: Observable<string>): Observable<any> {
    return barCode$.pipe(debounceTime(4000),
      distinctUntilChanged(),
      switchMap(term => this.searchEntries(term)))
  }

  searchEntries (barCode) {
    let queryUrl = 'ForVarifyBarcodeForItem&Barcode=' + barCode
    console.log('query url : ', queryUrl)
    return this.getBarCode(queryUrl)
  }

  searchName (name$: Observable<string>): Observable<any> {
    return name$.pipe(debounceTime(3),
      distinctUntilChanged(),
      switchMap(term => this.searchItemName(term)))

    // return name$.pipe(debounceTime(1000))
  }

  searchItemName (name) {
    let queryUrl = '?Value=' + name + '&Type=ItemName'
    console.log('query url : ', queryUrl)
    return this.nameExistence(queryUrl)
  }

  getEditData (id) {
    return this._basesService.getRequest(ApiConstant.EDIT_ITEM_MASTER + id)
  }

  setSearchQueryParamsStr (str) {
    this.queryStrSub.next(str)
  }

  getBarCodeSetting () {
    return this._basesService.getRequest(ApiConstant.GET_SETTING_BY_ID + 32)
  }

  getItemCodeSetting () {
    return this._basesService.getRequest(ApiConstant.GET_SETTING_BY_ID + 64)
  }

  postItemAttributeOpeningStockData (data) {
    // return this._basesService.postRequest(ApiConstant.)
  }

  getBarCodes (length: number): Observable<ResponseSale> {
    return this.manipulateResponse(this._basesService.getRequest(`${ApiConstant.GET_BORCODES_OPENING_STOCK}?StrSearchFor=ForBarcode&Length=${length}`))
  }

  manipulateResponse (obs: Observable<any>): Observable<any> {
    return obs.pipe(filter((data: ResponseSale) => {
      if (data.Code === UIConstant.THOUSAND) { return true } else { throw new Error(data.Description) }
    }), catchError(error => { return throwError(error) }), map((data: ResponseSale) => data.Data))
  }
}
