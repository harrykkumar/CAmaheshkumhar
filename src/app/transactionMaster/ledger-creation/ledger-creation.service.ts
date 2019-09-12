import { Injectable } from "@angular/core";
import { AddCust } from '../../model/sales-tracker.model';
import { BehaviorSubject, Subject } from 'rxjs';
import { BaseServices } from '../../commonServices/base-services';
import { ApiConstant } from '../../shared/constants/api';

@Injectable({providedIn: 'root'})
export class LedgerCreationService {
  private openLedgerImportSub = new BehaviorSubject<AddCust>({'open': false})
  openLedgerImport$ = this.openLedgerImportSub.asObservable()
  private onSaveLedgerImportSub = new Subject()
  onSaveLedgerImport$ = this.onSaveLedgerImportSub.asObservable()
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
}