import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { Select2Module } from 'ng2-select2'
import { CommonModule } from '@angular/common'
import { SharedModule } from '../../../shared.module'
import { ItemAddComponent } from './item-add.component'
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown'
import { ComboComponent } from '../item-combo/combo.component'
import { ItemAttributeOpeningStockComponent } from '../item-attribute-opening-stock/item-attribute-opening-stock.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    Select2Module,
    NgMultiSelectDropDownModule.forRoot(),
    SharedModule
  ],
  declarations: [
    ItemAddComponent,
    ComboComponent,
    ItemAttributeOpeningStockComponent
  ],
  exports: [
    ItemAddComponent,
    ItemAttributeOpeningStockComponent

  ],
  entryComponents:[ItemAttributeOpeningStockComponent],
  bootstrap: []
})
export class ItemAddModule {

}
