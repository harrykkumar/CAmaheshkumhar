
import { Injectable } from '@angular/core'
import { Headers, Http, Response } from '@angular/http'
// import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs'
import { map, share } from 'rxjs/operators'
import { TokenService } from './token.service'
import { Router } from '@angular/router'
import { ResponseSale } from '../model/sales-tracker.model'

@Injectable({
  providedIn: 'root'
})

export class BaseServices {

  constructor (private http: Http, private tokenService: TokenService, private router: Router) { }

  private setHeaders (): Headers {
    const headersConfig = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }

    if (this.tokenService.getToken()) {
      headersConfig['X-San-Jwt'] = `${this.tokenService.getToken()}`
    }
    return new Headers(headersConfig)
  }

  // private formatErrors(error: any) {
  //     return Observable.throw(error.json)
  //     // throwErro(error.json());
  // }

  public getRequest (path: string): Observable<ResponseSale> {
    return this.http.get(path, { headers: this.setHeaders() })
      .pipe(map((res: Response) => res.json())).pipe(share())
  }
  public putRequest (path: string): Observable<ResponseSale> {
    return this.http.put(path, { headers: this.setHeaders() })
      .pipe(map((res: Response) => res.json())).pipe(share())
  }


  // put(path: string, body: Object = {}): Observable<any> {
  //     return this.http.put(
  //         `${path}`,
  //         JSON.stringify(body),
  //         { headers: this.setHeaders() }
  //     )
  //         .catch(this.formatErrors)
  //         .map((res: Response) => res.json());
  // }

  public postRequest (path: any, params: any): Observable<any> {
    const body = params
    return this.http.post(path, JSON.stringify(body), { headers: this.setHeaders() }
    ).pipe(map((res: Response) => res.json()))
  }

  deleteRequest (path: string): Observable<any> {
    return this.http.delete(
      path, { headers: this.setHeaders() }
    ).pipe(map((res: Response) => res.json()))
  }

  handleError (response) {
 
  }
}
