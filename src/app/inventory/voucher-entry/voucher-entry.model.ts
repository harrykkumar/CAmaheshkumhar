export interface VoucherAddModel {
  Id: number,
  OrgId: number,
  VoucherType: number,
  VoucherNo: string,
  ParentId: number,
  PartyId: number,
  TotalAmount: number,
  VoucherDate: string,
  VoucherDatas: Array<VoucherData>,
  PaymentDetails: Array<VoucherTransaction>,
  IsIncomeExpence?:number
  IsGroupTransaction?: number
}

export interface VoucherTransaction {
  Id: number,
  PayModeId: number,
  Paymode: string,
  PayDate: string,
  Amount: number,
  LedgerId: number,
  BankLedgerName: string,
  ChequeNo: string
}

export interface VoucherData {
  Id: number,
  BillNo: string,
  Amount: number,
  PaymentAmount: number
  BillAmount: string
  Balance: number
  BalanceType: number
  BillDate: string
  FromDate: string
  NoOfBill: number
  PaidAmount: number
  ToDate: string
  Years: number
  selected: boolean
}