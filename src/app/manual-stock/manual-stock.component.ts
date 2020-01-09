import { Component } from "@angular/core";
import { GlobalService } from '../commonServices/global.service';
import { Settings } from '../shared/constants/settings.constant';
import { Subscription } from 'rxjs';
import { ToastrCustomService } from '../commonServices/toastr.service';
import { ManualStockService } from './manual-stock.service';
@Component({
  selector: 'app-manual-stock',
  templateUrl: './manual-stock.component.html'
})
export class ManualStockComponent {
  items: any = []
  destroy$: Subscription[] = []
  clientDateFormat: string = ''
  queryStr: string = ''
  constructor(private _ms: ManualStockService, private _gs: GlobalService, private _settings: Settings,
    private _ts: ToastrCustomService) {
    this.clientDateFormat = this._settings.dateFormat
    this.destroy$.push(this._ms.queryStr$.subscribe(
      (str) => {
        console.log(str)
        this.queryStr = str
        this.getPreviousStock()
      }
    ))
  }

  ngOnInit() {
    this.getPreviousStock()
  }

  getPreviousStock() {
    this.destroy$.push(this._ms.getManualStock(this.queryStr).subscribe(
      (data) => {
        console.log(data)
        this.getItems(data)
      },
      (error) => {
        this._ts.showErrorLong(error, '')
      }
    ))
  }

  getItems(data) {
    this.items = []
    if (data && data.length > 0) {
      data.forEach((element) => {
        this.items.push({
          Id: element.Id,
          VerifiedOn: this._gs.utcToClientDateFormat(element.VerifiedOn, this.clientDateFormat),
          OpeningStock: element.OpeningStock,
          IsStockDisabled: element.IsStockDisabled,
          IsDateDisabled: element.IsDisabled
        })
      })
    }
    this.getOne()
  }

  getOne() {
    this.items.push({
      Id: 0,
      VerifiedOn: null,
      OpeningStock: 0
    })
  }

  validate () {
    let valid = 1
    if (+this.items[this.items.length - 1].OpeningStock > 0 && this.items[this.items.length - 1].VerifiedOn) {
      if (this.items.length > 1) {
        const date = new Date(this._gs.clientToSqlDateFormat(this.items[this.items.length - 1].VerifiedOn, this.clientDateFormat))
        for (let i = 0; i < this.items.length - 2; i++) {
          const date1 = new Date(this._gs.clientToSqlDateFormat(this.items[i + 1].VerifiedOn, 
            this.clientDateFormat))
          console.log(date.getTime(), date1.getTime(), date.getTime() === date1.getTime())
          if (date.getTime() === date1.getTime()) {
            valid = 0
          }
        }
        if (!valid) {
          this._ts.showErrorLong('Stock with the date already present', '')
          this.items[this.items.length - 1].matched = true
        }
      } else {
        valid = 1
      }
    } else {
      valid = 0
    }
    setTimeout(() => $(".errorSelecto:first").focus(), 100)
    return !!valid
  }

  save() {
    this.destroy$.push(this._ms.postManualStock(this.preparePayload()).subscribe((data) => {
      console.log(data)
      this.getPreviousStock()
      this._ts.showSuccess('Saved Successfully', '')
    },
    (error) => {
      this._ts.showErrorLong(error, '')
    }))
  }

  validateAll() {
    
    let valid = 1
    this.items.forEach(element => {
      if (!(+element.OpeningStock >=0 && element.VerifiedOn && !element.matched)) {
        if(element.VerifiedOn!==null && element.OpeningStock >=0 ){
          valid = 0
           //this._ts.showError('','Fill Date')
        }
        if(element.VerifiedOn===null && element.OpeningStock >=0 ){
          valid = 1
           //this._ts.showError('','Fill Date')
        }
       
       
      }
    });
    return !!valid
  }

  preparePayload() {
    let RequestManualStockInHands = JSON.parse(JSON.stringify(this.items))
    RequestManualStockInHands.forEach((element) => {
      element.VerifiedOn = this._gs.clientToSqlDateFormat(element.VerifiedOn, this.clientDateFormat)
    })
    return {
      RequestManualStockInHands: RequestManualStockInHands
    }
  }

  addItems() {
    this.items[this.items.length - 1]['matched'] = false
    this.getOne()
    console.log(this.items)
    this.items = JSON.parse(JSON.stringify(this.items))
    setTimeout(() => $(".errorSelecto:first").focus(), 100)
  }

  submitForm(stockItemForm) {
    stockItemForm.submitted = true
    return true
  }

  deleteItem(index) {
    this.items.splice(index, 1)
  }

  toShowSearch = false
  toggleSearch() {
    this.toShowSearch = !this.toShowSearch
  }

  ngOnDestroy() {
    if (this.destroy$ && this.destroy$.length > 0) {
      this.destroy$.forEach(element => {
        element.unsubscribe()
      })
    }
  }
}