import { Injectable } from '@angular/core'
import { BaseServices } from '../../commonServices/base-services'
import { ApiConstant } from '../../shared/constants/api'
@Injectable({
  providedIn: 'root'
})
export class ProfitReportService {
  constructor (private baseService: BaseServices) {}

  getProfitReportData () {
    return this.baseService.getRequest(ApiConstant.GET_PROFIT_REPORT_DATA)
  }
}
