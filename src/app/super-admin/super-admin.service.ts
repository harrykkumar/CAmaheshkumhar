import { BaseServices } from './../commonServices/base-services';
import { Injectable } from '@angular/core';
import { ApiConstant } from '../shared/constants/api';

@Injectable({
  providedIn: 'root'
})
export class SuperAdminService {

  constructor(
    private baseService: BaseServices
  ) { }

  getClientAdminList() {
    return this.baseService.getRequest(ApiConstant.POST_CLIENT_SUPER_ADMIN)
  }
}
