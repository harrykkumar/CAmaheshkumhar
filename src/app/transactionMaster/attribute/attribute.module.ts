import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { AttributeRoutingModule } from './attribute-routing.module'
import { AttributeComponent } from './attribute.component'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { Select2Module } from 'ng2-select2'
import { PagingUtilityModule } from '../../shared/pagination/pagination.module'
import { NgxPaginationModule } from 'ngx-pagination'
@NgModule({
  declarations: [AttributeComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    Select2Module,
    AttributeRoutingModule,
    PagingUtilityModule,
    NgxPaginationModule
  ]
})
export class AttributeModule { }
