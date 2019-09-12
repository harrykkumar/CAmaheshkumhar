import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpResponseInterceptor } from './super-admin.interceptor';
import { SuperAdminComponent } from './super-admin/super-admin.component';

@NgModule({
  declarations: [
    SuperAdminComponent
  ],
  imports: [
    CommonModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpResponseInterceptor, multi: true }
  ]
})
export class SuperAdminModule { }
