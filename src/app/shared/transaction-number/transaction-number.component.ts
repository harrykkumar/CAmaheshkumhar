import { UIConstant } from 'src/app/shared/constants/ui-constant';
import { ToastrCustomService } from 'src/app/commonServices/toastr.service';
import { CommonService } from 'src/app/commonServices/commanmaster/common.services';
import { CompanyProfileService } from '../../start/company-profile/company-profile.service';
import { LoginService } from 'src/app/commonServices/login/login.services';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import * as _ from 'lodash'
import { GlobalService } from 'src/app/commonServices/global.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Select2Component } from 'ng2-select2';
declare var $: any


@Component({
  selector: 'app-transaction-number',
  templateUrl: './transaction-number.component.html',
  styleUrls: ['./transaction-number.component.css']
})
export class TransactionNumberComponent implements OnInit {
  previousRoute: string;
  dropDownList: any = {}
  modal: any = {}
  checkAll: boolean
  transactionNumberList: Array<any> = []
  existencyList: Array<any> = []
  TransactionFor: string = 'Edit'
  constructor(
    private _orgService: CompanyProfileService,
    private _loginService: LoginService,
    private router: Router,
    public commonService: CommonService,
    private toastrService: ToastrCustomService,
    private _globalService: GlobalService,
    private spinnerService: NgxSpinnerService,
  ) {
    if (_.includes(this.router.url, 'organization')) {
      this.previousRoute = 'organization';
      this.TransactionFor = 'New'
    }
  }

  @ViewChild('session_format_select2') sessionFormatSelect2: Select2Component
  async ngOnInit() {
    this.getExistencyList()
    this.getOrganizationList()
    this.dropDownList.financialYearList = await this._orgService.getFinYearIdList()
    if (!_.isEmpty(this.dropDownList.financialYearList) && this.dropDownList.financialYearList.length > 1) {
      const finYearToSelect = _.find(this.dropDownList.financialYearList, { IsCurrent: true })
      if (!_.isEmpty(finYearToSelect)) {
        this.modal.FinYearValue = Number(finYearToSelect.id)
      }
    }
    this.dropDownList.numericZerosList = this._orgService.getNumericZeroList()
    if (!_.isEmpty(this.dropDownList.numericZerosList) && this.dropDownList.numericZerosList.length > 0) {
      this.modal.noOfZeroesValue = 0
    }
    this.dropDownList.splitterList = this._orgService.getSplitterList()
    if (!_.isEmpty(this.dropDownList.splitterList) && this.dropDownList.splitterList.length > 0) {
      this.modal.splitterValue = 1
    }
    this.dropDownList.transactionSessionList = await this._orgService.getTransactionSession()
    console.log(this.dropDownList.transactionSessionList)
    if (!_.isEmpty(this.dropDownList.transactionSessionList) && this.dropDownList.transactionSessionList.length > 0) {
      this.modal.sessionValue = 1
      this.modal.selectedSession = this.dropDownList.transactionSessionList[0]
      this.modal.selectedSession.id = 1
    }
    this.dropDownList.transactionFormatList = await this._orgService.getTransactionFormat()
    console.log(this.dropDownList.transactionFormatList)
    if (!_.isEmpty(this.dropDownList.transactionFormatList) && this.dropDownList.transactionFormatList.length > 0) {
      this.modal.transFormatValue = +this.dropDownList.transactionFormatList[0].id
      this.transformFormatList(this.modal.selectedSession.id)
    }
    this.dropDownList.transactionPositionList = await this._orgService.getTransactionPosition()
    if (!_.isEmpty(this.dropDownList.transactionPositionList) && this.dropDownList.transactionPositionList.length > 0) {
      this.modal.positionValue = 1
    }
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
      this.dropDownList.organizationList = [{ id: 0, text: 'Select Organization' }, ...res];
      const organization = JSON.parse(localStorage.getItem('SELECTED_ORGANIZATION'));
      if (!_.isEmpty(organization)) {
        this.modal.OrgValue = organization.Id;
      }
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
      this.modal['FinYearId'] = Number(event.value);
      this.getTransactionList()
    }
  }

  onTransSessionChange(event) {
    this.modal.selectedSession = event.data[0]
    this.modal.selectedSession.id = Number(event.value)
    this.transformFormatList(this.modal.selectedSession.id)
  }

  onTransFormatChange(event) {
    this.modal.selectedFormat = event.data[0]
    switch (Number(event.value)) {
      case 0:
        this.generateDateString('', 0)
        break;
      // case 1:
      //   this.generateDateString('d-M-Y')
      //   break;
      // case 2:
      //   this.generateDateString('d-M-y')
      //   break;
      case 3:
        this.generateDateString('d-m-Y')
        break;
      case 4:
        this.generateDateString('d-m-y', 2)
        break;
      case 5:
        this.generateDateString('d-m-y', 3)
        break;
      default:
        break;
    }
  }

  generateDateString(format?, type?: number) {
    if (format) {
      let date, dateArray
      const today = new Date();
      date = this._globalService.utcToClientDateFormat(today.toUTCString(), format)
      dateArray = date.split('-')
      if (type === 2) {
        this.modal.dateString = `${dateArray[1]}${dateArray[2]}`
      } else if (type === 3) {
        this.modal.dateString = `${dateArray[0]}${dateArray[1]}${dateArray[2]}`
      }
      if (!_.isEmpty(this.modal.selectedPosition) && Number(this.modal.selectedPosition.id) > 0) {
        this.generateDemoString()
      }
    } else {
      this.modal.dateString = ''
      this.generateDemoString()
    }
  }

  generateDemoString() {
    _.map(this.transactionNumberList, (item, index) => {
      this.generateFormatString(item, index)
    })
  }

  generateFormatString(item, index) {
    if (!_.isEmpty(this.modal.selectedPosition) && !isNaN(this.modal.selectedPosition.id)
      && !_.isEmpty(this.modal.selectedFormat) && !isNaN(this.modal.selectedFormat.id)
    ) {
      const position = Number(this.modal.selectedPosition.id)
      if (position === 1) {
        this.Concat_At_Position_1(item, index)
      } else if (position === 2) {
        this.Concat_At_Position_2(item, index)
      } else if (position === 3) {
        this.Concat_At_Position_3(item, index)
      } else if (position === 4) {
        this.Concat_At_Position_4(item, index)
      }
    } else if ((_.isEmpty(this.modal.selectedPosition) || !Number(this.modal.selectedPosition.id))) {
      this.Concat_At_Position_0(item, index)
    }
  }

  Concat_At_Position_0(item, index) {
    this.transactionNumberList[index]['generatedString'] = ''
    if (item.StringValue) {
      this.concatPrefixValue(item, index)
    }
    if (item.zeroString) {
      if (item.StringValue) {
        this.concatSplitter(index)
      }
      this.concatZeroStringValue(item, index)
    }
    if (item.SuffixValue) {
      if (item.zeroString) {
        this.concatSplitter(index)
      }
      this.concatSuffixValue(item, index)
    }
  }

  Concat_At_Position_1(item, index) {
    this.transactionNumberList[index]['generatedString'] = ''
    if (item.StringValue) {
      this.concatPrefixValue(item, index)
    }
    if (item.zeroString) {
      if (item.StringValue) {
        this.concatSplitter(index)
      }
      this.concatZeroStringValue(item, index)
    }
    if (this.modal.dateString) {
      if (item.zeroString) {
        this.concatSplitter(index)
      }
      this.concatDateStringValue(item, index)
    }
    if (item.SuffixValue) {
      if (this.modal.dateString) {
        this.concatSplitter(index)
      }
      this.concatSuffixValue(item, index)
    }
  }

  Concat_At_Position_2(item, index) {
    this.transactionNumberList[index]['generatedString'] = ''
    if (item.StringValue) {
      this.concatPrefixValue(item, index)
    }
    if (item.zeroString) {
      if (item.StringValue) {
        this.concatSplitter(index)
      }
      this.concatZeroStringValue(item, index)
    }
    if (item.SuffixValue) {
      if (item.zeroString) {
        this.concatSplitter(index)
      }
      this.concatSuffixValue(item, index)
    }
    if (this.modal.dateString) {
      if (item.SuffixValue) {
        this.concatSplitter(index)
      }
      this.concatDateStringValue(item, index)
    }
  }

  Concat_At_Position_3(item, index) {
    this.transactionNumberList[index]['generatedString'] = ''
    if (this.modal.dateString) {
      this.concatDateStringValue(item, index)
    }
    if (item.StringValue) {
      if (this.modal.dateString) {
        this.concatSplitter(index)
      }
      this.concatPrefixValue(item, index)
    }
    if (item.zeroString) {
      if (item.StringValue) {
        this.concatSplitter(index)
      }
      this.concatZeroStringValue(item, index)
    }
    if (item.SuffixValue) {
      if (item.zeroString) {
        this.concatSplitter(index)
      }
      this.concatSuffixValue(item, index)
    }
  }

  Concat_At_Position_4(item, index) {
    this.transactionNumberList[index]['generatedString'] = ''
    if (item.StringValue) {
      this.concatPrefixValue(item, index)
    }
    if (this.modal.dateString) {
      if (item.StringValue) {
        this.concatSplitter(index)
      }
      this.concatDateStringValue(item, index)
    }
    if (item.zeroString) {
      if (this.modal.dateString) {
        this.concatSplitter(index)
      }
      this.concatZeroStringValue(item, index)
    }
    if (item.SuffixValue) {
      if (item.zeroString) {
        this.concatSplitter(index)
      }
      this.concatSuffixValue(item, index)
    }
  }

  concatPrefixValue(item, index) {
    this.transactionNumberList[index]['generatedString'] = this.transactionNumberList[index]['generatedString'].concat(item.StringValue)
  }

  concatZeroStringValue(item, index) {
    this.transactionNumberList[index]['generatedString'] = this.transactionNumberList[index]['generatedString'].concat(item.zeroString)

  }

  concatSuffixValue(item, index) {
    this.transactionNumberList[index]['generatedString'] = this.transactionNumberList[index]['generatedString'].concat(item.SuffixValue)

  }

  concatDateStringValue(item, index) {
    this.transactionNumberList[index]['generatedString'] = this.transactionNumberList[index]['generatedString'].concat(this.modal.dateString)
  }

  concatSplitter(index) {
    this.transactionNumberList[index]['generatedString'] = this.transactionNumberList[index]['generatedString'].concat(this.modal.splitterString)
  }

  removeSplitter(index) {
    this.transactionNumberList[index]['generatedString'].slice(0, this.transactionNumberList[index]['generatedString'].length - 1);
  }

  onNumericZeroChange(event) {
    this.modal.selectedNumericZero = event.data[0]
    _.map(this.transactionNumberList, (item, index) => {
      this.onNumericValueChange(item, index)
    })
  }

  onNumericValueChange(item, index) {
    if (item.NumericValue) {
      item.zeroString = item.NumericValue
      if (!_.isEmpty(this.modal.selectedNumericZero) && Number(this.modal.selectedNumericZero.id) > 0) {
        item.zeroString = _.padStart(item.NumericValue, Number(this.modal.selectedNumericZero.id), '0')
      }
      this.generateFormatString(item, index)
    }
  }

  onTransactionPositionChange(event) {
    if (event.data.length > 0) {
      this.modal.selectedPosition = event.data[0]
      if (this.generateDateString) {
        this.generateDemoString()
      }
    }
  }

  onSplitterChange(event) {
      this.modal.selectedSplitterId = Number(event.value)
      this.modal.splitterString = Number(event.value) === 0 ? '' : event.data[0]['text']
      this.generateDemoString()
  }

  getTransactionList() {
    this.spinnerService.show()
    this.commonService.getTransationNumberList(this.modal, this.TransactionFor).subscribe((response) => {
      if (response.Code === UIConstant.THOUSAND) {
        this.transactionNumberList = [...response.Data];
        if (this.previousRoute) {
          this.selectAllTransation({ target: { checked: true } });
        }
        _.map(this.transactionNumberList, (element) => {
          element['zeroString'] = element.NumericValue
        })
        this.generateDemoString()
      }
      this.spinnerService.hide()
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
          SuffixValue: item.SuffixValue ? item.SuffixValue : '',
          NoOfZero: _.isEmpty(this.modal.selectedNumericZero) ? 0 : this.modal.selectedNumericZero.id,
          SessionFormat: _.isEmpty(this.modal.selectedFormat) ? 0 : this.modal.selectedFormat.id,
          SessionTypeId: _.isEmpty(this.modal.selectedSession) ? 0 : this.modal.selectedSession.id,
          SessionPosition: _.isEmpty(this.modal.selectedPosition) ? 0 : this.modal.selectedPosition.id,
          Splitor: this.modal.selectedSplitterId ? this.modal.selectedSplitterId : 0
        }
      })
    }
    return data;
  }

  submitForm() {
    this.spinnerService.show();
    const filteredData = _.filter(this.transactionNumberList, { Checked: true });
    if (_.isEmpty(filteredData)) {
      this.toastrService.showError('Error', 'Please select atleast 1 row')
      return
    }
    const formInvalid = _.some(filteredData, ['inValid', true]);
    if (formInvalid) {
      return
    }
    this.preparePayloadForExistencyAtSubmit(filteredData)
    this.spinnerService.hide();
  }

  postTransactionNumberListData(filteredData) {
    this.spinnerService.show()
    const requestData = this.preparePayload(filteredData)
    this.commonService.postTransactionNumberList(requestData).subscribe((res) => {
      if (res.Code === 1000) {
        this.toastrService.showSuccess('Success', 'Saved Successfully');
        if (_.includes(this.router.url, 'organization')) {
          $('#transactionNumberModal').modal(UIConstant.MODEL_HIDE)
          this.router.navigate(['organizations']);
        } else {
          this.selectAllTransation({ target: { checked: false } });
          this.checkAll = false
          this.getTransactionList();
        }
      } else {
        this.toastrService.showError('Error', res.Description);
      }
      this.spinnerService.hide()
    });
  }

  selectAllTransation(event) {
    _.map(this.transactionNumberList, (item, index) => {
      item['Checked'] = event.target.checked
    })
  }

  validateNumericValue(item, index) {
    if (item.NumericValue && !item.inValid) {
      const data = this.prepareExistencyPayload(item)
      this._orgService.postExistencyData(data).subscribe((res) => {
        if (res.Code === 1000 && res.Data && res.Data.length > 0) {
          if (res.Data[0].FormKeyName === item.TransactionType && res.Data[0].Status === 1) {
            item.inValid = true
            this.toastrService.showError('Error', 'Numeric Value is not valid')
          }
        }
      })
    }
  }

  checkForDropDown(item, index) {
    if (_.isEmpty(this.modal.selectedSession) || (!_.isEmpty(this.modal.selectedSession) && !Number(this.modal.selectedSession.id))) {
      item.inValid = true
      this.toastrService.showError('Session is Required', 'Please Select Valid  Session for the Numeric value valid')
      return
    } else {
      item.inValid = false
    }
    if (!this.modal['OrgId']) {
      item.inValid = true
      this.toastrService.showError('Organisation is Required', 'Please Select Valid  Organisation for the Numeric value valid')
      return
    } else {
      item.inValid = false
    }
    if (!this.modal['FinYearId']) {
      item.inValid = true
      this.toastrService.showError('Financial Year is Required', 'Please Select Valid  Fin Year for the Numeric value valid')
      return
    } else {
      item.inValid = false
    }
  }

  onCloseModal() {
    this.commonService.navigateToPreviousUrl();
  }

  getExistencyList() {
    this._orgService.getExistencyList().subscribe((res) => {
      this.existencyList = [...res.Data]
    })
  }

  preparePayloadForExistencyAtSubmit(filteredData) {
    this.spinnerService.show()
    const checkExistArray = []
    _.forEach(filteredData, (item, index) => {
      _.forEach(this.existencyList, (element) => {
        if (element.FieldName === 'TransactionType') {
          element.FieldValue = item.TransactionType
        }
        if (element.FieldName === 'NumericValue') {
          element.FieldValue = item.NumericValue
        }
        if (element.FieldName === 'FinYearId') {
          element.FieldValue = this.modal['FinYearId']
        }
        if (element.FieldName === 'SessionTypeId') {
          element.FieldValue = Number(this.modal.selectedSession.id)
        }
        if (element.FieldName === 'OrgId') {
          element.FieldValue = this.modal['OrgId']
        }
        const data = {
          "Type": element.Type,
          "FormName": element.FormName,
          "TableName": element.TableName,
          "FieldName": element.FieldName,
          "FieldValue": element.FieldValue,
          "FormKeyName": element.FormKeyName,
          "GroupId": (index + 1),
          "IsParent": element.IsParent,
          "ClientId": element.ClientId,
          "BranchId": element.BranchId,
          "OfficeId": element.OfficeId,
          "Id": element.Id,
          "CreatedOn": element.CreatedOn,
          "ModifiedOn": element.ModifiedOn,
          "CreatedIp": element.CreatedIp,
          "ModifiedIp": element.ModifiedIp,
          "CreatedBy": element.CreatedBy,
          "ModifiedBy": element.ModifiedBy,
          "IsActive": element.IsActive,
          "TotalRows": element.TotalRows
        }
        checkExistArray.push({ ...data })
      })
    })
    this._orgService.postExistencyData({ ExistencyNames: [...checkExistArray] }).subscribe((res) => {
      if (res.Code === 1000 && res.Data && res.Data.length > 0) {
        _.map(filteredData, (item, index) => {
          _.forEach(res.Data, (errorItem) => {
            if (errorItem.FormKeyName === item.TransactionType && res.Data[0].Status === 1) {
              const index = _.findIndex(this.transactionNumberList, ['Id', item.Id])
              this.transactionNumberList[index]['inValid'] = true
              item.inValid = true
            }
          })
        })
        const formInvalid = _.some(filteredData, ['inValid', true]);
        if (formInvalid) {
          this.toastrService.showError('Error', 'Numeric Value is not valid')
        } else {
          this.postTransactionNumberListData(filteredData)
        }
      } else {
        this.postTransactionNumberListData(filteredData)
      }
      this.spinnerService.hide()
    })
  }

  prepareExistencyPayload(item) {
    return {
      ExistencyNames: _.map(this.existencyList, (element) => {
        if (element.FieldName === 'TransactionType') {
          element.FieldValue = item.TransactionType
        }
        if (element.FieldName === 'NumericValue') {
          element.FieldValue = item.NumericValue
        }
        if (element.FieldName === 'FinYearId') {
          element.FieldValue = this.modal['FinYearId']
        }
        if (element.FieldName === 'SessionTypeId') {
          element.FieldValue = Number(this.modal.selectedSession.id)
        }
        if (element.FieldName === 'OrgId') {
          element.FieldValue = this.modal['OrgId']
        }
        return {
          "Type": element.Type,
          "FormName": element.FormName,
          "TableName": element.TableName,
          "FieldName": element.FieldName,
          "FieldValue": element.FieldValue,
          "FormKeyName": element.FormKeyName,
          "GroupId": 1,
          "IsParent": element.IsParent,
          "ClientId": element.ClientId,
          "BranchId": element.BranchId,
          "OfficeId": element.OfficeId,
          "Id": element.Id,
          "CreatedOn": element.CreatedOn,
          "ModifiedOn": element.ModifiedOn,
          "CreatedIp": element.CreatedIp,
          "ModifiedIp": element.ModifiedIp,
          "CreatedBy": element.CreatedBy,
          "ModifiedBy": element.ModifiedBy,
          "IsActive": element.IsActive,
          "TotalRows": element.TotalRows
        }
      })
    }
  }

  validateForm() {
    let valid = true
    if (_.isEmpty(this.modal.selectedSession) || (!_.isEmpty(this.modal.selectedSession) && !Number(this.modal.selectedSession.id))) {
      valid = false
    } else if (valid && !this.modal['OrgId']) {
      valid = false
    } else if (valid && !this.modal['FinYearId']) {
      valid = false
    }
    return valid
  }

  transformFormatList(sessionValue) {
    let _copy = []
    if (this.dropDownList.transactionFormatList && this.dropDownList.transactionFormatList.length > 0) {
      _copy = JSON.parse(JSON.stringify(this.dropDownList.transactionFormatList))
    }
    if (!_.isEmpty(_copy)) {
      switch(sessionValue) {
        case 1:
            _copy.forEach(element => {
            if (element.id === 5) {
              element['disabled'] = true
            } else {
              element['disabled'] = false
            }
          });
          this.dropDownList.transactionFormatList = [..._copy]
          this.modal.transFormatValue = 0
          break
        case 4:
            _copy.forEach(element => {
              if (element.id === 0 || element.id === 5) {
                element['disabled'] = true
              } else {
                element['disabled'] = false
              }
            });
            this.dropDownList.transactionFormatList = [..._copy]
            this.modal.transFormatValue = 4
          break
        case 5:
            _copy.forEach(element => {
            if (element.id === 0 || element.id === 4) {
              element['disabled'] = true
            } else {
              element['disabled'] = false
            }
          });
          this.dropDownList.transactionFormatList = [..._copy]
          this.modal.transFormatValue = 5
          break
        case 6:
            _copy.forEach(element => {
            element['disabled'] = false
          });
          this.dropDownList.transactionFormatList = [..._copy]
          this.modal.transFormatValue = 0
          break
      }
    }
  }
}
