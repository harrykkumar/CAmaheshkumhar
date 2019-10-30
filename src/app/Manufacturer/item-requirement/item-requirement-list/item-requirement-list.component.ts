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
  p: number = 1
  itemsPerPage: number = 20
  total: number = 0
  lastItemIndex: number = 0
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

  getItemRequirementListData = () => {
    this._itemRequirementService.getItemRequirementData(`?Page=${this.p}&Size=${this.itemsPerPage}`).subscribe((data) => {
      console.log('list : ', data)
      this.itemRequirementListData = data
      this.total = this.itemRequirementListData[0].TotalRows
    })
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
