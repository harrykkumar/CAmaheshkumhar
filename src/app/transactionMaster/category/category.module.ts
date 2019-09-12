import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Select2Module } from 'ng2-select2'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { CategoryComponent } from './category.component'
import { CategoryRoutingModule } from './category.routing.module'
import { PagingUtilityModule } from '../../shared/pagination/pagination.module'
import { NgxPaginationModule } from 'ngx-pagination'
@NgModule({
  declarations: [
    CategoryComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    Select2Module,
    CategoryRoutingModule,
    PagingUtilityModule,
    NgxPaginationModule
  ]
})
export class CategoryModule { }
