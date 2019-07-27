import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { DayBookComponent } from './daybook.component'

const routes: Routes = [
  { path: '', component: DayBookComponent, children: [
    { path: 'ims/report/daybook', component: DayBookComponent }
  ]}
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class DayBookRoutingModule {}
