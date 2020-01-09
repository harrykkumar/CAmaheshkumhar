
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
  UnitCode?: any
  MeasurementId?:any
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
  ShortName:string
  CreditLimit: number
  OpeningAmount: number
  IsChargeLedger:any
  Id: number
  GlId: number
  Websites: any[]
  Name: string
  Banks: Banks[]
  IsRcm: boolean
  TaxTypeID: number
  IsMsmed: SVGAnimatedBoolean
  CrDr: number
  Statutories: Statutories[]
  Addresses: Addresses[]
  ContactPersons: ContactPersons[]
  ContactInfos: any
  Emails: any
  RCMType: any
  ITCType: any
  TaxSlabId: any
  HsnNo: any
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
  gstinNo:string
  TaxTypeID: string
  Statutories: Statutories[]
  Addresses: Addresses[]

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
  isParent?: boolean
  title?: string
  isViewPrint?: string
  isOtherCharge?: any
  stateId?:any
  date?:any
  toDate?:any
  fromDate?:any
  batchNo?:any
  itemId?:any
  imageType?:string
  headId?:any
  gstType?:any
  discountParam?:any
  editData?:any
  code?: any
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
  AirlineTicketCode?:string,
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
  imageType?:string
  type?:String
}
export interface ServiceItemAdd {
  Id: number
  Name: string
  HsnNo: string
  ItemCode: string
  TaxId: number
  ItemType: number
  PackingType: number
  SaleRate?: number
  BarCode?: string
  ImageFiles?: Array<Object>[]
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
  ItemAttributeTrans?: Array<PurchaseAttribute>[]
  ItemTransactions?: Array<ComboItem>[]
  ItemAttributewithRate?: Array<any>
  ItemPropertyTrans?:any
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
  TotalRate: number
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
  taxSlabType: number
  AmountItem: number
  taxRates: any
  itemTaxTrans?: Array<ItemTaxTrans>
  IsNotDiscountable?:boolean
  selected?:boolean
  ReturnQuantity?:number
  fixPurchaseRate?:number
  SaleTransId?:number
  AmountItemBillDiscount?:any
  isDisabled:boolean
  SpItemUtilities:any
  SrNo:any
  ItemPropertyTrans :any

}

export interface SaleReturnItems {
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
  TotalRate: number
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
  taxSlabType: number
  AmountItem: number
  taxRates: any
  itemTaxTrans?: Array<ItemTaxTrans>
  selected?:boolean
  ReturnQuantity?:number
  fixSaleRate?:number
  SaleTransId?:number
  isDisabled:boolean
}

export interface ComboItem {
  ItemId: number
  UnitId: number
  Quantity: number
  SaleRate: number
  MrpRate: number
  PurchaseRate: number
  Id: number
  Sno: number
  TransId?: number
  itemName: string
  unitName: string
  itemAttributeTrans?: Array<PurchaseAttribute>
}

export class PurchaseAttribute {
  ItemId: number
  ItemTransId: number
  AttributeId: number
  ParentTypeId: number
  name: string
  id: number
  GroupId?: number
  Sno: number
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
  isEditable:boolean
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
  AdditionalCharges: Array<AdditionalCharges>
  ItemTaxTrans: Array<ItemTaxTrans>
}
export class AddLedgerGroup {
  Id: number
  GlName:string
  UnderId:number
  IsLedger:boolean
  ShortName:string
}

export class AdditionalCharges {
  Id: number
  Sno: number
  LedgerChargeId: number
  LedgerName: string
  AmountCharge: number
  TaxSlabChargeId: number
  TaxChargeName: string
  TaxAmountCharge: number
  TotalAmountCharge: number
  TaxTypeCharge: number
  taxChargeSlabType: number
  taxTypeChargeName: string
  taxChargeRates: any
  itemTaxTrans: Array<ItemTaxTrans>
  TaxableAmountCharge: number
  isEditable:boolean
}

export class ItemTaxTrans {
  id: number
  TaxTypeTax: number
  AmountTax: number
  ItemTransTaxId: number
  ParentTaxId: number
  ParentTypeTaxId: number
  ItemTransTypeTax: number
  TaxRateNameTax: string
  TaxRateId: number
  TaxRate: number
  ValueType: number
  TaxSlabName: string
  Sno: number
}

export interface ServiceBilling {
  TransType: number
  TransId: number
  ChallanId: number
  CategoryId: number
  ItemId: number
  Quantity: number
  SaleRate: number
  TotalRate: number
  TaxSlabId: number
  TaxType: number
  TaxAmount: number
  DiscountType: number
  Discount: number
  DiscountAmt: number
  Remark: string
  Id: number
  Sno: number
  itemName: string
  taxSlabName: string
  taxTypeName: string
  SubTotal: number
  taxSlabType: number
  AmountItem: number
  taxRates: any
  itemTaxTrans?: Array<ItemTaxTrans>,
  AmountItemBillDiscount:any
  isDisabled:boolean
  SrNo:any

}

//selected

export class ServiceBillingAdd {
  PaymentDetail: Array<PurchaseTransaction>
  Items: Array<ServiceBilling>
  BillAmount: number
  BillDate: string
  PartyBillDate: string
  PartyBillNo: string
  BillNo: string
  ConvertedAmount: number
  CurrencyRate: number
  TotalDiscount: number
  Id: number
  PartyId: number
  ReverseTax: number
  CessAmount: number
  RoundOff: number
  SubTotalAmount: number
  TotalTaxAmount: number
  TotalQty: number
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
  AdditionalCharges: Array<AdditionalCharges>
  ItemTaxTrans: Array<ItemTaxTrans>
  TransBankId:any


}


export interface saleReturnItem {
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
  TotalRate: number
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
  taxSlabType: number
  AmountItem: number
  taxRates: any
  itemTaxTrans?: Array<ItemTaxTrans>
  selected?:boolean
}

export class SaleReturnRequestAdd {
  ReferralCommissionTypeId: number
  ReferralCommission: number
  PaymentDetail: Array<PurchaseTransaction>
  Items: Array<PurchaseItem>
  BillAmount: number
  BillDate: string
  PartyBillDate: string
  PartyBillNo: string
  BillNo: string
  CurrentDate:string
  ConvertedAmount: number
  CurrencyRate: number
  TotalDiscount: number
  Id: number
  SaleId:number
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
  AdditionalCharges: Array<AdditionalCharges>
  ItemTaxTrans: Array<ItemTaxTrans>
}
export class PurchaseReturnAdd {
  ReferralCommissionTypeId: number
  ReferralCommission: number
  PaymentDetail: Array<PurchaseTransaction>
  Items: Array<PurchaseItem>
  BillAmount: number
  BillDate: string
  PartyBillDate: string
  PartyBillNo: string
  BillNo: string
  CurrentDate:string
  ConvertedAmount: number
  CurrencyRate: number
  TotalDiscount: number
  Id: number
  PurchaseId:number
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
  AdditionalCharges: Array<AdditionalCharges>
  ItemTaxTrans: Array<ItemTaxTrans>
}
export class SaleDirectAdd {
  ReferralCommissionTypeId: number
  ReferralCommission: number
  PaymentDetail: Array<PurchaseTransaction>
  Items: Array<SaleDirectItem>
  BillAmount: number
  BillDate: string
  PartyBillDate: string
  PartyBillNo: string
  BillNo: string
  ConvertedAmount: number
  CurrencyRate: number
  TotalDiscount: number
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
  AdditionalCharges: Array<AdditionalCharges>
  ItemTaxTrans: Array<ItemTaxTrans>
  SupplyStateId:any
  TransBankId:any
  ItemPropertyTrans:any

}
export class SaleBillingAdd {
  ReferralCommissionTypeId: number
  ReferralCommission: number
  PaymentDetail: Array<PurchaseTransaction>
  Items: Array<SaleDirectItem>
  BillAmount: number
  BillDate: string
  PartyBillDate: string
  PartyBillNo: string
  BillNo: string
  ConvertedAmount: number
  CurrencyRate: number
  TotalDiscount: number
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
  AdditionalCharges: Array<AdditionalCharges>
  ItemTaxTrans: Array<ItemTaxTrans>
  SupplyStateId:any

}
export interface SaleDirectItem {
  AmountItemBillDiscount: number;
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
  TotalRate: number
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
  taxSlabType: number
  AmountItem: number
  taxRates: any
  itemTaxTrans?: Array<ItemTaxTrans>
  selected?:boolean
  ReturnQuantity?:number
  fixPurchaseRate?:number
  SaleTransId?:number
  isDisabled?:boolean
  IsNotDiscountable?:boolean
  perItemDiscount?:number
  customRate?:number
  SpItemUtilities:any
  SrNo:any,
  ItemPropertyTrans:any

}

export interface SaleBilingItem {
  AmountItemBillDiscount: number;
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
  TotalRate: number
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
  taxSlabType: number
  AmountItem: number
  taxRates: any
  itemTaxTrans?: Array<ItemTaxTrans>
  selected?:boolean
  ReturnQuantity?:number
  fixPurchaseRate?:number
  SaleTransId?:number
  isDisabled?:boolean
  subUnitsValue?:any
  itemValue?:any
  SrNo:any
}
