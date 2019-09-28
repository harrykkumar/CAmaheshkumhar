import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { CustomRateMainComponent } from "./custom-rate-main/custom-rate-main.component";
import { CustomRateAddComponent } from './custom-rate-add/custom-rate-add.component';
const routes: Routes = [
  { 
    path: '',
    component: CustomRateMainComponent,
    children: [
      {
        path: 'custom-rate',
        component: CustomRateAddComponent
      }
    ]
  }
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomRateRoutingModule {

}