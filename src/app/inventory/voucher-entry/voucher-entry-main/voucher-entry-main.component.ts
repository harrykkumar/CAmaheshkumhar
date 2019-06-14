import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { UIConstant } from "src/app/shared/constants/ui-constant";
import { ActivatedRoute } from '@angular/router';
import { Subject, throwError } from 'rxjs';
import { takeUntil, filter, catchError, map } from 'rxjs/operators';
import { CommonService } from '../../../commonServices/commanmaster/common.services';
import { VoucherEntryServie } from '../voucher-entry.service';
import { PurchaseService } from '../../purchase/purchase.service';

@Component({
  selector: 'voucher-entry-main',
  templateUrl: './voucher-entry-main.component.html'
})

export class VoucherEntryMainComponent implements OnInit {
  toShowSearch = false
  title: string = ''
  onDestroy$ = new Subject()
  constructor (private _formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private commonService: CommonService,
    private voucherService: VoucherEntryServie,
    private purchaseService: PurchaseService) {
    this.formSearch()
    this.getOrgList()
  }

  ngOnInit () {
    this.route.data.pipe(takeUntil(this.onDestroy$)).subscribe(data => {
      this.title = data.title
    })
  }

  toggleSearch () {
    this.toShowSearch = !this.toShowSearch
  }

  @ViewChild('searchData') searchData: ElementRef
  searchForm: FormGroup
  private formSearch () {
    this.searchForm = this._formBuilder.group({
      'searchKey': [UIConstant.BLANK]
    })
  }

  openVoucher () {
    this.commonService.openVoucher('')
  }

  getOrgList () {
    this.voucherService.getOwnerOrgList().pipe(takeUntil(this.onDestroy$), filter(data => {
      if (data.Code === UIConstant.THOUSAND) { return true } else { console.log(data); throw new Error(data.Description) }
    }), catchError(error => { return throwError(error) }), map(data => data.Data)).subscribe(
      data => {
        console.log('org : ', data)
        this.purchaseService.createOrganisations(data)
      }
    )
  }
}
