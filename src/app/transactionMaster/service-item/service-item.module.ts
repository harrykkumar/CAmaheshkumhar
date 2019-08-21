import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { Select2Module } from 'ng2-select2'
import { ServiceItemComponent } from './service-item.component'
import { ServiceSearchComponent } from './service-search/service-search.component'
import { CommonModule } from '@angular/common'
import { ServiceItemRoutingModule } from './service-item.routing.module'
import { ServiceImportComponent } from './service-import/service-import.component'
// import { ItemSearchPipe } from '../../pipes/item-search.pipe'
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown'
import { PagingUtilityModule } from '../../shared/pagination/pagination.module'
import { NgxPaginationModule } from 'ngx-pagination'
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    Select2Module,
    ServiceItemRoutingModule,
    NgMultiSelectDropDownModule,
    PagingUtilityModule,
    NgxPaginationModule
  ],
  declarations: [
    ServiceItemComponent,
    ServiceSearchComponent,
    ServiceImportComponent,
    // ItemSearchPipe
  ]
})
export class ServiceItemMasterModule {

}
