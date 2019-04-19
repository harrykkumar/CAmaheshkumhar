import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { RouteComponent } from './route.component'

const routes: Routes = [
  { path: '', component: RouteComponent, children: [
    { path: 'tax', component: RouteComponent }
  ]}
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class RouteRoutingModule {}
