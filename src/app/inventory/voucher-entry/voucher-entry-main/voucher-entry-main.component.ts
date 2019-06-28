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
import { FormConstants } from '../../../shared/constants/forms.constant';
declare const $: any
@Component({
  selector: 'voucher-entry-main',
  templateUrl: './voucher-entry-main.component.html'
})

export class VoucherEntryMainComponent implements OnInit {
  toShowSearch = false
  title: string = ''
  printData = []
  onDestroy$ = new Subject()
  constructor (private _formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private commonService: CommonService,
    private voucherService: VoucherEntryServie,
    private purchaseService: PurchaseService,
    private toastrService: ToastrCustomService) {
    this.formSearch()
    this.getVoucherSetting()

    this.commonService.getActionClickedStatus().subscribe(
      (action: any) => {
        if (action.type === FormConstants.Print && action.formname === FormConstants.VoucherForm) {
          this.onPrintButton(action.id, action.printId)
        }
      }
    )
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

  onPrintButton (id, htmlID) {
    let _self = this
    this.voucherService.printReceiptPayment({id: id})
    .pipe(
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
    ).subscribe(
      data => {
        console.log('print data : ', data)
        _self.printData = data
        setTimeout(function () {
          _self.printComponent(htmlID)
        }, 1000)
      },
      (error) => {
        console.log(error)
        _self.toastrService.showError(error, '')
      },
      () => {
      }
    )
  }

  printComponent (cmpName) {
    let title = document.title
    let divElements = document.getElementById(cmpName).innerHTML
    let printWindow = window.open('', '_blank', '')
    printWindow.document.open()

    printWindow.document.write('<html><head><title>' + title + `
    </title><style>
    .clearfix:after{content:"";display:table;clear:both}a{color:#0087C3;text-decoration:none}
    body{position:relative;width:21cm;height:29.7cm;margin:0 auto;color:#000;background:#FFF;
    font-family:calibri;font-size:12px}.company-title{text-align:right}
    .row{display:-ms-flexbox;display:flex;-ms-flex-wrap:wrap;flex-direction:row}
    .col{-ms-flex-preferred-size:0;-ms-flex-positive:1;padding-left:10px;max-width:100%}
    .row1{display:-ms-flexbox;display:flex;-ms-flex-wrap:wrap;flex-direction:row;
    flex-wrap:wrap;margin-right:1px;margin-left:0px}.col1{-ms-flex-preferred-size:0;flex-basis:0;
    -ms-flex-positive:1;flex-grow:1;padding-left:10px;max-width:100%}header{padding:10px 0}
    .header{padding:5px 0;text-align:center}#logo{float:left;margin-top:8px}
    #logo img{height:70px}#company{float:right;text-align:right}#client{padding-left:6px;float:left}
    #client .to{color:#333}h2.name{font-size:1.4em;font-weight:600;margin:0}
    #invoice{float:right;text-align:right}#invoice h1{color:#0087C3;font-size:2.4em;
    line-height:1em;font-weight:normal;margin:0 0 10px 0}#invoice .date{font-size:1.1em;color:#000}
    table{width:100%;border-collapse:collapse;border-spacing:0;margin-bottom:20px}
    table th, table th, table td{padding:5px;vertical-align:bottom;text-align:center}
    table th{white-space:nowrap;font-weight:bold}table td{text-align:left}
    table td h3{color:#000;font-size:1em;font-weight:600;margin:0 0 0.2em 0}
    table .no{color:#000}table .total{color:#000;text-align:right}
    table td.unit, table td.qty, table td.total{font-size:1em}
    table tfoot td{background:#FFF;border-bottom:none;font-weight:600;text-align:right;
    white-space:nowrap;margin-top:100px}table tfoot tr:first-child td{border-top:none}
    table tfoot tr:last-child td{border-top:1px solid #333}
    .table1 tbody tr td, .table1 tbody tr th{border:1px solid #333;word-break:break-all}
    #thanks{font-size:2em;margin-bottom:50px}#notices{padding-left:6px;border-left:6px solid #0087C3}
    #notices .notice{font-size:1.2em}footer{color:#000;width:100%;height:30px;position:absolute;
    bottom:60px;border-top:1px solid #AAA;padding:8px 0;text-align:center}.name-footer{text-align:left}
    </style></head><body>`)
    printWindow.document.write(divElements)
    printWindow.document.write('</body></html>')
    printWindow.document.close()
    printWindow.focus()
    $('#' + cmpName).modal(UIConstant.MODEL_HIDE)
    setTimeout(function () {
      printWindow.print()
      printWindow.close()
    }, 100)
  }

  ngOnDestroy(): void {
    this.onDestroy$.next()
    this.onDestroy$.complete()
  }
}
