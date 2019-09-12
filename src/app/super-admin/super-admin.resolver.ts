import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from "@angular/router";
import { Injectable, Inject } from '@angular/core';
import { BaseServices } from '../commonServices/base-services';
import { of } from 'rxjs';

@Injectable()
export class ModulesResolver implements Resolve<any> {
  constructor(@Inject(BaseServices) private baseService) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return of(['client', 'menus'])
  }
}