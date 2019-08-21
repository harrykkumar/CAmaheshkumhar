import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { share } from 'rxjs/operators'
import { TokenService } from './token.service'
import { Router } from '@angular/router'

@Injectable({
  providedIn: 'root'
})

export class BaseServices {

  constructor(private http: HttpClient, private tokenService: TokenService, private router: Router) { }

  private setHeaders(): HttpHeaders {
    const headersConfig = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
    if (this.tokenService.getToken()) {
      headersConfig['X-San-Jwt'] = `${this.tokenService.getToken()}`
    }
    return new HttpHeaders(headersConfig)
  }

  public getRequest(path: string): Observable<any> {
    return this.http.get(path, { headers: this.setHeaders() })
      .pipe(share())
  }
  public putRequest(path: string): Observable<any> {
    return this.http.put(path, { headers: this.setHeaders() }).pipe(share())
  }

  public postRequest(path: any, params: any): Observable<any> {
    const body = params
    return this.http.post(path, JSON.stringify(body), { headers: this.setHeaders() })
  }

  deleteRequest(path: string): Observable<any> {
    return this.http.delete(
      path, { headers: this.setHeaders() }
    )
  }
}
