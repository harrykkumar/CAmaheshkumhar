import { Pipe, PipeTransform } from '@angular/core'
@Pipe({ name: 'searchByName' })
export class ItemSearchPipe implements PipeTransform {
  transform (items: any[], searchText: any): any[] {
    if (!items) return []
    if (!searchText) return items
    searchText = searchText.toLowerCase()
    return items.filter(item => { return item['NAME'].toLowerCase().includes(searchText) })
  }
}
