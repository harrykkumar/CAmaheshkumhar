import { Component, OnInit, OnDestroy } from '@angular/core'
import { Subscription } from 'rxjs'
import { UnitMasterServices } from '../../commonServices/TransactionMaster/unit-mater.services'
import { UIConstant } from '../../shared/constants/ui-constant'
import { UnitModel } from 'src/app/model/sales-tracker.model'
import { ToastrCustomService } from '../../commonServices/toastr.service'
import { CommonService } from 'src/app/commonServices/commanmaster/common.services'
declare var $: any

@Component({
  selector: 'app-unit',
  templateUrl: './unit.component.html',
  styleUrls: ['./unit.component.css']
})
export class UnitComponent implements OnInit, OnDestroy {
  unitDetail: UnitModel[]
  newUnitSub: Subscription
  deleteSub: Subscription
  constructor (private _unitmasterServices: UnitMasterServices,
    private commonService: CommonService,
    private toastrService: ToastrCustomService) {
    this.newUnitSub = this.commonService.newUnitStatus().subscribe(
      (obj) => {
        this.getUnitDetail()
      }
    )
    this.deleteSub = this.commonService.getDeleteStatus().subscribe(
      (obj) => {
        if (obj.id && obj.type && obj.type === 'unit') {
          this.deleteItem(obj.id)
        }
      }
    )
  }

  deleteItem (id) {
    if (id) {
      this._unitmasterServices.delteUnit(id).subscribe(Data => {
        if (Data.Code === UIConstant.DELETESUCCESS) {
          this.toastrService.showSuccess('Success', 'Deleted Successfully')
          this.commonService.closeDelete('')
          this.getUnitDetail()
        }
        if (Data.Code === UIConstant.CANNOTDELETERECORD) {
          this.toastrService.showInfo('Info', 'Can not deleted')
          this.commonService.closeDelete('')
          this.getUnitDetail()
        }
      })
    }
  }

  ngOnInit () {
    this.getUnitDetail()
  }

  private getUnitDetail () {
    this._unitmasterServices.getUnitDetail().subscribe(data => {
      console.log('unit data : ', data)
      if (data.Code === UIConstant.THOUSAND && data.Data) {
        this.unitDetail = data.Data
      }
    })
  }

  addunit () {
    this.commonService.openUnit('')
  }

  ngOnDestroy () {
    this.newUnitSub.unsubscribe()
    this.deleteSub.unsubscribe()
  }

  editunit (unitId) {
    this.commonService.openUnit(unitId)
  }

  deleteUnit (id) {
    this.commonService.openDelete(id, 'unit')
  }

}
