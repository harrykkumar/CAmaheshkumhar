import { Pipe, PipeTransform } from '@angular/core'
@Pipe({ name: 'searchForItemName' })
export class OpeningStockSearchPipe implements PipeTransform {
  transform (items: any[], searchText: any): any[] {
    if (!items) return []
    if (!searchText) return items
    searchText = searchText.trim().toLowerCase()
    return items.filter(item => { return item['ItemName'].trim().toLowerCase().includes(searchText) })
  }
}
