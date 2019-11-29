import { Injectable } from "@angular/core";
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VendorRatesService {
  constructor() {}
  private queryStrSub = new Subject<string>()
  public queryStr$ = this.queryStrSub.asObservable()
  setSearchQueryParamsStr (str) {
    this.queryStrSub.next(str)
  }

  private searchSub = new Subject<string>()
  public search$ = this.searchSub.asObservable()
  onTextEntered (str) {
    this.searchSub.next(str)
  }
}