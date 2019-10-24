import { Component } from '@angular/core';
import { PackagingService } from '../packaging.service';
import { ToastrCustomService } from '../../../commonServices/toastr.service';
import { Settings } from '../../../shared/constants/settings.constant';
import { Subscription } from 'rxjs/Subscription';
import { CommonService } from '../../../commonServices/commanmaster/common.services';
@Component({
  selector: 'packaging-main',
  templateUrl: './packaging-main.component.html'
})
export class PackagingMainComponent {
  packetLists: Array<any> = []
  clientDateFormat = ''
  disableBtn = true
  orderPacketId: string = ''
  bOrderId: number = 0
  destroy$: Subscription
  queryStr: string = ''
  p: number = 1
  itemsPerPage: number = 20
  total: number = 0
  lastItemIndex: number = 0
  isSearching: boolean = true
  constructor (private _ps: PackagingService, private _ts: ToastrCustomService, private settings: Settings, private _cs: CommonService) {
    this.clientDateFormat = this.settings.dateFormat;
    this.destroy$ = this._ps.challanAdded$.subscribe(() => {
      this.getPacketsList()
    })
    this.destroy$ = this._ps.queryStr$.subscribe(
      (str) => {
        console.log(str)
        this.queryStr = str
        this.p = 1
        this.getPacketsList()
      }
    )
  }

  ngOnInit () {
    this.getPacketsList()
  }

  ngAfterViewInit () {
    this._cs.fixTableHF('packaging-table')
  }

  getPacketsList () {
    this.isSearching = true
    this._ps.getPacketsList('?' + this.queryStr).subscribe(
      (data) => {
        this.isSearching = false
        this.packetLists = data
        this.packetLists.forEach((element) => {
          element['checked'] = false
        })
      },
      (error) => {
        this.isSearching = false
        console.log(error)
        this._ts.showError(error, '')
      }
    )
  }

  activateChallanBtn () {
    let active = 0
    let selected = this.packetLists
      .filter((element) => element.checked)
      .map((element) => {
        return element.OrderPacketId
      })
    for (let i = 0; i < selected.length; i++) {
      if (typeof selected[i+1] !== 'undefined' && selected[i] !== selected[i+1]) {
        active = 1
        break;
      }
    }
    if (selected.length > 0 && active === 1) {
      this._ts.showError('Please select Packet belonging to same Buyer Order', '')
    }
    if (!active) {
      this.orderPacketId = (this.packetLists
      .filter((element) => element.checked).map((element) => {
        return element.Id
      })).join(',')
      this.bOrderId = selected[0]
    }
    this.disableBtn = !!active
  }

  generateChallan () {
    this._ps.openChallan({bOrderId: this.bOrderId, orderStr: this.orderPacketId})
  }

  toShowSearch = false
  toggleSearch() {
    this.toShowSearch = !this.toShowSearch
  }
}