import { Injectable } from "@angular/core";
import { BaseServices } from '../../commonServices/base-services';
import { ApiConstant } from '../../shared/constants/api';
import { Observable, Subject } from 'rxjs';
import { ResponseSale } from '../../model/sales-tracker.model';
import { Select2OptionData } from 'ng2-select2';

@Injectable({
  providedIn: 'root'
})

export class VoucherEntryServie {
  customerDataSub = new Subject<{data: Array<Select2OptionData>}>()
  customerData$ = this.customerDataSub.asObservable()
  vendorDataSub = new Subject<{data: Array<Select2OptionData>}>()
  vendorData$ = this.vendorDataSub.asObservable()
  searchSub = new Subject<string>()
  search$ = this.searchSub.asObservable()
  private queryStrSub = new Subject<string>()
  public queryStr$ = this.queryStrSub.asObservable()
  constructor(private baseService: BaseServices) {}
  getLedgerSummaryData (queryStr): Observable<ResponseSale> {
    return this.baseService.getRequest(`${ApiConstant.LEDGER_SUMMARY}` + queryStr)
  }

  getOwnerOrgList (): Observable<ResponseSale> {
    return this.baseService.getRequest(`${ApiConstant.OWNER_ORGANISATION_LIST}`)
  }

  getTransactionNo (type, orgId, date, auto) {
    if (auto) {
      return this.baseService.getRequest(`${ApiConstant.TRANSACTIONNO_VOUCHER}?TransactionType=${type}&&OrgId=${orgId}&&TransDate=${date}`)
    } else {
      return this.baseService.getRequest(`${ApiConstant.GET_NEW_BILL_NO_MANUAL}?TransactionType=${type}&&OrgId=${orgId}&&BillDate=${date}`)
    }
  }

  createCustomers (array) {
    let newData = [{ id: '0', text: 'Select Party' }]
    array.forEach(data => {
      newData.push({
        id: data.Id,
        text: data.Name
      })
    })
    this.customerDataSub.next({ 'data': newData })
  }

  createVendors (array) {
    let newData = [{ id: '0', text: 'Select Vendor' }]
    array.forEach(data => {
      newData.push({
        id: data.Id,
        text: data.Name
      })
    })
    this.vendorDataSub.next({ 'data': newData })
  }

  getVoucherList (ReportFor, type, LedgerId, OrgId) {
    return this.baseService.getRequest(`${ApiConstant.GET_VOUCHER_LIST}?ReportFor=${ReportFor}&&Type=${type}&&LedgerId=${LedgerId}&&OrgId=${OrgId}`)
  }

  postVoucher (data) {
    return this.baseService.postRequest(`${ApiConstant.POST_VOUCHER}`, data)
  }

  getVoucherTypeList (): Observable<ResponseSale> {
    return this.baseService.getRequest(`${ApiConstant.GET_VOUCHER_TYPE}`)
  }

  setSearchQueryParamsStr (str) {
    this.queryStrSub.next(str)
  }
  onTextEntered (text: string) {
    this.searchSub.next(text)
  }
}
