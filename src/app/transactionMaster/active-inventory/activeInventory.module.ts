import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ActiveInventoryRoutingModule } from './activeInventory-routing.module'
import { ActiveInventoryComponent } from './activeInventory.component'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { Select2Module } from 'ng2-select2'
import { PagingUtilityModule } from '../../shared/pagination/pagination.module'
import { NgxPaginationModule } from 'ngx-pagination'
@NgModule({
  declarations: [ActiveInventoryComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    Select2Module,
    ActiveInventoryRoutingModule,
    PagingUtilityModule,
    NgxPaginationModule
  ]
})
export class ActiveInventoryModule { }
