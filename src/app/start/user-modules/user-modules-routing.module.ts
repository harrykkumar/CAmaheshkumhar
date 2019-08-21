import { ModuleGuard } from './module.guard';
import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { UserModulesComponent } from './user-modules.component'

const routes: Routes = [
  {
    path: '',
    component: UserModulesComponent,
    canActivate: [ModuleGuard]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserModulesRoutingModule { }
