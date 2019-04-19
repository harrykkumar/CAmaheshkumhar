import { Component, OnInit, OnDestroy } from '@angular/core'
import { Subscription } from 'rxjs'
import { FormGroup } from '@angular/forms'
import { Select2OptionData } from 'ng2-select2'
import { UnitModel } from '../../model/sales-tracker.model'
import { CompositeUnitService } from '../../commonServices/TransactionMaster/composite-unit.services'
import { UIConstant } from '../../shared/constants/ui-constant'
import { ToastrCustomService } from '../../commonServices/toastr.service'
import { CommonService } from '../../commonServices/commanmaster/common.services'

declare const $: any
@Component({
  selector: 'app-composite-unit',
  templateUrl: './composite-unit.component.html',
  styleUrls: ['./composite-unit.component.css']
})
export class CompositeUnitComponent implements OnInit, OnDestroy {
  id: number
  select2Primary: any
  selec2Secondary: any
  submitClick: boolean
  errorMassage: string
  primaryUnitId: number
  primaryUnitQty: number
  secondaryUnitId: number
  campositeForm: FormGroup
  primearyIdError: boolean
  subUnitDetail: UnitModel[]
  secondaryUnitIdError: boolean
  packedInPlaceHolder: Select2Options
  mainUnitPlaceHolder: Select2Options
  public selectPackedIn: Array<Select2OptionData>
  public selectMainUnit: Array<Select2OptionData>
  deleteSub: Subscription
  compositeUnitAddSub: Subscription
  constructor (private _compositeUnitserivices: CompositeUnitService,
    private commonService: CommonService,
    private toastrService: ToastrCustomService) {
    this.deleteSub = this.commonService.getDeleteStatus().subscribe(
      (obj) => {
        if (obj.id && obj.type && obj.type === 'composite') {
          this.deleteItem(obj.id)
        }
      }
    )

    this.compositeUnitAddSub = this.commonService.getNewCompositeAddedStatus().subscribe(
      (obj) => {
        this.getCompositeDetail()
      }
    )
  }

  deleteItem (id) {
    if (id) {
      this._compositeUnitserivices.delteSubUnit(id).subscribe(Data => {
        if (Data.Code === UIConstant.DELETESUCCESS) {
          this.toastrService.showSuccess('Sucess', 'Deleted Successfully')
          this.commonService.closeDelete('')
          this.getCompositeDetail()
        }
        if (Data.Code === UIConstant.CANNOTDELETERECORD) {
          this.toastrService.showInfo('Info', 'Can not deleted data')
        }
      })
    }
  }

  addCompositeUnit () {
    this.commonService.openCompositeUnit('')
  }

  searchSubUnit: any

  ngOnInit () {
    this.primaryUnitQty = UIConstant.ONE
    this.id = UIConstant.ZERO
    this.getCompositeDetail()
  }

  getCompositeDetail () {
    this._compositeUnitserivices.getSubUnitDetails().subscribe(data => {
      console.log('composite data : ', data)
      if (data.Code === UIConstant.THOUSAND) {
        this.subUnitDetail = data.Data
      }
    })
  }

  editSubUnit (id) {
    this.commonService.openCompositeUnit(id)
  }
  deleteSubUnit (id) {
    this.commonService.openDelete(id, 'composite')
  }

  ngOnDestroy () {
    this.compositeUnitAddSub.unsubscribe()
  }
}
