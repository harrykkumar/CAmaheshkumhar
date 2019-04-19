import { AttributeComponent } from './attribute.component'
import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

const routes: Routes = [
  { path: '', component: AttributeComponent, children: [
    { path: 'attribute', component: AttributeComponent }
  ]}
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AttributeRoutingModule { }
