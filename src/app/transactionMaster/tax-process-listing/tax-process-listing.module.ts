import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { TaxProcessComponent } from './tax-process-listing.component'
import { Select2Module } from 'ng2-select2'
import { CommonModule } from '@angular/common'
import { TaxProcessRoutingModule } from './tax-process-listing.routing.module'
import { PagingUtilityModule } from '../../shared/pagination/pagination.module'
import { NgxPaginationModule } from 'ngx-pagination'
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    Select2Module,
    TaxProcessRoutingModule,
    NgxPaginationModule,
    PagingUtilityModule
  ],
  declarations: [
    TaxProcessComponent
  ]
})
export class TaxProcessModule {

}
