import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { UIConstant } from "src/app/shared/constants/ui-constant";
import { ActivatedRoute } from '@angular/router';
import { Subject, throwError } from 'rxjs';
import { takeUntil, filter, catchError, map } from 'rxjs/operators';
import { CommonService } from '../../../commonServices/commanmaster/common.services';
import { VoucherEntryServie } from '../voucher-entry.service';
import { PurchaseService } from '../../purchase/purchase.service';
import { ToastrCustomService } from 'src/app/commonServices/toastr.service';

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
    private purchaseService: PurchaseService,
    private toastrService: ToastrCustomService) {
    this.formSearch()
    this.getVoucherSetting()
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
  getVoucherSetting () {
    let _self = this
    this.commonService.getModuleSettings(UIConstant.VOUCHER_TYPE)
    .pipe(
      takeUntil(this.onDestroy$),
      filter(data => {
        if (data.Code === UIConstant.THOUSAND) {
          return true
        } else {
          throw new Error(data.Description)
        }
      }),
      catchError(error => {
        return throwError(error)
      }),
      map(data => data.Data)
    )
    .subscribe(
      (data) => {
        // console.log('settings data : ', data)
        _self.purchaseService.getAllSettings(data)
      },
      (error) => {
        console.log(error)
        this.toastrService.showError(error, '')
      },
      () => {
      }
    )
  }

  ngOnDestroy(): void {
    this.onDestroy$.next()
    this.onDestroy$.complete()
  }
}
