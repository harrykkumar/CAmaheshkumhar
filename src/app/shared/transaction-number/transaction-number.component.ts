import { UIConstant } from 'src/app/shared/constants/ui-constant';
import { ToastrCustomService } from 'src/app/commonServices/toastr.service';
import { CommonService } from 'src/app/commonServices/commanmaster/common.services';
import { OrganisationProfileService } from './../../start/header/organisation-profile/organisation-profile.service';
import { LoginService } from 'src/app/commonServices/login/login.services';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import * as _ from 'lodash'
declare var $: any


@Component({
  selector: 'app-transaction-number',
  templateUrl: './transaction-number.component.html',
  styleUrls: ['./transaction-number.component.css']
})
export class TransactionNumberComponent implements OnInit {
dropDownList:any ={}
modal: any = {}
checkAll: boolean
transactionNumberList: Array<any> = []
  storedNumericValue: any;

  constructor(
    private _orgService: OrganisationProfileService,
    private _loginService: LoginService,
    private router: Router,
    private commonService: CommonService,
    private toastrService: ToastrCustomService,    
  ) { }

 async ngOnInit() {
    this.getOrganizationList()
    this.dropDownList.financialYearList = await this._orgService.getFinYearIdList()
    $('#transactionNumberModal').modal(UIConstant.MODEL_SHOW)
  }

  ngAfterViewInit(): void {
    this.commonService.fixTableHF('transaction-no-table');
  }

  getOrganizationList = () => {
    this._orgService.getCompanyProfile().pipe(
      map((Data) => {
        return _.map(Data.Data, (element) => {
          return {
            id: element.Id,
            text: element.Name
          }
        })
      }),
      catchError(this.handleError)
    ).subscribe((res) => {
      this.dropDownList.organizationList = [{id: 0, text: 'Select Organization'}, ...res];
    })
  }

  handleError = (error) => {
    console.error(error)
    return throwError(error.message)
  }

  onOrganisationChange(event) {
    if (Number(event.value) > 0) {
      this.modal['OrgId'] = event.value
      this.getTransactionList()
    }
  }

  onFinancialYearChange(event) {
    if (Number(event.value) > 0) {
      this.modal['FinYearId'] = event.value;
      this.getTransactionList()
    }
  }

  getTransactionList(){
   this.commonService.getTransationNumberList(this.modal).subscribe((response) => {
     if(response.Code === 1000){
       this.transactionNumberList = [...response.Data];
       this.storedNumericValue = _.map(this.transactionNumberList, 'NumericValue');
     }
   })
  }


  preparePayload(Data) {
    const data = {
      FinYearId: this.modal['FinYearId'],
      OrgId: this.modal['OrgId'],
      TransactionNos: _.map(Data, (item) => {
        return {
          Id: item.Id,
          Name: item.Name,
          TransactionType: item.TransactionType,
          NumericValue: item.NumericValue ? item.NumericValue : '',
          StringValue: item.StringValue ? item.StringValue : '',
          SuffixValue: item.SuffixValue ? item.SuffixValue : ''
        }
      })
    }
    return data;
  }

  submitForm() {
    const filteredData = _.filter(this.transactionNumberList, { Checked: true });
    const formInvalid = _.some(filteredData, ['inValid', true]);
    if (formInvalid) {
      return
    }
    const requestData = this.preparePayload(filteredData)
    this.commonService.postTransactionNumberList(requestData).subscribe((res) => {
      if (res.Code === 1000) {
        this.toastrService.showSuccess('Success', 'Saved Successfully');
        if (_.includes(this.router.url, 'organization')) {
          $('#transactionNumberModal').modal(UIConstant.MODEL_HIDE)
          this.router.navigate(['organizations']);
        } else {
          this.selectAllTransation({ target: { checked: false } });
          this.getTransactionList();
        }
      } else {
        this.toastrService.showError('Error', res.Message);
      }
    });
  }

  selectAllTransation(event){
    _.map(this.transactionNumberList, (item, index) => {
      item['Checked'] = event.target.checked
     this.invalidateNumericValue(item, index);
    })
  }

  validateNumericValue(item, index) {
    if (item.NumericValue <= this.storedNumericValue[index]) {
      item.inValid = true
    } else {
      item.inValid = false
    }
  }

  invalidateNumericValue(item, index) {
    if (item['Checked'] && (item.NumericValue <= this.storedNumericValue[index])) {
      item.inValid = true;
    } else {
      item.inValid = false
    }
  }

  onCloseModal(){
    this.commonService.navigateToPreviousUrl();
  }

}
