import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { JournalRegisterComponent } from './journal-register.component'

const routes: Routes = [
  { path: '', component: JournalRegisterComponent, children: [
    { path: 'ims/report/journal-register', component: JournalRegisterComponent }
  ]}
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class JournalRegisterRoutingModule {}
