import { NgModule } from '@angular/core'
import { ItemMasterComponent } from './item-master.component'
import { ItemSearchComponent } from './item-search/item-search.component'
import { CommonModule } from '@angular/common'
import { ItemMasterRoutingModule } from './item-master.routing.module'
import { ItemImportComponent } from './item-import/item-import.component'
import { SharedModule } from '../../shared/shared.module';
@NgModule({
  imports: [
    CommonModule,
    ItemMasterRoutingModule,
    SharedModule
  ],
  declarations: [
    ItemMasterComponent,
    ItemSearchComponent,
    ItemImportComponent
  ]
})
export class ItemMasterModule {

}
