import { NoconnectionComponent } from './noconnection.component';
import { CommonService } from 'src/app/commonServices/commanmaster/common.services';
import { Injectable } from '@angular/core';
import { CanDeactivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class NoConnectionRouteGaurd implements CanDeactivate<NoconnectionComponent> {
  constructor(
    private commonService: CommonService,
    private router: Router
  ) {
  }
  canDeactivate(): boolean {
    return this.authenticate();
  }

  authenticate() {
    if (this.commonService.isInternet) {
      return true;
    } else {
      this.router.navigate(['noconnection']);
      return false;
    }
  }
}
