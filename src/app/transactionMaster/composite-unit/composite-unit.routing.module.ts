import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { CompositeUnitComponent } from './composite-unit.component'

const routes: Routes = [
  { path: '', component: CompositeUnitComponent, children: [
    { path: 'composite-unit', component: CompositeUnitComponent }
  ]}
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class CompositeUnitRoutingModule {}
