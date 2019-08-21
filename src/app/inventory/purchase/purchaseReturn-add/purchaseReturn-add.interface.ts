export class PurchaseItems {
  CategoryId: number
  Item: number
  Qty?: number
  Length?: number
  Height?: number
  Width?: number
  Discount: number
  DiscountType: number
  TaxSlab: number
  TaxType: number
  Attributes: Array<any>
  SaleRate: number
  PurchaseRate: number
  BatchNo?: string | number
  MfdRate: string
  ExpiryDate?: string
  SubTotal: number
}
