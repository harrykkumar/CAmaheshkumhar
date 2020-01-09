export interface ledgerImportExcel {
  ImportLedgers: Array<ledgerImportDataType>
}

export interface ledgerImportDataType {
  Id: number,
  Sno: number,
  Name: string,
  ShortName: string,
  GSTType: string,
  AccountNo: string,
  CreditLimit: string,
  CreditDays: string,
  ContactNo: string,
  Email: string,
  PanNo: string,
  GstNo: string,
  OpeningBalance: string,
  CrDr: string,
  Country: string,
  State: string,
  City: string,
  Address: string,
  GlId: number
}