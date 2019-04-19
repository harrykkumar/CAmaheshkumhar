import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { Select2Module } from 'ng2-select2'
import { ItemMasterComponent } from './item-master.component'
import { ItemSearchComponent } from './item-search/item-search.component'
import { CommonModule } from '@angular/common'
import { ItemMasterRoutingModule } from './item-master.routing.module'
import { ItemImportComponent } from './item-import/item-import.component'
import { ItemSearchPipe } from '../../pipes/item-search.pipe'
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    Select2Module,
    ItemMasterRoutingModule,
    NgMultiSelectDropDownModule
  ],
  declarations: [
    ItemMasterComponent,
    ItemSearchComponent,
    ItemImportComponent,
    ItemSearchPipe
  ]
})
export class ItemMasterModule {

}
