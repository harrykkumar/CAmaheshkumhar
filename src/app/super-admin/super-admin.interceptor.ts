import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, filter } from 'rxjs/operators';
import { ToastrCustomService } from '../commonServices/toastr.service';
import { UIConstant } from '../shared/constants/ui-constant';
import { map } from 'rxjs/internal/operators/map';
@Injectable()
export class HttpResponseInterceptor implements HttpInterceptor {
  constructor(@Inject(ToastrCustomService) private toasterService) { }
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    return next.handle(req).pipe(
      filter((data: any) => {
        if (data.Code === UIConstant.THOUSAND) {
          return true
        } else {
          throw new Error(data.Description)
        }
      }),
      catchError((err: any) => {
        this.toasterService.showError(err.description, '');
        return of(err);
      }),
      map(data => data.Data)
    );
  }
}