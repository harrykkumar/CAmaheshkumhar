
export interface LoginModel {
  customerId: any
  username: any
  password: any
}
export interface OtpModel {
  ParentId: number
  ParentTypeId: number
  MobileNo: number
  Code: number
  EmailId: string
}
export interface CatagoryDetailModel {
  Id: string
  Name: string
  ParentId: number
  UnderCategory: string
  TotalRows: number
}

export interface SaveCategoryModel {
  CategoryName: string
  Id: number
  ParentId: number
  ShortName: string
}

export interface ItemModel {
  Name?: string
  BrandIds?: string
  IsVolumeDiscountApply?: number
  IsTradeDiscountApply?: number
  IsNotDiscountable?: number
  PackingType?: number
  TaxId?: number
  UnitId?: number
  CategoryId?: number
  ItemType?: number
  BarCode?: string
  Nrv?: number
  ItemName?: string
  Id?: number
  ItemCode?: string
  HsnNo?: string
  SaleRate?: number
  PurchaseRate?: number
  MrpRate?: number
  OurPrice?: number
  OpeningStock?: number
  OpeningStockValue?: number
  MaxStock?: number
  MinStock?: number
  ReOrderQty?: number
  TotalRows?: number
}

export interface UnitModel {
  id: number
  subUnitId: any
  name: string
  SubUnitQty: number
  Id: number
  IsPrimaryUnit: boolean
  UnitName: string
  IsBaseUnit: boolean
  secondaryUnitQty: any
  PrimaryUnitQty: any
  SubUnitName: string
  mainUnitName: string
  secondaryUnitId: any
  primaryUnitId: any
  isPrimaryUnit: boolean
  MainUnitId: number
  TotalRows: number
}

export interface CompositeUnit {
  Id: number,
  Name: string,
  MainUnitId: number,
  SubUnitId: number,
  PrimaryUnitQty: number,
  SubUnitQty: number
}

export interface TaxModal {
  typeName: string
  strColumns: string
  taxRates: string
  slab: string
  type: any
  clientId: number
  branchId: number
  officeId: number
  id: number
}

export interface TaxModule {
  Id: number
  Slab: string
  taxrates: Taxrate[]
}

export interface Taxrate {
  valueType: number
  isForOtherState: boolean
  taxRate: number
  name: string
  slabId: number

  Rate: number
  ValueType: number
  Name: string
  Isforotherstate: number
}
export interface Ledger {
  GstinNo: string
  CustomerType: string
  accountNo: string
  contactInfo: string
  ContactPersonName: string
  creditLimit: number
  customerType: string
  customerTypeId: number
  emails: string
  glId: number
  glName: string
  id: number
  isActive: boolean
  isPrimary: Number
  Name: string
  officeId: number
  shortName: string
  statutories: string
  strAddressColumns: string
  strContactInfoColumns: string
  strContactPersonColumns: string
  strEmailColumns: string
  strStatutoryColumns: string
  strWebsiteColumns: string
  taxType: string
  taxTypeId: string
  websites: string
  TotalRows?: number
}

export interface AddLedger {
  IsTradeDiscountable: boolean
  IsVolumeDiscountable: boolean
  IsCashDiscountable: boolean
  CustomerTypeId: number
  CreditDays: number,
  CreditLimit: number
  OpeningAmount: number
  Id: number
  GlId: number
  Websites: any[]
  Name: string
  Banks: Banks[]
    // ContactPersons: ContactPerson;
    // Code:string;
  IsRcm: boolean
  TaxTypeID: number
  IsMsmed: boolean
    // CreditDays:number
  CrDr: number
  Statutories: Statutories[]
  ContactPersons: ContactPersons[]
  ContactInfos: any
  Emails: any
  Addresses: Addresses[]
}

export interface Statutories {
  Id: number
  PanNo: string
  GstinNo: string
  ParentTypeId: number
    // "TypeId":"1",
    // "ParentId" : "1",
    // "ParentTypeId" :"5"
}
export interface ContactPersons {
  Id: number
  Name: string
  DOB: string
  DOA: string
  ParentTypeId: number
  TypeId: any
}

export interface Addresses {
  Id: number
  AddressValue: string
  ParentTypeId: number
  AddressType: number
  CountryId: number
  StateId: number
  AreaId: number
  PostCode: number
  CityId: number
}

export interface Banks {
  Name: string
  AcNo: string
  Branch: string
  MicrNo: string
  IfscCode: string
  ParentTypeId: number

}

export interface ContactpersonIno {
  contactType: any
  contactNo: any
}

export interface ImportExportSale {
  Id: number,
  travelImports: any
  travelImportTaxes: any
}

export interface SaleTravel {
  BillAmount: number
  BillDate: string
  BillNo: string
  Cess: number
  CessAmount: number
  CommisionValue: number
  Commission: string
  CommissionType: number
  ConvertedAmount: number
  CurrencyId: number
  CurrencyRate: number
  CustomerName: string
  Discount: number
  EwayBillNo: number
  Finyear: number
  Freight: number
  FreightMode: number
  Id: number
  LedgerId: number
  NoOfChallan: number
  OrgId: number
  OtherCharge: number
  QuatationId: number
  ReferId: number
  ReferType: number
  Remark: string
  ReversCharge: number
  ReversTax: number
  RoundOff: number
  SNO: number
  SupplierName: string
  TaxAmount: number
  TicketNo: string
  TotalAmount: number
  TotalRows?: number
}

export interface AddCust {
  open: boolean
  name?: string
  id?: any
  isSubCat?: boolean
  catId?: any
  type?: string
  editId?: string
  parentId?: any
  images?: string[]
  queue?: any[]
  safeUrls?: string[]
  baseImages?: number[]
  isSubAttr?: any
  status?: string
  ledgerId?: number
  categoryId?: number
  unitId?: number
  taxId?: number
  level?: number
  data?: any
  challanNos?: any
  AttributeId?: any
  isAddNew?: boolean
}

export interface ResponseSale {
  Message: string,
  Code: number,
  Description: string
  Data: any
}

export interface ResponseCategory {
  name?: string,
  parentId?: number,
  underCategory?: string,
  clientId?: number,
  branchId?: number,
  officeId?: number,
  id?: number,
  createdOn?: string,
  modifiedOn?: string,
  createdIp?: string,
  modifiedIp?: string,
  createdBy?: number,
  modifiedBy?: number,
  isActive?: boolean,
  totalRows?: number,
  shortName?: string
}

export interface ResponseUnit {
  name ?: string,
  isBaseUnit ?: true,
  clientId ?: number,
  branchId ?: number,
  officeId ?: number,
  id ?: number,
  createdOn ?: string,
  modifiedOn ?: string,
  createdIp ?: string,
  modifiedIp ?: string,
  createdBy ?: number,
  modifiedBy ?: number,
  isActive ?: boolean,
  totalRows ?: number
}

export interface ResponseSubUnit {
  subUnitName ?: string,
  mainUnitName ?: string,
  name ?: string,
  primaryUnitId ?: number,
  secondaryUnitId ?: number,
  primaryUnitQty ?: number,
  secondaryUnitQty ?: number,
  clientId ?: number,
  branchId ?: number,
  officeId ?: number,
  id ?: number,
  createdOn ?: string,
  modifiedOn ?: string,
  createdIp ?: string,
  modifiedIp ?: string,
  createdBy ?: number,
  modifiedBy ?: number,
  isActive ?: boolean,
  totalRows ?: number,
  shortName ?: string
}

export interface SalesTourism {
  Id: number
  BillNo: string
  clientName ?: number
  BillDate ?: string
  ReturnBillDate?: string
  BookingNo ?: string
  LpoNo ?: string
  CurrencyId: number
  Commission ?: number
  OtherCharge ?: number
  RoundOff ?: number
  CessAmount ?: number
  travelImports: TravelImports[]
  travelPayments ?: TravelPayments[]
}

export interface SalesReturnTourism {
  Id: number
  ReturnBillNo?: string
  clientName ?: number
  BillDate ?: string
  ReturnBillDate?: string
  BookingNo ?: string
  LpoNo ?: string
  CurrencyId: number
  Commission ?: number
  OtherCharge ?: number
  RoundOff ?: number
  CessAmount ?: number
  travelImports: TravelImports[]
  travelPayments ?: TravelPayments[]
}

export interface TravelImports {
  Id: number,
  Sno: number,
  SupplierId: number,
  TicketNo: string,
  RoutingId: number,
  Remark: string,
  Date: string,
  ReturnDate ?: string,
  Fare: number,
  Discount ?: number,
  discountAmount ?: number,
  TaxAmount ?: number,
  ReIssueCharges ?: number,
  RefundPanelty ?: number,
  Miscellaneouse ?: number,
  Company ?: string,
  LangiTax ?: number,
  SvcFee ?: number,
  Commission ?: number,
  CommissionAmount ?: number,
  Comm ?: number,
  Commtoauthorizor ?: number,
  CommissionType ?: number,
  DiscountType ?: number,
  TotalAmount ?: number,
  routingName ?: string,
  supplierName ?: string,
  TaxType: string,
  selected?: boolean,
  SaleTransId?: number
}

export interface TravelPayments {
  Id: number,
  Sno: number,
  Paymode: string,
  PayModeId: number,
  LedgerId: number,
  ledgerName: string,
  Amount: number,
  PayDate: string,
  ChequeNo: string
}

export interface CourierParcelItem {
  Id: number,
  Sno: number,
  UnitId: number,
  Description: string,
  UnitPrice: number
  Quantity: number,
  TotalAmount: number
}

export interface SaleCourierParcel {
  Id: 0
  BillNo: string
  SenderId: number
  ReceiverId: number
  InvoiceDate: string
  CurrencyId: number
  EwayBillNo: string
  Destination?: number
  ParcelBy: number
  ParcelHeight: number
  ParcelLength: number
  ParcelWidth: number
  TotalWeight: number
  OtherCharge?: number
  Customduty?: number
  TotalBox: number
  BoxCharge: number
  TotalKg: number
  Rate: number
  BillAmount: number
  RoundOff: number
  Items: CourierParcelItem[]
  PaymentDetail?: TravelPayments[]
}

export interface ImportExportItem {
  ItemImport?: any
  ImportItems?: any
}

export interface Image {
  images: string[]
  queue: any[]
  safeUrls: string[]
  baseImages: number[]
  id?: number[]
}

export interface ItemMasterAdd {
  Id: number
  CategoryId: number
  Name: string
  HsnNo: string
  ItemCode: string
  UnitId: number
  TaxId: number
  ItemType: number
  PackingType: number
  MrpRate?: number
  SaleRate?: number
  OurPrice?: number
  Nrv?: number
  MinStock?: number
  MaxStock?: number
  ReOrderQty?: number
  BarCode?: string
  PurchaseRate?: number
  OpeningStock?: number
  BrandIds?: string
  IsNotDiscountable?: boolean
  IsVolumeDiscountApply?: boolean
  IsTradeDiscountApply?: boolean
  ImageFiles?: Array<Object>[]
}

export interface PurchaseItem {
  TransType: number
  TransId: number
  ChallanId: number
  CategoryId: number
  ItemId: number
  UnitId: number
  Length: number
  Height: number
  Width: number
  Quantity: number
  SaleRate: number
  MrpRate: number
  PurchaseRate: number
  TaxSlabId: number
  TaxType: number
  TaxAmount: number
  DiscountType: number
  Discount: number
  DiscountAmt: number
  ExpiryDate: string
  MfdDate: string
  BatchNo: string
  Remark: string
  Id: number
  Sno: number
  itemName: string
  categoryName: string
  unitName: string
  taxSlabName: string
  taxTypeName: string
  SubTotal: number
  itemAttributeTrans?: Array<PurchaseAttribute>
  taxRates: Array<any>
  taxSlabType: number
}

export class PurchaseAttribute {
  ItemId: number
  ItemTransId: number
  AttributeId: number
  ParentTypeId: number
  name: string
  id: number
}

export class PurchaseTransaction {
  Paymode: string
  PayModeId: number
  LedgerId: number
  Amount: number
  BankLedgerName: string
  ChequeNo: string
  PayDate: string
  Id: number
  Sno: number
}

export class PurchaseAdd {
  ReferralCommissionTypeId: number
  ReferralCommission: number
  PaymentDetail: Array<PurchaseTransaction>
  Items: Array<PurchaseItem>
  BillAmount: number
  BillDate: string
  PartyBillDate: string
  PartyBillNo: string
  BillNo: string
  ConvertedAmount: number
  CurrencyRate: number
  TotalDiscount: number
  Freight: number
  FreightMode: number
  Id: number
  PartyId: number
  ReferralId: number
  ReferralTypeId: number
  ReferralComission: number
  ReferralComissionTypeId: number
  ReverseCharge: number
  ReverseTax: number
  CessAmount: number
  RoundOff: number
  SubTotalAmount: number
  TotalTaxAmount: number
  TotalChallan: number
  VehicleNo: string
  Drivername: string
  Transportation: string
  TotalQty: number
  OtherCharge: number
  GodownId: number
  CurrencyId: number
  OrgId: number
  InterestRate: number
  InterestAmount: number
  InterestType: number
  DueDate: string
  OrderId: number
  Advanceamount: number
  NetAmount: number
  AddressId: number
  ConvertedCurrencyId: number
  ItemAttributeTrans: Array<PurchaseAttribute>
}
