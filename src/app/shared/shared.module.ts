import { UserFormComponent } from './../user/user-form/user-form.component';
import { LeadInfoComponent } from './../crm/lead-info/lead-info.component';
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
import { SkipWhiteSpacesDirective } from './directives/no-white-spaces.directive';
import { ItemSearchPipe } from '../pipes/item-search.pipe';
import { LimitQty } from '../Manufacturer/buyer-order/limitQty.directive';
import { NameSearchPipe } from '../additional-settings/search.pipe';
import { CropImageComponent } from './image-cropper/image-cropper.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { AddCustomerAgentComponent } from '../super-admin/add-customer-agent/add-customer-agent.component';
import { AddCommonMasterPopUpComponent } from '../add-common-master-pop-up/add-common-master-pop-up.component';
import { AddMobileNoComponent } from '../add-mobile-no/add-mobile-no.component';
import { AddEmailComponent } from '../add-email/add-email.component';
import { AddItemDetailsComponent } from '../crm/add-item-details/add-item-details.component';
import { AddAddressComponent } from '../add-address/add-address.component';
import { AddLeadComponent } from '../crm/add-lead/add-lead.component';
import { AddLeadDetailComponent } from '../crm/add-lead-detail/add-lead-detail.component';
import { ChangeUserNameComponent } from './components/change-user-name/change-user-name.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { AssignToComponent } from './components/assign-to/assign-to.component';
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
    ImageModalModule,
    NgxExtendedPdfViewerModule,
    NgbModule,
    TabsModule.forRoot(),
    NgxSpinnerModule,
    NgSelectModule,
    ChartsModule,
    ImageCropperModule
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
    ItemSearchPipe,
    LimitQty,
    NameSearchPipe,
    ImageCropperModule,
    CropImageComponent,
    AddCustomerAgentComponent,
    AddCommonMasterPopUpComponent,
    AddMobileNoComponent,
    AddEmailComponent,
    AddItemDetailsComponent,
    AddAddressComponent,
    AddLeadComponent,
    AddLeadDetailComponent,
    LeadInfoComponent,
    ConfirmDialogComponent,
    AssignToComponent
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
    LimitQty,
    NameSearchPipe,
    CropImageComponent,
    AddCustomerAgentComponent,
    AddCommonMasterPopUpComponent,
    AddMobileNoComponent,
    AddEmailComponent,
    AddItemDetailsComponent,
    AddAddressComponent,
    AddLeadComponent,
    AddLeadDetailComponent,
    LeadInfoComponent,
    ChangeUserNameComponent,
    ConfirmDialogComponent,
    AssignToComponent
  ],
  entryComponents: [
    CompanyProfileComponent,
    CropImageComponent,
    AddCustomerAgentComponent,
    AddCommonMasterPopUpComponent,
    AddMobileNoComponent,
    AddEmailComponent,
    AddItemDetailsComponent,
    AddAddressComponent,
    LeadInfoComponent,
    UserFormComponent,
    ChangeUserNameComponent,
    AssignToComponent
  ]
})
export class SharedModule {
}
