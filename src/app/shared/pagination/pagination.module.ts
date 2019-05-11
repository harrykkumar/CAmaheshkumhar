import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { PagingComponent } from './pagination.component'
import { NgxPaginationModule } from 'ngx-pagination'
import { FormsModule } from '@angular/forms'
@NgModule({
  declarations: [
    PagingComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgxPaginationModule
  ],
  exports: [
    PagingComponent
  ]
})
export class PagingUtilityModule {

}
