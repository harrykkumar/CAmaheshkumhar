import { Settings } from './../../../shared/constants/settings.constant';
import { ItemRequirementComponent } from './../item-requirement/item-requirement.component';
import { ToastrCustomService } from './../../../commonServices/toastr.service';
import { CommonService } from 'src/app/commonServices/commanmaster/common.services';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { ItemRequirementService } from '../item-requirement.service';
import * as _ from 'lodash'
import { GlobalService } from 'src/app/commonServices/global.service';

@Component({
  selector: 'app-item-requirement-list',
  templateUrl: './item-requirement-list.component.html',
  styleUrls: ['./item-requirement-list.component.css']
})
export class ItemRequirementListComponent implements OnInit {
  @ViewChild('addItemRequirementRef') addItemRequirementRef: ItemRequirementComponent
  model: any ={}
  lastItemIndex: number = 0
  pageSize: number = 20
  pageNo: number = 1
  totalItemSize: number = 0
  itemRequirementListData: Array<any> = []
  clientDateFormat: string = ''
  private unSubscribe$ = new Subject<void>()

  constructor( private _itemRequirementService: ItemRequirementService,
    public _commonService: CommonService,
    private _toastService: ToastrCustomService,
    private gs: GlobalService,
    private _settings: Settings
    ) {
      this.clientDateFormat = this._settings.dateFormat
    }
  ngOnInit() {
    this.getItemRequirementListData()
  }

   getItemRequirementListData = async () => {
    const data = {
      Page: this.pageNo,
      Size: this.pageSize
    }
     this.itemRequirementListData = await this._itemRequirementService.getItemRequirementListData(data)
     if (!_.isEmpty(this.itemRequirementListData) && this.itemRequirementListData.length >= 1) {
       this.totalItemSize = this.itemRequirementListData[0].TotalRows;
     }
   }

  onPageNoChange = (event) => {
    this.pageNo = event
    this.getItemRequirementListData()
  }

  onPageSizeChange = (event) => {
    this.pageSize = event
    this.getItemRequirementListData()
  }

  onLastValueChange = (event) => {
    this.lastItemIndex = event
  }

  ngOnDestroy(): void {
    this.unSubscribe$.next()
    this.unSubscribe$.complete()
  }

  addItemRequirement(item?){
    this.addItemRequirementRef.openModal(item);
  }
  onModalClosed(event){
    this.getItemRequirementListData()
  }

  deleteItemRequirement(item) {
    this._itemRequirementService.deleteItemRequirement(item).subscribe((res) => {
      if (res.Code === 5015) {
        this._toastService.showSuccess('Success', 'Item Requirement Successfully')
        this.getItemRequirementListData()
      } else {
        this._toastService.showError('Error', res.Message)
      }
    })
  }

}
