import { Settings } from './../../../shared/constants/settings.constant';
import { Component, ViewChild, ElementRef, OnInit, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
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
import * as _ from 'lodash';
import { VoucherEntryAddComponent } from '../voucher-entry-add/voucher-entry-add.component';
@Component({
  selector: 'voucher-entry-main',
  templateUrl: './voucher-entry-main.component.html'
})

export class VoucherEntryMainComponent implements OnInit {
  @ViewChild('voucherAddContainer', { read: ViewContainerRef }) voucherAddContainerRef: ViewContainerRef;
  printTemlateTitle: string = ''
  totalAmount: number = 0
  totalAmountInWords: string = ''
  printDataList: Array<any> = []
  printOrgnizationDataList: Array<any> = []
  
  printHeaderData: any = {}
  toShowSearch = false
  title: string = ''
  printData = []
  onDestroy$ = new Subject()
  voucherAddComponentRef: any;
  constructor(private _formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private commonService: CommonService,
    private voucherService: VoucherEntryServie,
    private purchaseService: PurchaseService,
    private toastrService: ToastrCustomService,
    private resolver: ComponentFactoryResolver,
    public settings: Settings) {
    this.formSearch()
    this.getVoucherSetting()

    this.commonService.getActionClickedStatus().subscribe(
      (action: any) => {
        if (action.type === FormConstants.Print && action.formname === FormConstants.VoucherForm) {
          if (action.voucherTypeId === 102) {
            this.printTemlateTitle = 'RECEIPT VOUCHER'
          } else if (action.voucherTypeId === 103) {
            this.printTemlateTitle = 'PAYMENT VOUCHER'
          }
          this.onPrintButton(action.id, action.printId)
        }
      }
    )
  }

  createComponent(voucherData?) {
    this.voucherAddContainerRef.clear();
    const factory = this.resolver.resolveComponentFactory(VoucherEntryAddComponent);
    this.voucherAddComponentRef = this.voucherAddContainerRef.createComponent(factory);
    if (!_.isEmpty(voucherData) &&  voucherData.VoucherId) {
      this.voucherAddComponentRef.instance.editId = voucherData.VoucherId
      this.voucherAddComponentRef.instance.editType = voucherData.VoucherType
    }
    this.voucherAddComponentRef.instance.voucherAddClosed.subscribe(
      () => {
        this.voucherAddComponentRef.destroy();
      });
  }

  ngOnInit() {
    this.route.data.pipe(takeUntil(this.onDestroy$)).subscribe(data => {
      this.title = data.title
    })
  }

  toggleSearch() {
    this.toShowSearch = !this.toShowSearch
  }

  @ViewChild('searchData') searchData: ElementRef
  searchForm: FormGroup
  private formSearch() {
    this.searchForm = this._formBuilder.group({
      'searchKey': [UIConstant.BLANK]
    })
  }

  getVoucherSetting() {
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
  orgimage:any=[]
  orgAddress:any =[]
  onPrintButton = (id, htmlID) => {
    this.voucherService.printReceiptPayment({ id: id })
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
          this.printDataList = JSON.parse(JSON.stringify(data.PaymentDetails));
          this.printHeaderData = JSON.parse(JSON.stringify(data.LedgerVoucherMsts[0]))
          this.printOrgnizationDataList = data.ClientInfos
          this.orgAddress = data.AddressDetails
          this.orgimage =data.ImageContents
          _.forEach(this.printDataList, (item) => {
            if (item.Amount) {
              this.totalAmount = this.totalAmount + Number(item.Amount)
            }
          })
          if(this.totalAmount) {
            this.totalAmountInWords = this.commonService.NumInWords(this.totalAmount);
          }
          setTimeout(() => {
            this.printComponent(htmlID)
          }, 1000)
        },
        (error) => {
          console.log(error)
          this.toastrService.showError(error, '')
        }
      )
  }

  printComponent(cmpName) {
    let title = document.title
    let divElements = document.getElementById(cmpName).innerHTML
    let printWindow = window.open('', '_blank', '')
    printWindow.document.open()

    printWindow.document.write('<html><head><title>' + title + `
    </title>
    <style>
    body {
      font-size: 0.75rem !important;
      color: #000 !important;
      overflow-x: hidden;
      font-family: "Calibri", sans-serif !important;
      position: relative;
      width: 21cm;
      height: 29.7cm;
      margin: 0 auto;
    }

    div {
      display: block;
    }

    .row {
      display: flex;
      flex-wrap: wrap;
      padding-right: 5px;
      padding-left: 5px;
    }

    .col-md-12 {
      flex: 0 0 100%;
      max-width: 100%;
    }

    .col-md-3 {
      flex: 0 0 25%;
      max-width: 25%;
    }

    .col-md-3 {
      flex: 0 0 25%;
      max-width: 25%;
    }

    .col-md-4 {
      flex: 0 0 33.333333%;
      max-width: 33.333333%;
    }

    .col-md-6 {
      flex: 0 0 50%;
      max-width: 50%;
    }

    .col,
    .col-1,
    .col-10,
    .col-11,
    .col-12,
    .col-2,
    .col-3,
    .col-4,
    .col-5,
    .col-6,
    .col-7,
    .col-8,
    .col-9,
    .col-auto,
    .col-lg,
    .col-lg-1,
    .col-lg-10,
    .col-lg-11,
    .col-lg-12,
    .col-lg-2,
    .col-lg-3,
    .col-lg-4,
    .col-lg-5,
    .col-lg-6,
    .col-lg-7,
    .col-lg-8,
    .col-lg-9,
    .col-lg-auto,
    .col-md,
    .col-md-1,
    .col-md-10,
    .col-md-11,
    .col-md-12,
    .col-md-2,
    .col-md-3,
    .col-md-4,
    .col-md-5,
    .col-md-6,
    .col-md-7,
    .col-md-8,
    .col-md-9,
    .col-md-auto,
    .col-sm,
    .col-sm-1,
    .col-sm-10,
    .col-sm-11,
    .col-sm-12,
    .col-sm-2,
    .col-sm-3,
    .col-sm-4,
    .col-sm-5,
    .col-sm-6,
    .col-sm-7,
    .col-sm-8,
    .col-sm-9,
    .col-sm-auto,
    .col-xl,
    .col-xl-1,
    .col-xl-10,
    .col-xl-11,
    .col-xl-12,
    .col-xl-2,
    .col-xl-3,
    .col-xl-4,
    .col-xl-5,
    .col-xl-6,
    .col-xl-7,
    .col-xl-8,
    .col-xl-9,
    .col-xl-auto {
      position: relative;
      width: 100%;
      min-height: 1px;
    }

    .justify-content-center {
      justify-content: center !important;
    }

    .balancesheet {
    }

    .bdr_left {
      border-left: 1px solid #000;
    }

    .bdr_right {
      border-right: 1px solid #000;
    }

    .bdr_top {
      border-top: 1px solid #000;
    }

    .bdr_bottom {
      border-bottom: 1px solid #000;
    }

    .text-center {
      text-align: center !important;
    }

    .text-right {
      text-align: right !important;
    }

    .text-left {
      text-align: left !important;
    }

    .p-2 {
      padding: 0.5rem !important;
    }

    .p-1 {
      padding: 0.25rem !important;
    }

    .font-weight-bold {
      font-weight: 700 !important;
    }

    .name_size {
      font-size: 22px;
    }

    .amount_bs {
      text-align: right;
      padding: 0px 3px;
    }

    .main-balance .tfoot,
    .main-balance .thead {
      font-weight: 600;
      /* background: #e4ebef; */
      padding: 5px 0;
      font-size: .8rem;
      border-top: 1px solid #000;
      border-bottom: 1px solid #000;
    }

    .col-3 {
      flex: 0 0 25%;
      max-width: 25%;
    }

    .col {
      flex-basis: 0;
      flex-grow: 1;
      max-width: 100%;
    }

    .p-0 {
      padding: 0 !important;
    }

    .ittelic {
      font-style: italic;
    }

    *,
    ::after,
    ::before {
      box-sizing: border-box;
    }

    .bdr_right_fix {
      min-height: 25px;
      border-right: 1px solid #000;
    }

    .bdr_left_fix {
      min-height: 25px;
      border-left: 1px solid #000;
    }

    .d-block {
      display: block;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      border-spacing: 0;
      margin-bottom: 20px;
    }

    thead {
      display: table-header-group;
      vertical-align: middle;
      border-color: inherit;
    }

    table th,
    table td {
      padding: 3px;
      text-align: left;
      border-bottom: 1px solid #ffffff;
      word-break: break-word;
    }

    table th {
      white-space: nowrap;
      font-weight: 600;
      font-size:.8rem;
      border: 1px solid #000;
      background-color: #000 !important;
      color: white !important;
      text-align: center;
    }

    table td {
      text-align: left;
      font-size:.75rem;
      border: 1px solid #000;
    }

    @media print {
      table th {
        background-color: #000 !important;
        -webkit-print-color-adjust: exact;
      }

      tr:nth-child(even) {
        background-color: #d9e1f2;
        -webkit-print-color-adjust: exact;
      }
    }

    @media print {
      table th {
        color: white !important;
      }
    }
  </style>
    </head><body>`)
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
