import { Pipe, PipeTransform } from '@angular/core'
@Pipe({ name: 'searchByItemCustom' })
export class CustomSearchPipe implements PipeTransform {
  transform (items: any[], searchText: any): any[] {
    if (!items) return []
    if (!searchText) return items
    searchText = searchText.toLowerCase()
    return items.filter(item => { return item['ItemName'].toLowerCase().includes(searchText) })
  }
}