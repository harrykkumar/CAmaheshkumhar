import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { TermsAndConditionListComponent } from './terms-and-condition.component'

const routes: Routes = [
  { path: '', component: TermsAndConditionListComponent, children: [
    { path: 'ims/Terms&Condition', component: TermsAndConditionListComponent }
  ]}
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class TermsAndConditionRoutingModule {}
