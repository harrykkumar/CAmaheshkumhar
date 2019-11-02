import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { TaxProcessComponent } from './tax-process-listing.component'

const routes: Routes = [
  { path: '', component: TaxProcessComponent, children: [
    { path: 'taxProcess', component: TaxProcessComponent }
  ]}
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class TaxProcessRoutingModule {}
