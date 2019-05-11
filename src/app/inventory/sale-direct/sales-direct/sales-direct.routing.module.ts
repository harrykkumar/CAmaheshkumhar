import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { SalesListComponent } from './sales-list.component'

const routes: Routes = [
  { path: '', component: SalesListComponent, children: [
    { path: 'direct', component: SalesListComponent }
  ]}
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class SalesDirectRoutingModule {}
