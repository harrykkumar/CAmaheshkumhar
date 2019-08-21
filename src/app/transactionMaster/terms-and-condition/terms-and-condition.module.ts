import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { Select2Module } from 'ng2-select2'
import { CommonModule } from '@angular/common'
import { TermsAndConditionListComponent } from './terms-and-condition.component'
import { TermsAndConditionRoutingModule } from './terms-and-condition.routing.module'
import { PagingUtilityModule } from '../../shared/pagination/pagination.module'
import { NgxPaginationModule } from 'ngx-pagination'
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    Select2Module,
    TermsAndConditionRoutingModule,
    PagingUtilityModule,
    NgxPaginationModule
  ],
  declarations: [
    TermsAndConditionListComponent,
  ]
})
export class TermsAndConditionModule {

}
