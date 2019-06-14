import { Injectable } from "@angular/core";
import { BaseServices } from '../../commonServices/base-services';
import { ApiConstant } from '../../shared/constants/api';
import { Observable } from 'rxjs';
import { ResponseSale } from '../../model/sales-tracker.model';

@Injectable({
  providedIn: 'root'
})

export class VoucherEntryServie {
  
  constructor(private baseService: BaseServices) {}
  getLedgerSummaryData (queryStr): Observable<ResponseSale> {
    return this.baseService.getRequest(`${ApiConstant.LEDGER_SUMMARY}` + queryStr)
  }

  getOwnerOrgList (): Observable<ResponseSale> {
    return this.baseService.getRequest(`${ApiConstant.OWNER_ORGANISATION_LIST}`)
  }
}
