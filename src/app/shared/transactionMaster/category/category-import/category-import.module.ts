import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SharedModule } from '../../../shared.module'
import { CategoryImportComponent } from './category-import.component'
@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [
    CategoryImportComponent
  ],
  exports: [
    CategoryImportComponent
  ],
  bootstrap: []
})
export class CategoryImportModule {

}
