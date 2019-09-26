import { Injectable } from "@angular/core";
import { AddCust } from '../../model/sales-tracker.model';
import { BehaviorSubject, Subject } from 'rxjs';
import { BaseServices } from '../../commonServices/base-services';
import { ApiConstant } from '../../shared/constants/api';
import { select2Return } from '../../super-admin/super-admin.model';
import { UIConstant } from "src/app/shared/constants/ui-constant";

@Injectable({providedIn: 'root'})
export class LedgerCreationService {
  private openLedgerImportSub = new BehaviorSubject<AddCust>({'open': false})
  openLedgerImport$ = this.openLedgerImportSub.asObservable()
  private onSaveLedgerImportSub = new Subject()
  onSaveLedgerImport$ = this.onSaveLedgerImportSub.asObservable()
  private select2Sub = new Subject<select2Return>()
  public select2$ = this.select2Sub.asObservable()
  constructor(private baseService: BaseServices) {}
  openLedgerImport() {
    this.openLedgerImportSub.next({'open': true})
  }

  onSaveLedgerImport() {
    this.onSaveLedgerImportSub.next()
  }

  closeLedgerImport() {
    this.openLedgerImportSub.next({'open': false})
  }

  postLedgerImport(data) {
    return this.baseService.postRequest(ApiConstant.POST_LEDGER_IMPORT, data)
  }

  getLedgerImport() {
    return this.baseService.getRequest(ApiConstant.POST_LEDGER_IMPORT)
  }

  getItcTypeList () {
    return this.baseService.getRequest(ApiConstant.COUNTRY_LIST_URL + '175')
  }

  getRcmTypeList () {
    return this.baseService.getRequest(ApiConstant.COUNTRY_LIST_URL + '176')
  }

  deleteList (StrId) {
    return this.baseService.deleteRequest(`${ApiConstant.POST_LEDGER_IMPORT}?StrId=${StrId}`)
  }

  returnSelect2List (array: any, type: string, isAddNew?: boolean) {
    let newData = [ {id: '0', text: `Select ${type}`} ]
    if (isAddNew) {
      newData.push({id: '-1', text: UIConstant.ADD_NEW_OPTION})
    }
    array.forEach((data) => {
      newData.push({
        id: data.Id,
        text: data.Name
      })
    })
    this.select2Sub.next({ 'data': newData , 'type': type})
  }
}