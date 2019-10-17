import { ImageModalModule } from './transactionMaster/images-modal/image-modal.module';
import { FooterComponent } from './../start/footer/footer.component';
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
import { AddNewCityComponent } from './components/add-new-city/add-new-city.component';
import { AddNewAreaComponent } from './components/add-new-area/add-new-area.component';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TabsModule } from 'ngx-bootstrap';
import { NgxSpinnerModule } from "ngx-spinner";
import { NgSelectModule } from '@ng-select/ng-select';
import { CompanyProfileComponent } from '../start/company-profile/company-profile.component';
import { ChartsModule } from 'ng2-charts';
import  { DatePicker2AppModule} from './datepicker-2/datepicker2.module'
import { SkipWhiteSpacesDirective } from './directives/no-white-spaces.directive';
import { ItemSearchPipe } from '../pipes/item-search.pipe';
import { LimitQty } from '../Manufacturer/buyer-order/limitQty.directive';
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
    DatePicker2AppModule,
    RouterModule,
    ImageModalModule,
    NgxExtendedPdfViewerModule,
    NgbModule,
    TabsModule.forRoot(),
    NgxSpinnerModule,
    NgSelectModule,
    ChartsModule
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
    SkipWhiteSpacesDirective,
    DateFormatPipe,
    TableUtilityModule,
    DynamicCategoryModule,
    UserFormComponent,
    UserTypeFormComponent,
    HeaderComponent,
    FooterComponent,
    OrganisationBranchComponent,
    PagingUtilityModule,
    NgxPaginationModule,
    DatepickerModule,
    RouterModule,
    ImageModalModule,
    AddNewCityComponent,
    AddNewAreaComponent,
    NgbModule,
    TabsModule,
    NgxSpinnerModule,
    NgSelectModule,
    CompanyProfileComponent,
    ChartsModule,
    DatePicker2AppModule,
    ItemSearchPipe,
    LimitQty
  ],
  declarations: [
    ControlMessageComponent,
    DigitsOnlyDirective,
    IncludeDecimalDirective,
    SkipWhiteSpacesDirective,
    DateFormatPipe,
    UserFormComponent,
    UserTypeFormComponent,
    HeaderComponent,
    FooterComponent,
    OrganisationBranchComponent,
    AddNewCityComponent,
    AddNewAreaComponent,
    CompanyProfileComponent,
    ItemSearchPipe,
    LimitQty
  ],
  entryComponents: [
    CompanyProfileComponent,
  ]
})
export class SharedModule {
}
