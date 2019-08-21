import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { ServiceItemComponent } from './service-item.component'

const routes: Routes = [
  { path: '', component: ServiceItemComponent, children: [
    { path: 'ims/service', component: ServiceItemComponent }
  ]}
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ServiceItemRoutingModule {}
