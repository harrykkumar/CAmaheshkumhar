import { AddStyleComponent } from './../add-style/add-style.component';
import { CommonService } from 'src/app/commonServices/commanmaster/common.services';
import { ToastrCustomService } from 'src/app/commonServices/toastr.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { StyleService } from '../style.service';
import { Subject } from 'rxjs/internal/Subject';
import * as _ from 'lodash'
import { ManufacturingService } from '../../manufacturing.service';
@Component({
  selector: 'app-style-list',
  templateUrl: './style-list.component.html',
  styleUrls: ['./style-list.component.css']
})
export class StyleListComponent implements OnInit {
  model: any = {}
  lastItemIndex: number = 0
  pageSize: number = 20
  pageNo: number = 1
  totalItemSize: number = 0
  styleListData: Array<any> = []
  private unSubscribe$ = new Subject<void>()

  constructor(private _styleService: StyleService,
    public _commonService: CommonService,
    private _toastService: ToastrCustomService,
    private _ms: ManufacturingService) {
    this._ms.styleAdd$.subscribe((data: any) => {
      this.getStyleListData()
    })
  }
  ngOnInit() {
    this.getStyleListData()
  }

   getStyleListData = async () => {
    const data = {
      Page: this.pageNo,
      Size: this.pageSize
    }
     this.styleListData = await this._styleService.getStyleNumberListData(data)
     if (!_.isEmpty(this.styleListData) && this.styleListData.length >= 1) {
       this.totalItemSize = this.styleListData[0].TotalRows;
     }
  }

  onPageNoChange = (event) => {
    this.pageNo = event
    this.getStyleListData()
  }

  onPageSizeChange = (event) => {
    this.pageSize = event
    this.getStyleListData()
  }

  onLastValueChange = (event) => {
    this.lastItemIndex = event
  }

  ngOnDestroy(): void {
    this.unSubscribe$.next()
    this.unSubscribe$.complete()
  }

  openStyle(item?){
    this._ms.openStyle(item, false);
  }

  onModalClosed(event){
    this.getStyleListData()
  }

  deletStyle(item) {
    this._styleService.deleteStyle(item.Id).subscribe((res) => {
      if (res.Code === 5015) {
        this._toastService.showSuccess('Success', 'Style Deleted Successfully')
        this.getStyleListData()
      } else {
        this._toastService.showError('Error', res.Message)
      }
    })
  }

}
