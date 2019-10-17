import { Component } from '@angular/core';
import { PackagingService } from '../packaging.service';
import { ToastrCustomService } from '../../../commonServices/toastr.service';
import { Settings } from '../../../shared/constants/settings.constant';
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
  constructor (private _ps: PackagingService, private _ts: ToastrCustomService, private settings: Settings) {
    this.clientDateFormat = this.settings.dateFormat;
    this._ps.challanAdded$.subscribe(() => {
      this.getPacketsList()
    })
  }

  ngOnInit () {
    this.getPacketsList()
  }

  getPacketsList () {
    this._ps.getPacketsList().subscribe(
      (data) => {
        if (data.length > 0) {
          this.packetLists = data
          this.packetLists.forEach((element) => {
            element['checked'] = false
          })
        }
      },
      (error) => {
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
}