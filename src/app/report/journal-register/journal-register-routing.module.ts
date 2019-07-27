import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { JournalRegisterComponent } from './journal-register.component';

const routes: Routes = [
  { path: 'ims/report/journal-register', component: JournalRegisterComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JournalRegisterRoutingModule { }
