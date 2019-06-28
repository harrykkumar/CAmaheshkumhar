import { ImageModalModule } from './transactionMaster/images-modal/image-modal.module';
import { FooterComponent } from './../start/footer/footer.component';
import { OrganisationProfileComponent } from './../start/header/organisation-profile/organisation-profile.component';
import { HeaderComponent } from './../start/header/header.component';
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'
import { ControlMessageComponent } from './transactionMaster/control-message/control-message.component'
import { DigitsOnlyDirective } from './directives/digits-only.directive'
import { IncludeDecimalDirective } from './directives/include-decimal.directive'
import { DateFormatPipe } from '../pipes/datepipe.pipe'
import { TableUtilityModule } from './table-utility/table-utility.module'
import { DynamicCategoryModule } from './dynamic-category/dynamic-category.module'
import { UserFormComponent } from '../user/user-form/user-form.component'
import { UserTypeFormComponent } from '../user/user-type-form/user-type-form.component'
import { Select2Module } from 'ng2-select2'
import { OrganisationBranchComponent } from '../start/org-branch/org-branch-form/org-branch-form.component'
import { PagingUtilityModule } from './pagination/pagination.module'
import { NgxPaginationModule } from 'ngx-pagination';
import { DatepickerModule } from './datepicker/datepicker.module';
import { RouterModule } from '@angular/router';
import { CompanyProfileComponent } from '../start/company-profile/company-profile.component';
import { AddNewCityComponent } from './components/add-new-city/add-new-city.component';
import { AddNewAreaComponent } from './components/add-new-area/add-new-area.component';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    Select2Module,
    ReactiveFormsModule,
    MatSnackBarModule,
    PagingUtilityModule,
    NgxPaginationModule,
    TableUtilityModule,
    DynamicCategoryModule,
    DatepickerModule,
    RouterModule,
    ImageModalModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    Select2Module,
    ReactiveFormsModule,
    MatSnackBarModule,
    ControlMessageComponent,
    DigitsOnlyDirective,
    IncludeDecimalDirective,
    DateFormatPipe,
    TableUtilityModule,
    DynamicCategoryModule,
    UserFormComponent,
    UserTypeFormComponent,
    HeaderComponent,
    FooterComponent,
    OrganisationProfileComponent,
    OrganisationBranchComponent,
    PagingUtilityModule,
    NgxPaginationModule,
    DatepickerModule,
    CompanyProfileComponent,
    RouterModule,
    ImageModalModule,
    AddNewCityComponent,
    AddNewAreaComponent
  ],
  declarations: [
    ControlMessageComponent,
    DigitsOnlyDirective,
    IncludeDecimalDirective,
    DateFormatPipe,
    UserFormComponent,
    UserTypeFormComponent,
    HeaderComponent,
    FooterComponent,
    OrganisationProfileComponent,
    OrganisationBranchComponent,
    CompanyProfileComponent,
    AddNewCityComponent,
    AddNewAreaComponent
  ]
})
export class SharedModule {
}
