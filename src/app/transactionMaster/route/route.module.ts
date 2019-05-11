import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { Select2Module } from 'ng2-select2'
import { CommonModule } from '@angular/common'
import { RouteComponent } from './route.component'
import { RouteRoutingModule } from './route.routing.module'
import { RouteSearchComponent } from './route-search/route-search.component'
import { PagingUtilityModule } from '../../shared/pagination/pagination.module'
import { NgxPaginationModule } from 'ngx-pagination'
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    Select2Module,
    RouteRoutingModule,
    PagingUtilityModule,
    NgxPaginationModule
  ],
  declarations: [
    RouteComponent,
    RouteSearchComponent
  ]
})
export class RouteModule {

}
