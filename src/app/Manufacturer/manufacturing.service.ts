import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { BehaviorSubject } from 'rxjs';
import { AddCust } from '../model/sales-tracker.model';
@Injectable({ providedIn: 'root' })
export class ManufacturingService {
  private styleAddSub = new Subject()
  styleAdd$ = this.styleAddSub.asObservable()
  private openStyleSub = new BehaviorSubject<AddCust>({'open': false})
  openStyle$ = this.openStyleSub.asObservable()
  onStyleAdd () {
    this.styleAddSub.next()
  }

  openStyle(editData, isAddNew) {
    this.openStyleSub.next({ 'open': true, 'editData': editData, 'isAddNew': isAddNew })
  }

  closeStyle(newStyle?) {
    if (newStyle) {
      this.openStyleSub.next({ 'open': false, 'name': newStyle.name, 'id': newStyle.id })
    } else {
      this.openStyleSub.next({ 'open': false })
    }
  }
}