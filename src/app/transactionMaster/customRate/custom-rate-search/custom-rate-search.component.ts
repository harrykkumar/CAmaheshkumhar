import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../../commonServices/global.service';
import { ItemmasterServices } from 'src/app/commonServices/TransactionMaster/item-master.services';
import { ToastrCustomService } from '../../../commonServices/toastr.service';
@Component({
  selector: 'custom-rate-search',
  templateUrl: './custom-rate-search.component.html'
})
export class CustomRateSearchComponent implements OnInit {
  masterData = {}
  constructor (
    private _itemmasterServices: ItemmasterServices,
    private gs: GlobalService,
    private toastrService: ToastrCustomService) {
  }

  ngOnInit () {
    this.getCategoryDetails()
  }

  getCategoryDetails() {
    let newData = [{ id: '0', text: 'Select Category' }]
    this.gs.manipulateResponse(this._itemmasterServices.getAllSubCategories(1)).subscribe(data => {
      if (data.length > 0) {
        data.forEach(element => {
          newData.push({
            id: element.Id,
            text: element.Name
          })
        })
      }
      this.masterData['categoryData'] = newData
    },
    (error) => {
      console.log(error)
      this.toastrService.showErrorLong(error, '')
    })
  }
}