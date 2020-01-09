import { AppInterceptorService } from './app.interceptor.service';
import { StartModule } from './start/start.module';
import { NgModule,ErrorHandler } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner'
import { Ng2SearchPipeModule } from 'ng2-search-filter'
import { AppComponent } from './app.component'
import { AppRoutingModule } from './app-routing.module'
import { ToastrModule } from 'ngx-toastr'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { NoconnectionComponent } from './noconnection/noconnection.component';
import { GlobalErrorHandler } from './globalErrorHandler.service'
@NgModule({
  imports: [
    BrowserModule.withServerTransition({ appId: 'myAppId' }),
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    Ng2SearchPipeModule,
    Ng4LoadingSpinnerModule.forRoot(),
    ToastrModule.forRoot(
      {
        timeOut: 1000,
        preventDuplicates: true
      }
    ),
    SharedModule,
    StartModule,
  ],
  declarations: [
    AppComponent,
    NoconnectionComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AppInterceptorService, multi: true },
    {provide: ErrorHandler, useClass: GlobalErrorHandler}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
