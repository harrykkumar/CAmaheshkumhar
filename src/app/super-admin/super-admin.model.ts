import { Select2OptionData } from "ng2-select2";

export interface superAdmin {
  
}

export interface select2Return {
  data: Array<Select2OptionData>
  type: string
}

export interface ClientAddInterface {
  Id: number,
  NoOfBranch: number,
  NoOfOrganization:  number,
  IsMultiBranch: number,
  IsMultiOrganization: number,
  SubscriptionTypeId: number,
  NoOfUser: number,
  UserName: string,
  Password: string,
  RegistrationDate: string,
  Name: string,
  IndustryIdstr: string,
  ClientModulestr: string,
  userMenus: Array<UserTypes>[]
}

export interface UserTypes {
  Sno: number
  Id: number 
  Name: string
}

export interface PostMenu {
  Id: number
  Name: string
  AlternateName: string
  ParentId: number
}

export interface PostModule {
  Id: number
  IndustryId: number
  SubModuleId: string
  ModuleId: number
}