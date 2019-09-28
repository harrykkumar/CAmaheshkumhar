import { NgModule } from "@angular/core";
import { CustomRateAddComponent } from './custom-rate-add/custom-rate-add.component';
import { CustomRateSearchComponent } from './custom-rate-search/custom-rate-search.component';
import { CommonModule } from '@angular/common';
import { CustomRateRoutingModule } from './custom-rate.routing.module';
import { SharedModule } from '../../shared/shared.module';
import { CustomRateMainComponent } from './custom-rate-main/custom-rate-main.component';
import { CustomSearchPipe } from './custom-rate.pipe';

@NgModule({
  declarations: [
    CustomRateAddComponent,
    CustomRateMainComponent,
    CustomRateSearchComponent,
    CustomSearchPipe
  ],
  imports: [
    CommonModule,
    SharedModule,
    CustomRateRoutingModule
  ]
})
export class CustomRateModule {

}