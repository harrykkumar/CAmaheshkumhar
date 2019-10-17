import { ActiveInventoryComponent } from './activeInventory.component'
import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

const routes: Routes = [
  { path: '', component: ActiveInventoryComponent, children: [
    { path: 'attribute', component: ActiveInventoryComponent }
  ]}
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActiveInventoryRoutingModule { }
