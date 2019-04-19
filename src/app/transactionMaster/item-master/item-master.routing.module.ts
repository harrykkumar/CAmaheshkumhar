import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { ItemMasterComponent } from './item-master.component'

const routes: Routes = [
  { path: '', component: ItemMasterComponent, children: [
    { path: 'item-master', component: ItemMasterComponent }
  ]}
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ItemMasterRoutingModule {}
