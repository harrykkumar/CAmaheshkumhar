import { ModalDirective } from './shared/directives/modal.directive';
import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http'
import { HttpModule } from '@angular/http'
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner'
import { Ng2SearchPipeModule } from 'ng2-search-filter'
import { AppComponent } from './app.component'
import { AppRoutingModule } from './app-routing.module'
import { ToastrModule } from 'ngx-toastr'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
@NgModule({
  imports: [
    BrowserModule.withServerTransition({ appId: 'myAppId' }),
    BrowserAnimationsModule,
    HttpModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    Ng2SearchPipeModule,
    Ng4LoadingSpinnerModule.forRoot(),
    ToastrModule.forRoot()
  ],
  declarations: [
    AppComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
