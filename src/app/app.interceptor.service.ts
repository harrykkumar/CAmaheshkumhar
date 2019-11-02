import { NgxSpinnerService   } from 'ngx-spinner';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable, throwError, empty, of } from 'rxjs';
import { ErrorHandler } from '@angular/core';
import { tap, map } from 'rxjs/operators';
import { LoginService } from './commonServices/login/login.services';
import { Injectable } from '@angular/core';
import * as _ from 'lodash'
import { ToastrCustomService } from './commonServices/toastr.service';

@Injectable()

export class AppInterceptorService implements HttpInterceptor ,ErrorHandler  {
  handleError(error: any): void {
    const chunkFailedMessage = /Loading chunk [\d]+ failed/;
     if (chunkFailedMessage.test(error.message)) {
       window.location.reload();
     }
   }
  constructor(private loginService: LoginService,
    private spinner: NgxSpinnerService,
    private toaster: ToastrCustomService) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          if (!_.isEmpty(event.body) && event.body.Code === 5018 || event.body.Code === 5002) {
            this.loginService.logOut();
            const error = event.body.Code === 5002 ? 'Invalid Token' : 'Session Expired';
            this.toaster.showError('', error);
          } else {
            return event
          }
        }
      })
    )
  }
}