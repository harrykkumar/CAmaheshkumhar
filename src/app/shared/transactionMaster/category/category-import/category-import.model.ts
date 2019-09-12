export interface CategoryImportExcel {
  Importcategories: Array<categoryImportDataType>
}

export interface categoryImportDataType {
  Id: number,
  Sno: number,
  Name: string,
  ParentName: string
}