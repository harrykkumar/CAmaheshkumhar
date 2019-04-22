import { MatSnackBarModule } from '@angular/material/snack-bar'
import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'
import { ControlMessageComponent } from './transactionMaster/control-message/control-message.component'
import { DigitsOnlyDirective } from './directives/digits-only.directive'
import { IncludeDecimalDirective } from './directives/include-decimal.directive'
import { DateFormatPipe } from '../pipes/datepipe.pipe'
import { OrganisationBranchComponent } from '../start/org-branch/org-branch-form/org-branch-form.component';
import { Select2Module } from 'ng2-select2';
import { UserFormComponent } from '../user/user-form/user-form.component'
import { UserTypeFormComponent } from '../user/user-type-form/user-type-form.component';
@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    Select2Module
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    ControlMessageComponent,
    DigitsOnlyDirective,
    IncludeDecimalDirective,
    DateFormatPipe,
    OrganisationBranchComponent,
    Select2Module,
    UserFormComponent,
    UserTypeFormComponent
  ],
  declarations: [
    ControlMessageComponent,
    DigitsOnlyDirective,
    IncludeDecimalDirective,
    DateFormatPipe,
    OrganisationBranchComponent,
    UserFormComponent,
    UserTypeFormComponent
  ]
})
export class SharedModule {
}
