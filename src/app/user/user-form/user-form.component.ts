import { ApiConstant } from 'src/app/shared/constants/api';
import { BaseServices } from 'src/app/commonServices/base-services';
import { NgForm } from '@angular/forms';
import { LoginService } from './../../commonServices/login/login.services';
import { UserFormService } from './user-form.service'
import { Component, Input, Output, EventEmitter, SimpleChanges, ViewChild, AfterViewInit, OnInit } from '@angular/core'
import { UIConstant } from '../../shared/constants/ui-constant'
import { Subject, forkJoin } from 'rxjs'
import { takeUntil } from 'rxjs/internal/operators/takeUntil'
import { map, tap } from 'rxjs/operators'
import * as _ from 'lodash'
import { ToastrCustomService } from '../../commonServices/toastr.service'
import { CommonService } from '../../commonServices/commanmaster/common.services'
import { CompanyProfileService } from '../../start/company-profile/company-profile.service'
declare var $: any
declare const flatpickr: any

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
  userType: string
  @ViewChild('mobileDetailModel') mobileDetailModel: NgForm
  @ViewChild('emailDetailModel') emailDetailModel: NgForm
  @ViewChild('userFormModel') userFormModel
  @Output() closeModal = new EventEmitter();


  // @Input() showUserForm: any
  // @Output() closeUserForm = new EventEmitter<any>()
  private unSubscribe$ = new Subject<void>()
  model: any = {}
  dummyData: any = {}
  addNew: boolean = false
  user: any = {}
  clientData: Array<any> = []
  officeData: Array<any> = []
  orgnizationData: Array<any> = []
  branchData: Array<any> = []
  userTypeData: Array<any> = []
  underTypeData: Array<any> = []
  underUserData: Array<any> = []
  mobileDetail: any = {}
  emailDetail: any = {}
  mobileTypeList: Array<any> = []
  mobileCountryCodeList: Array<any> = []
  emailTypeList: Array<any> = []
  Multiorgnization:number=0
  MultiBranch:number=0
  disabledFlagOrgBranch:boolean
  editEmailDetailIndex: number = null
  editMobileDetailIndex: number = null
  currentContactLength: any;
  selectedContactCode: any;
  orgCountryCodeId: any;
  constructor(
    private _userService: UserFormService,
    public _orgService: CompanyProfileService,
    private toastrService: ToastrCustomService,
    public _commonService: CommonService,
    public _loginService: LoginService,
    private baseService: BaseServices
  ) {
    this.user.mobileArray = []
    this.user.emailArray = []
    this.getBranchList('Branch')
    this.getOrgnizationList()
    this.checkLoginUserCodematch()
    this.userType = this._loginService.userData.LoginUserDetailsinfo[0].UserType
    this.Multiorgnization = this._loginService.userData.LoginUserDetailsinfo[0].MO
    this.MultiBranch = this._loginService.userData.LoginUserDetailsinfo[0].MB
    this.getMobileTypeList()
    this.getEmailTypeList()
  }

  openModal(item?) {
    this._commonService.openModal('add_user');
    forkJoin(this.getUserTypeList(), this.getMobileCountryCodeList()).subscribe(
      (res) => {
        if (!this._commonService.isEmpty(item)) {
          this.getFormData(item.Id)
        }
      }
    )
  }

  closePopUp(data?) {
    this._commonService.closeModal('add_user')
    this.closeModal.emit(data);
  }


  checkLoginUserCodematch () {
    if(this._loginService.loginUserDetails.Code === this._loginService.userData.LoginUserDetailsinfo[0].Code){
      this.disabledFlagOrgBranch = true
    }
    else{
      this.disabledFlagOrgBranch = false
    }
  }

  ngOnInit() {
  }

  /* Function to get branch list data */
  getBranchList = (type) => {
    this._userService.getBranchListByType('?RequestFrom='+type).
      pipe(takeUntil(this.unSubscribe$),
        map((data) => {
          return  _.map(data.Data, (element) => {
            return {
              id: element.Id,
              text: element.Name,
              data: { ...element }
            }
          })
        })
      ).subscribe((res) => {
        this.branchData = [...res]
      }, error => console.log(error))
  }

  /* Function to get office list data */
  getOrgnizationList = () => {
    this._orgService.getCompanyProfile().
      pipe(takeUntil(this.unSubscribe$),
        map((data) => {
          return _.map(data.Data, (element) => {
            return {
              id: element.Id,
              text: element.Name,
              data: { ...element }
            }
          })
        })
      ).subscribe((res) => {
        this.orgnizationData = [...res]
        this.model.orgId =this.orgnizationData[0].id
      }, error => console.log(error))
  }

  /* Function to get user type list data */
  getUserTypeList = () => {
    return this._userService.getUserTypeList().
      pipe(takeUntil(this.unSubscribe$),
        map((data) => {
          const list = _.map(data.Data, (element) => {
            return {
              id: element.Id,
              text: element.Name,
              data: { ...element }
            }
          })
          this.userTypeData = [...list]
          return this.userTypeData
        })
      )
  }

  /* Function to get under type list data */
  getUnderTypeList = (userTypeId, data?) => {
    const list = _.filter(this.userTypeData, (element) => {
      if (element.id < userTypeId) {
        return true
      }
    })
    if (!this._commonService.isEmpty(list)) {
      this.underTypeData = [...list]
    } else {
      const list1 = _.find(this.userTypeData, { id: 1 });
      this.underTypeData = [{ ...list1 }]
    }
    if (!this._commonService.isEmpty(data)) {
      this.model.underTypeId = data.UnderTypeId
      this.getUnderUserList(this.model.underTypeId, data)
    }
  }

  /* Function to get under user list data */
  getUnderUserList = (underType, data?) => {
    this._userService.getUnderUserList(underType).
      pipe(takeUntil(this.unSubscribe$),
        map((data) => {
          return _.map(data.Data.LoginUserDetails, (element) => {
            return {
              id: element.Id,
              text: element.Name
            }
          })
        })
      ).subscribe((res) => {
        this.underUserData = [...res]
        if (!_.isEmpty(data)) {
          this.model.underUserId = data.UnderUserId
        }
      }, error => console.log(error))
  }

  /* Function invoke on user type change */
  onUserTypeChange = (event) => {
    if (this.model.userTypeId) {
      this.getUnderTypeList(this.model.userTypeId)
    } else {
      this.underTypeData = []
      this.model.underTypeId = null
    }
  }

  /* Function invoke on under type change */
  onUnderTypeChange = (event) => {
      if (this.model.underTypeId) {
        this.getUnderUserList(this.model.underTypeId)
      } else {
        this.underUserData = []
        this.model.underUserId = null
      }
  }

  /* Function to validate mobile detail */
  validateMobileDetail = () => {
    let valid = true
    if (!this.selectedContactCode) {
      valid = false
    }
    return valid
  }

  /* Function to add new mobile details */
  addNewMobileDetail = () => {
    const data = {
      id: this.editMobileDetailIndex !== null ? this.user.mobileArray[this.editMobileDetailIndex].id : 0,
      selectedMobileType: this.mobileDetail.selectedMobileType,
      selectedMobileCountryCode: this.selectedContactCode,
      mobileNo: this.mobileDetail.mobileNo
    }
    if (this.editMobileDetailIndex !== null && this.editMobileDetailIndex >= 0) {
      this.user.mobileArray[this.editMobileDetailIndex] = {...data}
      this.editMobileDetailIndex = null
    } else {
      this.user.mobileArray = [...this.user.mobileArray, { ...data }]
    }
    this.mobileDetailModel.resetForm();
    setTimeout(() => {
      this.mobileDetail.selectedMobileType = 1
      this.selectedContactCode = this.orgCountryCodeId
    })
  }

  /* Function to edit mobile details */
  editMobileDetail = (index) => {
    this.editMobileDetailIndex = index
    this.mobileDetail.selectedMobileType = this.user.mobileArray[index].selectedMobileType
    this.selectedContactCode = this.user.mobileArray[index].selectedMobileCountryCode;
    this.mobileDetail.mobileNo = this.user.mobileArray[index].mobileNo;
  }

  /* Function to remove mobile detail */
  removeMobileDetail = (index) => {
    this.user.mobileArray.splice(index, 1)
  }

  /* Function to get all the email type list */
  getEmailTypeList = () => {
    this.emailTypeList = this._orgService.getEmailTypeList()
    this.emailDetail.selectedEmailType = 1
  }

  /* Function to assign mobile type list  */
  getMobileTypeList = () => {
    this.mobileTypeList = this._orgService.getMobileTypeList()
    this.mobileDetail.selectedMobileType = 1
  }

  /* Funtion to get all the mobile country code list  */
  getMobileCountryCodeList = () => {
    return this._orgService.getMobileCountryCodeList().
      pipe(
        takeUntil(this.unSubscribe$),
        tap((response) => {
          this.mobileCountryCodeList = [...response]
          const orgAddress = JSON.parse(localStorage.getItem('ORGNIZATIONADDRESS'));
          if (!_.isEmpty(orgAddress)) {
            const obj = _.find(this.mobileCountryCodeList, { phoneCode: orgAddress.CountryCode })
            if (!_.isEmpty(obj)) {
              this.orgCountryCodeId = obj.id
              this.selectedContactCode = this.orgCountryCodeId
              this.onCountryCodeSelectionChange();
            }
          }
        })
      )
  }

  /* Function to add new email details */
  addNewEmailDetail = () => {
    if (this.editEmailDetailIndex !== null) {
      this.user.emailArray[this.editEmailDetailIndex] = { ...this.emailDetail }
      this.editEmailDetailIndex = null
    } else {
      this.user.emailArray.push({ ...this.emailDetail })
    }
    this.emailDetailModel.resetForm()
    setTimeout(() => {
      this.emailDetail = {
        selectedEmailType: 1,
        selectedEmail: ''
      }
    })
  }

  /* Function to edit email detail */
  editEmailDetail = (index) => {
    this.emailDetail = { ...this.user.emailArray[index] }
    this.editEmailDetailIndex = index
  }

  /* Function to remove email detail */
  removeEmailDetail = (index) => {
    this.user.emailArray.splice(index, 1)
  }

  /* Function invoke on coutnry code selection change */
  onCountryCodeSelectionChange = () => {
    if (this.selectedContactCode) {
      const data = _.find(this.mobileCountryCodeList, { id: this.selectedContactCode })
      if(!_.isEmpty(data)){
        this.currentContactLength = data.contactLength
      }
    }
  }

  /* Function to get form fields data through api */
  getFormData = (id) => {
    this._userService.getUserDetails(id).pipe(
      takeUntil(this.unSubscribe$)
    ).subscribe((res) => {
      if (res.Code === UIConstant.THOUSAND) {
        this.initFormData(res.Data)
      }
    }, error => console.log(error))
  }

  /* Function to get initialise form field data */
  initFormData = (response) => {
    const loginData = response.LoginUserDetails[0]
    if(!_.isEmpty(loginData)){
      this.model.orgId = loginData.OrgId
      this.model.branchId = loginData.BranchId
      this.model.userTypeId = loginData.UserTypeId
      this.getUnderTypeList(this.model.userTypeId, loginData)
      this.user = {
        id: loginData.Id ? loginData.Id : 0,
        code: loginData.Code ? loginData.Code : 0,
        name: loginData.Name,
        userName: loginData.LoginId,
        password: loginData.Password,
        email: loginData.EmailAddress,
        isUseEmail: loginData.IsShowTransactions,
        isUseTime: loginData.IsUseTime,
        inTime: loginData.FromTime,
        outTime: loginData.ToTime,
        emailPassword: loginData.EmailPassword,
        emailArray: _.map(response.Emails, (item) => {
          return {
            id: item.Id,
            selectedEmailType: item.EmailType,
            selectedEmail: item.EmailAddress
          }
        }),
        mobileArray: _.map(response.ContactInfos, (item) => {
          return {
            id: item.Id,
            selectedMobileType: item.ContactType,
            selectedMobileCountryCode: item.CountryCode,
            mobileNo: item.ContactNo
          }
        })
      }
    }
  }

  /* Function to prepare payload for post user data */
  prepareSavePayload = () => {
    return {
      BranchId: this.model.branchId,
      OrgId: this.model.orgId,
      Code: this.user.code,
      Id: this.user.id,
      Name: this.user.name,
      Email: this.user.email,
      FromTime: this.user.inTime,
      ToTime: this.user.outTime,
      EmailPassword: this.user.emailPassword,
      IsShowTransactions: this.user.isUseEmail,
      IsUseTime: this.user.isUseTime,
      UserTypeId: this.model.userTypeId ? this.model.userTypeId : 0,
      UnderUserId: this.model.underUserId ? this.model.underUserId : 0,
      LoginId: this.user.userName,
      Password: this.user.password,
      ContactInfos: _.map(this.user.mobileArray, (mobile) => {
        return {
          Id: mobile.id ? mobile.id : 0,
          ContactNo: mobile.mobileNo,
          ContactType: mobile.selectedMobileType,
          CountryCode: mobile.selectedMobileCountryCode,
          ParentTypeId: 3
        }
      }),
      Emails: _.map(this.user.emailArray, (email) => {
        return {
          Id: email.id ? email.id : 0,
          EmailAddress: email.selectedEmail,
          EmailType: email.selectedEmailType,
          ParentTypeId: 3
        }
      })
    }
  }

  /* Function to create user  */
  saveUser = () => {
    const data = this.prepareSavePayload()
    this._userService.createUser(data).pipe(
      takeUntil(this.unSubscribe$)
    ).subscribe((res) => {
      if (res.Code === UIConstant.THOUSAND) {
        this.toastrService.showSuccess('Success', 'Saved Successfully')
        this.closePopUp(true)
      } else {
        this.toastrService.showError('Error', res.Message)
      }
    }, error => console.log(error))
  }

  validateForm = () => {
    if (this.mobileDetail.selectedMobileType && this.selectedContactCode && this.mobileDetail.mobileNo) {
      this.addNewMobileDetail()
    }
    if (this.emailDetail.selectedEmailType && this.emailDetail.selectedEmail) {
      this.addNewEmailDetail()
    }
    let valid = true
    if (this.user.mobileArray.length === 0) {
      valid = false
    }
    if (this.user.emailArray.length === 0) {
      valid = false
    }
    return valid
  }

  onPaste(e) {
    this._commonService.allowOnlyNumericValueToPaste(e, (res) => {
      this.mobileDetail.mobileNo = res
    })
  };

}
