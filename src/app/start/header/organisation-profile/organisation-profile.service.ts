import { filter } from 'rxjs/operators';
/* Created by Bharat */

import { CommonService } from './../../../commonServices/commanmaster/common.services'
import { Injectable } from '@angular/core'
import { BaseServices } from 'src/app/commonServices/base-services'
import { ApiConstant } from 'src/app/shared/constants/api'
import { map } from 'rxjs/operators'
import * as _ from 'lodash'
import { VendorServices } from 'src/app/commonServices/TransactionMaster/vendoer-master.services'
import { UIConstant } from 'src/app/shared/constants/ui-constant'

@Injectable({
  providedIn: 'root'
})

export class OrganisationProfileService {
  totalIndustryList: Array<any> = []
  constructor (
    private _baseService: BaseServices,
    private _commonService: CommonService,
    private _vendorService: VendorServices) {
  }

   /* Funtion to update the organisation profile data  */
  saveOrgProfile = (data) => {
    return this._baseService.postRequest(ApiConstant.ORG_PROFILE_URL, data)
  }

   /* Funtion to update the saveCompanyProfile  data  */
   saveCompanyProfile = (data) => {
    return this._baseService.postRequest(ApiConstant.OWNER_ORGANISATION_LIST, data)
  }

  /* Funtion to get organisation profile data  */
  getOrgProfile = () => {
    return this._baseService.getRequest(ApiConstant.ORG_PROFILE_URL)
  }

  /* Funtion to get  getCompanyProfile data  */
  getCompanyProfile = () => {
    return this._baseService.getRequest(ApiConstant.OWNER_ORGANISATION_LIST)
  }

  
  /* Funtion to get  getCompanyProfile data  */
  getCompanyProfileDetails = (id?) => {
    if (id) {
      return this._baseService.getRequest(`${ApiConstant.ORG_COMPANY_DETAILS}?Id=${id}`)
    } else {
      return this._baseService.getRequest(ApiConstant.ORG_COMPANY_DETAILS)
    }
  }

  /* Funtion to update the branch data  */
  saveBranch = (data) => {
    return this._baseService.postRequest(`${ApiConstant.BRANCH_OFFICE_LIST_URL}`, data)
  }

  /* Funtion to get branch data  */
  getBranchList = () => {
    return this._baseService.getRequest(`${ApiConstant.BRANCH_OFFICE_LIST_URL}?RequestFrom=branch`)
  }

  /* Funtion to get branch details in edit mode  */
  getBranchDetails = (id) => {
    return this._baseService.getRequest(`${ApiConstant.BRANCH_OFFICE_URL}?Id=${id}&RequestFrom=branch`)
  }

  /* Funtion to update the office data  */
  saveOffice = (data) => {
    return this._baseService.postRequest(`${ApiConstant.BRANCH_OFFICE_LIST_URL}`, data)
  }

  /* Funtion to get office list  */
  getOfficeList = () => {
    return this._baseService.getRequest(`${ApiConstant.BRANCH_OFFICE_LIST_URL}`)
  }

  /* Funtion to get office details in edit mode  */
  getOfficeDetails = (id) => {
    return this._baseService.getRequest(`${ApiConstant.BRANCH_OFFICE_URL}?Id=${id}`)
  }

   /* Funtion to get all the mobile type list  */
  getMobileTypeList = () => {
    return ['Work', 'Home', 'Mobile', 'Fax', 'Skype', 'YMessenger', 'Sip', 'Other']
  }

   /* Funtion to get all the mobile country code list  */
  getMobileCountryCodeList = () => {
    return this._commonService.searchCountryByName('').
      pipe(
        map((data: any) => {
          const countryCodeList = _.map(data.Data, (element) => {
            return {
              id: element.Phonecode,
              text: `+${element.Phonecode} ${element.Name}`,
              contactLength: element.Length
            }
          })
          return [{ id: UIConstant.ZERO, text: 'Country Code' }, ...countryCodeList]
        })
      )
  }

  /* Function to get all the email type list */
  getEmailTypeList = () => {
    return ['Personal', 'Work', 'Home', 'Other']
  }

  /* Function to get all address type list */
  getAddressTypeList = () => {
    return this._vendorService.getCommonValues('166').
      pipe(
        map((data: any) => {
          const list = _.map(data.Data, (element) => {
            return {
              id: element.Id,
              text: element.CommonDesc
            }
          })
          return [{ id: UIConstant.ZERO, text: 'Select Address Type' }, ...list]
        })
      ).toPromise();
  }

   /* Function to get all the country list for dropdown */
  getCountryList = () => {
    return this._vendorService.getCommonValues('101').
      pipe(
        map((data: any) => {
          const countryList = _.map(data.Data, (element) => {
            return {
              id: element.Id,
              text: element.CommonDesc
            }
          })
          return [{ id: UIConstant.ZERO, text: 'Select Country' }, ...countryList]
        })
      ).toPromise();
  }

  /* Function to get all the state list */
  getStateList = (countryCode) => {
    return this._vendorService.gatStateList(countryCode).
      pipe(
        map((data: any) => {
          return _.map(data.Data, (element) => {
            return {
              id: element.Id,
              text: element.CommonDesc1,
              stateCode:element.ShortName1
            }
          })
        })
      )
  }

  /* Function to get all the city list  */
  getCityList = (stateCode) => {
    return this._vendorService.getCityList(stateCode).
      pipe(
        map((data: any) => {
          return _.map(data.Data, (element) => {
            return {
              id: element.Id,
              text: element.CommonDesc2
            }
          })
        })
      )
  }

  /* Function to get all the area list  */
  getAreaList = (cityCode) => {
    return this._vendorService.getAreaList(cityCode).
      pipe(
        map((data: any) => {
          return _.map(data.Data, (element) => {
            return {
              id: element.Id,
              text: element.CommonDesc3
            }
          })
        })
      )
  }

   /* Function to get all the industry type list  */
  getIndustryTypeList = () => {
    return this._commonService.getIndustryType().
      pipe(
        map((data: any) => {
          this.totalIndustryList = [...data.Data];
          const industryList = _.map(_.filter(data.Data, {UnderId : 0}), (element) => {
            return {
              id: element.Id,
              text: element.Name
            }
          })
          return [{ id: UIConstant.ZERO, text: 'Select Industry' }, ...industryList]
        })
      ).toPromise();
  }

  getSubIndustryTypeList = (industryId) => {
    const subIndustryList = _.map(_.filter(this.totalIndustryList, { UnderId: industryId }), (element) => {
      return {
        id: element.Id,
        text: element.Name
      }
    })
    return [{ id: UIConstant.ZERO, text: 'Select Sub Industry' }, ...subIndustryList]
  }

   /* Function to get all the key person type list */
  getKeyPersonTypeList = (organizationTypeId) => {
    return this._commonService.getPersonType().
      pipe(
        map((data: any) => {
          const keyPersonTypeList = _.map(_.filter(data.Data, { UId: organizationTypeId }), (element) => {
            return {
              id: element.Id,
              text: element.CommonDesc
            }
          })
          return [{ id: UIConstant.ZERO, text: 'Select Type Of Key Person' }, ...keyPersonTypeList]
        })
      )
  }

   /* Function to get all accounting method type list */
  getAccountingMethod = () => {
    return this._commonService.getAccountingMethod().
      pipe(
        map((data: any) => {
          const accMethodList = _.map(data.Data, (element) => {
            return {
              id: element.UId,
              text: element.CommonDesc
            }
          })
          return [{ id: UIConstant.ZERO, text: 'Select Accounting Method' }, ...accMethodList]
        })
      ).toPromise();
  }

  getFinYearIdList = () => {
    return this._commonService.getFinYearIdList().
      pipe(
        map((data: any) => {
          const list = _.map(data.Data, (element) => {
            return {
              id: element.Id,
              text: element.FinYear,
              IsCurrent: element.IsCurrent
            }
          })
          return [{ id: UIConstant.ZERO, text: 'Select Financial Year' }, ...list]
        })
      ).toPromise();
  }

  getTransactionSession = () => {
    return this._commonService.getTransactionSession().
      pipe(
        map((data: any) => {
          const list = _.map(data.Data, (element) => {
            return {
              id: element.UId,
              text: element.CommonDesc
            }
          })
          return [{ id: UIConstant.ZERO, text: 'Select Session' }, ...list]
        })
      ).toPromise();
  }

  getTransactionFormat = () => {
    return this._commonService.getTransactionFormat().
      pipe(
        map((data: any) => {
          const list = _.map(data.Data, (element) => {
            return {
              id: element.UId,
              text: element.CommonDesc
            }
          })
          return [{ id: UIConstant.ZERO, text: 'Select Format' }, ...list]
        })
      ).toPromise();
  }

  getTransactionPosition = () => {
    return this._commonService.getTransactionPosition().
      pipe(
        map((data: any) => {
          const list = _.map(data.Data, (element) => {
            return {
              id: element.UId,
              text: element.CommonDesc
            }
          })
          return [{ id: UIConstant.ZERO, text: 'Select Position' }, ...list]
        })
      ).toPromise();
  }

  getNumericZeroList = () => {
    const list =  _.map([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], (element, i) => {
      return {
        id: i + 1,
        text: element
      }
    })
    return [{id: UIConstant.ZERO, text: 'Select No. Of Zeroes'}, ...list]
  }

  getSplitterList = () => {
    return [
      { id: 0, text: 'Select Splitter' },
      { id: 1, text: '/' },
      { id: 2, text: '-' }]
  }

  getExistencyList = () => {
    return this._baseService.getRequest(ApiConstant.TRANS_EXISTENCY_GET)
  }

  postExistencyData = (data) => {
    return this._baseService.postRequest(ApiConstant.TRANS_EXISTENCY_POST, data)
  }

  getFinSessionList = () => {
    return this._commonService.getFinSessionList().
      pipe(
        map((data: any) => {
          const list = _.map(data.Data, (element) => {
            return {
              id: element.UId,
              text: element.CommonDesc,
              shortName: element.ShortName
            }
          })
          return [{ id: UIConstant.ZERO, text: 'Select Financial-Year Cycle' }, ...list]
        })
      ).toPromise();
  }


   /* Function to get all registration type list */
  getRegistrationTypeList = () => {
    return [{ id: 0, text: 'Select Registration Type' },
    { id: 1, text: 'Regular' },
    { id: 2, text: 'Composition' }, { id: 3, text: 'Exempted' },
    { id: 4, text: 'UnRegistered' }, { id: 5, text: 'E-Commerce Operator' }]
  }

  /* Function to get all branch type list */
  getBranchTypeList = () => {
    return this._commonService.getBranchTypeList().
      pipe(
        map((data: any) => {
          const branchType = _.map(data.Data, (element) => {
            return {
              id: element.UId,
              text: element.CommonDesc
            }
          })
          return [{ id: UIConstant.ZERO, text: 'Select Type of Organization' }, ...branchType]
        })
      ).toPromise();
  }

  /* Function to allow the regex pattern keys for company Name */
  validateCompanyName = (event) => {
    let valid = false
    if ((new RegExp(this._commonService.companyNameRegx).test(event.key))) {
      valid = true
    }
    return valid
  }

  /* Function to allow enter only alphanumeric keys */
  validateForAlphaNumeric = (event) => {
    let valid = false
    if ((new RegExp(this._commonService.alphaNumericRegx).test(event.key))) {
      valid = true
    }
    return valid
  }

  addNewCity(data){
    return this._baseService.postRequest(ApiConstant.CITY_ADD, data)
  }

  addNewArea(data){
    return this._baseService.postRequest(ApiConstant.AREA_ADD, data)
  }
}
