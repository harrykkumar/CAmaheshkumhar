import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core'

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PagingComponent implements OnInit {
  itemsPerPage: number = 20
  pageSizes: Array<number> = []
  lastItemIndex: number = 0
  @Output() lastValueEmitter = new EventEmitter<number>()
  @Output() pageNoEmitter = new EventEmitter<number>()
  @Output() pageSizeEmitter = new EventEmitter<number>()
  // @Input() p: number = 1
  p: number = 1
  ngOnInit (): void {
    this.pageSizes.push(5)
    this.pageSizes.push(10)
    this.pageSizes.push(20)
    this.pageSizes.push(50)
  }

  onPageChange (pageNo) {
    this.pageNoEmitter.emit(pageNo)
    this.lastItemIndex = (pageNo - 1) * this.itemsPerPage
    this.lastValueEmitter.emit(this.lastItemIndex)
  }

  onChangePageSize (evt) {
    this.pageSizeEmitter.emit(evt)
    this.lastItemIndex = (this.p - 1) * evt
    this.lastValueEmitter.emit(this.lastItemIndex)
  }

  setPage (pageNo) {
    this.p = pageNo
    this.onPageChange(pageNo)
  }
}
