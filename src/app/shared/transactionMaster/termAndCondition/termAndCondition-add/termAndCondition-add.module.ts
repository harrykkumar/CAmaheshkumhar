import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { Select2Module } from 'ng2-select2'
import { CommonModule } from '@angular/common'
import { SharedModule } from '../../../shared.module'
import { TermAndConditionAddComponent } from './termAndCondition-add.component'
import { UnitAddModule } from '../../unit/unit-add/unit-add.module'
import { TaxAddModule } from '../../tax/tax-add/tax-add.module'
import { CategoryAddModule } from '../../category/category-add/category-add.module'
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    Select2Module,
    SharedModule,
    UnitAddModule,
    TaxAddModule,
    CategoryAddModule
  ],
  declarations: [
    TermAndConditionAddComponent
  ],
  exports: [
    TermAndConditionAddComponent
  ],
  bootstrap: []
})
export class TermsAndCondiAddModule {

}
