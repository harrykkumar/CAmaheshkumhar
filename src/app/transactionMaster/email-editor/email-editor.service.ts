import { Injectable } from "@angular/core";
import { BehaviorSubject } from 'rxjs';
import { AddCust } from '../../model/sales-tracker.model';
import { BaseServices } from '../../commonServices/base-services';
import { GlobalService } from '../../commonServices/global.service';
import { ApiConstant } from '../../shared/constants/api';
import { Subject } from 'rxjs/internal/Subject';

@Injectable({
  providedIn: 'root'
})
export class EmailEditorService {

  private open = new BehaviorSubject<AddCust>({ 'open': false })
  open$ = this.open.asObservable()
  private onAdd = new Subject()
  onAdd$ = this.onAdd.asObservable()
  constructor(private _bs: BaseServices, private _gs: GlobalService) {}
  openEditor(editId, data?) {
    this.open.next({ 'open': true, 'editId': editId, 'data': data })
  }

  closeEditor() {
    this.open.next({ 'open': false })
  }

  onAddDesign() {
    this.onAdd.next()
  }

  getTemplate(id) {
    return this._gs.manipulateResponse(this._bs.getRequest(ApiConstant.EMAIL_EDITOR + '?Id=' + id))
  }

  getAllTemplates(query) {
    return this._gs.manipulateResponse(this._bs.getRequest(ApiConstant.EMAIL_EDITOR + query))
  }

  postTemplate(obj) {
    return this._gs.manipulateResponse(this._bs.postRequest(ApiConstant.EMAIL_EDITOR, obj))
  }

  getContentCategories() {
    return this._gs.manipulateResponse(this._bs.getRequest(ApiConstant.COUNTRY_LIST_URL + 200))
  }
}