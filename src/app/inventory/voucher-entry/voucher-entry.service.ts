import { Injectable } from "@angular/core";
import { BaseServices } from '../../commonServices/base-services';
import { ApiConstant } from '../../shared/constants/api';
import { Observable, Subject } from 'rxjs';
import { ResponseSale } from '../../model/sales-tracker.model';
import { Select2OptionData } from 'ng2-select2';
import { UIConstant } from '../../shared/constants/ui-constant';
@Injectable({
  providedIn: 'root'
})
export class VoucherEntryServie {
  customerDataSub = new Subject<{data: Array<Select2OptionData>}>()
  customerData$ = this.customerDataSub.asObservable()
  vendorDataSub = new Subject<{data: Array<Select2OptionData>}>()
  vendorData$ = this.vendorDataSub.asObservable()
  ledgerDataSub = new Subject<{data: Array<Select2OptionData>}>()
  ledgerData$ = this.ledgerDataSub.asObservable()
  searchSub = new Subject<string>()
  search$ = this.searchSub.asObservable()
  private queryStrSub = new Subject<string>()
  public queryStr$ = this.queryStrSub.asObservable()
  tabs = [
    {type: 'payment', voucherNoManual: false, ReportFor: 'purchase', voucherType: 103},
    {type: 'receipt', voucherNoManual: false, ReportFor: 'sale', voucherType: 102},
    {type: 'contra', voucherNoManual:  false, voucherType: 112},
    {type: 'journal', voucherNoManual: false, voucherType: 104}
  ]
  constructor(private baseService: BaseServices) {
  }
  getLedgerSummaryData (queryStr): Observable<ResponseSale> {
    return this.baseService.getRequest(`${ApiConstant.LEDGER_SUMMARY}` + queryStr)
  }

  getOwnerOrgList (): Observable<ResponseSale> {
    return this.baseService.getRequest(`${ApiConstant.OWNER_ORGANISATION_LIST}`)
  }

  getTransactionNo (type, orgId, date, auto): Observable<ResponseSale> {
    if (auto) {
      return this.baseService.getRequest(`${ApiConstant.TRANSACTIONNO_VOUCHER}?TransactionType=${type}&&OrgId=${orgId}&&TransDate=${date}`)
    } else {
      return this.baseService.getRequest(`${ApiConstant.GET_NEW_BILL_NO_MANUAL}?TransactionType=${type}&&OrgId=${orgId}&&BillDate=${date}`)
    }
  }

  createCustomers (array, type) {
    let newData = []
    if (type === UIConstant.CONTRA_TYPE) {
      newData.push({ id: '0', text: 'Select Ledger' },{id:'-1',text:UIConstant.ADD_NEW_OPTION})
    } else if (UIConstant.RECEIPT_TYPE) {
      newData.push({ id: '0', text: 'Select Party ' },{id:'-1',text:UIConstant.ADD_NEW_OPTION})
    }
    array.forEach(data => {
      newData.push({
        id: data.Id,
        text: data.Name
      })
    })
    this.customerDataSub.next({ 'data': newData })
  }

  createVendors (array, type) {
    let newData = []
    if (type === UIConstant.CONTRA_TYPE) {
      newData.push({ id: '0', text: 'Select Ledger  ' },{id:'-1',text:UIConstant.ADD_NEW_OPTION})
    } else if (UIConstant.PAYMENT_TYPE) {
      newData.push({ id: '0', text: 'Select Vendor / Customer'},{id:'-1',text:UIConstant.ADD_NEW_OPTION})
    }
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

  postVoucherContraJournal (data) {
    return this.baseService.postRequest(ApiConstant.POST_VOUCHER_CONTRA_JOURNAL, data)
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

  allLedgerList (data) {
    this.ledgerDataSub.next({data: data})
  }

  printReceiptPayment (obj): Observable<ResponseSale> {
    return this.baseService.getRequest(`${ApiConstant.PAYMENT_RECEIPT_PRINT}?id=${obj.id}`)
  }
}
