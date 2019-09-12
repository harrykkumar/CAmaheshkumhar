import { NgModule} from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SuperAdminComponent } from './super-admin/super-admin.component';
import { ModulesResolver } from './super-admin.resolver';
import { SuperAdminGaurd } from './super-admin.gaurd';
const routes: Routes = [
  { 
    path: 'super-admin', component: SuperAdminComponent, 
    resolve: {
      modules: ModulesResolver
    },
    canActivate: [SuperAdminGaurd]
  }
]
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class SuperAdminRoutingModule {

}