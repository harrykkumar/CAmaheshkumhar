import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { ActiveInventoryItemComponent } from './active-inventory-item.component'

const routes: Routes = [
  { path: '', component: ActiveInventoryItemComponent, children: [
    { path: 'ims/report/active-inventory-item', component: ActiveInventoryItemComponent }
  ]}
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ActiveInventoryItemRoutingModule {}
