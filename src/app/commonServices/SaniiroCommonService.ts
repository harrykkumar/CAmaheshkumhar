import { Injectable } from '@angular/core'
import { Subject, Observable } from 'rxjs'
import { BaseServices } from './base-services'
@Injectable({
  providedIn: 'root'
})
export class SaniiroCommonService {
  constructor (private baseService: BaseServices) {}
  private _listners = new Subject<any>()
  listen (): Observable<any> {
    return this._listners.asObservable()
  }
  filter () {
    this._listners.next()
  }
  categoryChange () {
    this._listners.next()
  }
  getCategoryChange () {
    return this._listners.asObservable()
  }
}
