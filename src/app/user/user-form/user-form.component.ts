import { UserFormService } from './user-form.service'
import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, ViewChild } from '@angular/core'
import { UIConstant } from '../../shared/constants/ui-constant'
import { Subject, forkJoin } from 'rxjs'
import { takeUntil } from 'rxjs/internal/operators/takeUntil'
import { map, tap } from 'rxjs/operators'
import * as _ from 'lodash'
import { OrganisationProfileService } from '../../start/header/organisation-profile/organisation-profile.service'
import { ToastrCustomService } from '../../commonServices/toastr.service'
import { CommonService } from '../../commonServices/commanmaster/common.services'
declare var $: any
declare const flatpickr: any

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
  @ViewChild('mobileDetailModel') mobileDetailModel
  @ViewChild('emailDetailModel') emailDetailModel
  @ViewChild('userFormModel') userFormModel
  @Input() showUserForm: any
  @Output() closeUserForm = new EventEmitter<any>()
  private unSubscribe$ = new Subject<void>()
  model: any = {}
  dummyData: any = {}
  addNew: boolean = false
  user: any = {}
  clientData: Array<any> = []
  officeData: Array<any> = []
  branchData: Array<any> = []
  userTypeData: Array<any> = []
  underTypeData: Array<any> = []
  underUserData: Array<any> = []
  mobileDetail: any = {}
  emailDetail: any = {}
  mobileTypeList: Array<any> = []
  mobileCountryCodeList: Array<any> = []
  emailTypeList: Array<any> = []
  editEmailDetailIndex: number = null
  editMobileDetailIndex: number = null
  constructor (
    private _userService: UserFormService,
    public _orgService: OrganisationProfileService,
    private toastrService: ToastrCustomService,
    public _commonService: CommonService
  ) { }

  ngOnInit () {
  }

  /* Function invoke when profile menu clicked  */
  ngOnChanges (changes: SimpleChanges): void {
    if (this.showUserForm.open === true) {
      $('#add_user').modal(UIConstant.MODEL_SHOW)
      this.initDateFormat()
      this.initDropDownData().subscribe((res) => {
        if (this.showUserForm.mode === 'EDIT') {
          this.getFormData(this.showUserForm.editId)
        }
      })
    } else {
      $('#add_user').modal(UIConstant.MODEL_HIDE)
    }
  }


  /* Function to initialise flatpicker date format */
  initDateFormat = () => {
    jQuery(function ($) {
      flatpickr('.dor', {
        enableTime: true,
        noCalendar: true,
        dateFormat: 'H:i',
        time_24hr: true
        // minTime: "16:00",
        // maxTime: "22:00"
      })
    })
  }

  /* Function to initialise dropdown list data */
  initDropDownData = () => {
    this.user.mobileArray = []
    this.user.emailArray = []
    this.clientData = [{ id: UIConstant.ZERO, text: 'Select Client' }]
    this.officeData = [{ id: UIConstant.ZERO, text: 'Select Office' }]
    this.branchData = [{ id: UIConstant.ZERO, text: 'Select Branch' }]
    this.userTypeData = [{ id: UIConstant.ZERO, text: 'Select User Type' }]
    this.underTypeData = [{ id: UIConstant.ZERO, text: 'Select Under Type' }]
    this.underUserData = [{ id: UIConstant.ZERO, text: 'Select Under User' }]
    this.getMobileTypeList()
    this.getEmailTypeList()
    return forkJoin(
      this.getClientList(),
      this.getUserTypeList(),
      this.getMobileCountryCodeList()
    )
  }

  /* Function to close user form */
  closeForm = () => {
    this.closeUserForm.emit(this.showUserForm)
    this.resetFormData()
  }

  /* Function to get client list data */
  getClientList = () => {
    return this._userService.getClientList().
      pipe(takeUntil(this.unSubscribe$),
        map((data) => {
          const list = _.map(data.Data, (element) => {
            return {
              id: element.Id,
              text: element.Name,
              data: { ...element }
            }
          })
          this.clientData = [{ id: UIConstant.ZERO, text: 'Select Client' }, ...list]
          return this.clientData
        })
      )
  }

  /* Function to get branch list data */
  getBranchList = (clientId) => {
    this._userService.getBranchList(clientId).
      pipe(takeUntil(this.unSubscribe$),
        map((data) => {
          const list = _.map(data.Data, (element) => {
            return {
              id: element.Id,
              text: element.Name,
              data: { ...element }
            }
          })
          return [{ id: UIConstant.ZERO, text: 'Select Branch' }, ...list]
        })
      ).subscribe((res) => {
        this.branchData = res
        if (this.branchData.length > 1 && this.dummyData.selectedBranch && this.dummyData.selectedBranch.id) {
          this.model.branchId = this.dummyData.selectedBranch.id
          this.dummyData.selectedBranch.id = 0
        }
      }, error => console.log(error))
  }

  /* Function to get office list data */
  getOfficeList = (branchId) => {
    this._userService.getOfficeList(branchId).
      pipe(takeUntil(this.unSubscribe$),
        map((data) => {
          const list = _.map(data.Data, (element) => {
            return {
              id: element.Id,
              text: element.Name,
              data: { ...element }
            }
          })
          return [{ id: UIConstant.ZERO, text: 'Select Office' }, ...list]
        })
      ).subscribe((res) => {
        this.officeData = res
        if (this.officeData.length > 1 && this.dummyData.selectedOffice && this.dummyData.selectedOffice.id) {
          this.model.officeId = this.dummyData.selectedOffice.id
          this.dummyData.selectedOffice.id = 0
        }
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
          this.userTypeData = [{ id: UIConstant.ZERO, text: 'Select User Type' }, ...list]
          return this.userTypeData
        })
      )
  }

  /* Function to get under type list data */
  getUnderTypeList = (userTypeId) => {
    const list = _.filter(this.userTypeData, (element) => {
      if (element.id < userTypeId) {
        return true
      }
    })
    this.underTypeData = [{ id: UIConstant.ZERO, text: 'Select Under Type' }, ...list]
    if (this.underTypeData.length > 1 && this.dummyData.selectedUnderType && this.dummyData.selectedUnderType.id) {
      this.model.underTypeId = this.dummyData.selectedUnderType.id
      this.dummyData.selectedUnderType.id = 0
    }
  }

  /* Function to get under user list data */
  getUnderUserList = (underType) => {
    this._userService.getUnderUserList(underType).
      pipe(takeUntil(this.unSubscribe$),
        map((data) => {
          const list = _.map(data.Data.LoginUserDetails, (element) => {
            return {
              id: element.Id,
              text: element.Name
            }
          })
          return [{ id: UIConstant.ZERO, text: 'Select Under User' }, ...list]
        })
      ).subscribe((res) => {
        this.underUserData = res
        if (this.underUserData.length > 0 && this.dummyData.selectedUnderUser && this.dummyData.selectedUnderUser.id) {
          this.model.underUserId = this.dummyData.selectedUnderUser.id
          this.dummyData.selectedUnderUser.id = 0
        }
      }, error => console.log(error))
  }

  /* Function invoke on client change */
  onClientChange = (event) => {
    if (event && event.data.length > 0) {
      this.user.selectedClient = event.data[0]
      if (this.user.selectedClient.id > 0) {
        this.getBranchList(this.user.selectedClient.id)
      }
    }
  }

  /* Function invoke on branch change */
  onBranchChange = (event) => {
    if (event && event.data.length > 0) {
      this.user.selectedBranch = event.data[0]
      if (this.user.selectedBranch.id > 0) {
        this.getOfficeList(this.user.selectedBranch.id)
      }
    }
  }

  /* Function invoke on office change */
  onOfficeChange = (event) => {
    if (event && event.data.length > 0) {
      this.user.selectedOffice = event.data[0]
    }
  }

  /* Function invoke on user type change */
  onUserTypeChange = (event) => {
    if (event && event.data.length > 0) {
      this.user.selectedUserType = event.data[0]
      if (this.user.selectedUserType.id > 0) {
        this.getUnderTypeList(this.user.selectedUserType.id)
      }
    }
  }

  /* Function invoke on under type change */
  onUnderTypeChange = (event) => {
    if (event && event.data.length > 0) {
      this.user.selectedUnderType = event.data[0]
      if (this.user.selectedUnderType.id > 0) {
        this.getUnderUserList(this.user.selectedUnderType.id)
      }
    }
  }

  /* Function invoke on under user change */
  onUnderUserChange = (event) => {
    if (event && event.data.length > 0) {
      this.user.selectedUnderUser = event.data[0]
    }
  }

  /* Function to validate mobile detail */
  validateMobileDetail = () => {
    let valid = true
    if (this.mobileDetail.selectedMobileCountryCode && Number(this.mobileDetail.selectedMobileCountryCode.id) === 0) {
      valid = false
    }
    return valid
  }

  /* Function to add new mobile details */
  addNewMobileDetail = () => {
    if (this.editMobileDetailIndex !== null && this.editMobileDetailIndex >= 0) {
      this.user.mobileArray[this.editMobileDetailIndex] = { ...this.mobileDetail }
      this.editMobileDetailIndex = null
    } else {
      this.user.mobileArray =
        [...this.user.mobileArray, this.mobileDetail]
    }
    this.mobileDetail = {
      selectedMobileType: 1,
      selectedMobileCountryCode:
        { id: UIConstant.ZERO, text: 'Select Country Code' },
      mobileNo: ''
    }
    this.mobileDetailModel.submitted = false
  }

  /* Function to edit mobile details */
  editMobileDetail = (index) => {
    this.mobileDetail = { ...this.user.mobileArray[index] }
    this.editMobileDetailIndex = index
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
        tap(response => this.mobileCountryCodeList = [...response])
      )
  }

  /* Function to add new email details */
  addNewEmailDetail = () => {
    if (this.editEmailDetailIndex !== null && this.editEmailDetailIndex >= 0) {
      this.user.emailArray[this.editEmailDetailIndex] = { ...this.emailDetail }
      this.editEmailDetailIndex = null
    } else {
      this.user.emailArray =
        [...this.user.emailArray, this.emailDetail]
    }
    this.emailDetail = {
      selectedEmailType: 1,
      selectedEmail: ''
    }
    this.emailDetailModel.submitted = false
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
  onCountryCodeSelectionChange = (event) => {
    if (event.data.length > 0) {
      this.mobileDetail.selectedMobileCountryCode = event.data[0]
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
    this.user = {
      id : loginData.Id ? loginData.Id : 0 ,
      code : loginData.Code ? loginData.Code : 0 ,
      selectedClient : { id : loginData.ClientId },
      selectedUserType : { id : loginData.UserTypeId } ,
      name : loginData.Name ,
      userName : loginData.LoginId ,
      password : loginData.Password ,
      email : loginData.EmailAddress ,
      isUseEmail : loginData.IsShowTransactions ,
      isUseTime : loginData.IsUseTime ,
      inTime : loginData.FromTime ,
      outTime : loginData.ToTime ,
      emailPassword : loginData.EmailPassword ,
      emailArray : _.map(response.Emails, (item) => {
        return {
          id: item.Id,
          selectedEmailType: item.EmailType,
          selectedEmail: item.EmailAddress
        }
      }) ,
      mobileArray :  _.map(response.ContactInfos, (item) => {
        return {
          id: item.Id,
          selectedMobileType: item.ContactType,
          selectedMobileCountryCode: {
            id: item.CountryCode === null ? 0 : item.CountryCode
          },
          mobileNo: item.ContactNo
        }
      })
    }

    this.model = {
      clientId: loginData.ClientId,
      userTypeId: loginData.UserTypeId
    }

    this.dummyData = {
      selectedBranch: { id: loginData.BranchId },
      selectedOffice: { id: loginData.OfficeId },
      selectedUnderType: { id: loginData.UnderTypeId },
      selectedUnderUser: { id: loginData.UnderUserId }
    }
  }

  /* Function to prepare payload for post user data */
  prepareSavePayload = () => {
    return {
      Code : this.user.code,
      Id : this.user.id,
      Name : this.user.name,
      Email : this.user.email,
      FromTime : this.user.inTime,
      ToTime : this.user.outTime,
      EmailPassword : this.user.emailPassword,
      IsShowTransactions : this.user.isUseEmail,
      IsUseTime : this.user.isUseTime,
      UserTypeId : this.user.selectedUserType.id,
      UnderUserId : this.user.selectedUnderUser.id,
      LoginId : this.user.userName,
      Password : this.user.password,
      ContactInfos : _.map(this.user.mobileArray, (mobile) => {
        return {
          Id: mobile.id ? mobile.id : 0,
          ContactNo: mobile.mobileNo,
          ContactType: mobile.selectedMobileType,
          CountryCode: mobile.selectedMobileCountryCode.id,
          ParentTypeId: 3
        }
      }),
      Emails : _.map(this.user.emailArray, (email) => {
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
        this.closeForm()
      }
    }, error => console.log(error))
  }

  /* Function to reset user data */
  resetFormData = () => {
    this.user = {}
    this.model = {}
    this.emailDetail.selectedEmailType = 1
    this.mobileDetail.selectedMobileType = 1
    this.mobileDetailModel.submitted = false
    this.emailDetailModel.submitted = false
    this.userFormModel.submitted = false
  }

  validateForm = () => {
    let valid = true
    if (Number(this.user.selectedClient.id) === 0) {
      valid = false
    } else if (valid && Number(this.user.selectedBranch.id) === 0) {
      valid = false
    } else if (valid && Number(this.user.selectedOffice.id) === 0) {
      valid = false
    } else if (valid && Number(this.user.selectedUserType.id) === 0) {
      valid = false
    } else if (valid && Number(this.user.selectedUnderType.id) === 0) {
      valid = false
    } else if (valid && Number(this.user.selectedUnderUser.id) === 0) {
      valid = false
    }
    return valid
  }

  setAddNew = () => {
    this.showUserForm.addNew = true
  }
}
