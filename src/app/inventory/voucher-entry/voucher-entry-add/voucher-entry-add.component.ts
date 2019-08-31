import { Component, ViewChild, OnDestroy, ViewChildren, QueryList, HostListener, ElementRef, Output, EventEmitter, OnInit } from '@angular/core';
import { Subject, throwError } from 'rxjs';
import { CommonService } from "src/app/commonServices/commanmaster/common.services";
import { takeUntil, filter, catchError, map } from 'rxjs/internal/operators';
import { AddCust } from '../../../model/sales-tracker.model';
import { UIConstant } from '../../../shared/constants/ui-constant';
import { Select2OptionData, Select2Component } from 'ng2-select2';
import { PurchaseService } from '../../purchase/purchase.service';
import { Settings } from '../../../shared/constants/settings.constant';
import { GlobalService } from '../../../commonServices/global.service';
import { ToastrCustomService } from '../../../commonServices/toastr.service';
import { VoucherEntryServie } from '../voucher-entry.service';
import { SetUpIds } from '../../../shared/constants/setupIds.constant';
import { VoucherAddModel } from '../voucher-entry.model';
import { Subscription } from 'rxjs/Subscription';
declare const $: any
import * as _ from 'lodash'
declare const flatpickr: any
export enum KEY_CODE {
  RIGHT_ARROW = 39,
  LEFT_ARROW = 37
}
@Component({
  selector: 'voucher-entry-add',
  templateUrl: './voucher-entry-add.component.html'
})
export class VoucherEntryAddComponent implements OnInit, OnDestroy {
  @ViewChildren('paymentRef') payMentAmountRef: QueryList<ElementRef>
  @Output() voucherAddClosed = new EventEmitter();
  editId: number
  editType: string
  editData: any
  isPaymentAmount = false
  onDestroy$ = new Subject()
  subscribe: Subscription
  newCustAddCutomer: Subscription
  autoBill: boolean = true;
  previousVoucherNo: string
  VoucherNo: string
  Id: number;
  creatingForm: boolean;
  clientDateFormat: string = ''
  glid: number = 4
  dateStatus: boolean
  tabId: number = 1
  advancePayment = 0
  organisationsData: Array<Select2OptionData>
  OrgId: number
  organisationValue: number
  ledgerPlaceholder: Select2Options = { placeholder: 'Select Customer' }
  LedgerId: number
  ledgerValue: number
  ledgerData: Array<Select2OptionData>
  PartyId = 0
  VoucherDate: string
  settingData = []
  voucherList = []
  paymentModesData: Array<Select2OptionData>
  selectAll = false
  invalidObj = {}
  Paymode = ''
  PayModeId = 0
  Amount = 0
  BankLedgerName = ''
  ChequeNo = ''
  ledger = 0
  paymode = 0
  Narration: string = ''
  submitSave: boolean
  voucherDatas: Array<VoucherDatas> = []
  bankData: Array<Select2OptionData>
  cashData: Array<Select2OptionData>
  transferData: Array<any> = []
  voucherDataJ: Array<VoucherDatas> = []
  tempJournaldata: Array<VoucherDatas> = []
  sendItemJournalData: Array<VoucherDatas> = []
  allLedgerList: Array<Select2OptionData>
  ledgerCreationModel: Subscription
  getListledger: any = []
  advanceBillNo: number;
  constructor(private commonService: CommonService, private purchaseService: PurchaseService,
    private voucherService: VoucherEntryServie, private settings: Settings, private gs: GlobalService,
    private toastrService: ToastrCustomService) {
    this.ledgerCreationModel = this.commonService.getledgerCretionStatus().subscribe(
      (data: AddCust) => {
        if (data.id && data.name) {
          let newData2 = Object.assign([], this.ledgerData)
          newData2.push({ id: data.id, text: data.name })
          this.ledgerData = newData2
          this.addNewLedgerFlag = false
          let newData1 = Object.assign([], this.allLedgerList)
          newData1.push({ id: data.id, text: data.name })
          this.allLedgerList = newData1
          this.getListledger = data
          this.LedgerId = data.id
          if (this.voucherDataJ.length === 1) {
            this.voucherDataJ = [{
              LedgerId: Number(data.id),
              Amount: 0,
              Type: 0,
              data: this.allLedgerList,
              default: 0
            }]
          }
          else {
            this.voucherDataJ.forEach((ele, index) => {
              if (+this.voucherDataJ[index]['Amount'] > 0 &&
                +this.voucherDataJ[index]['LedgerId'] > 0) {
                this.voucherDataJ[this.voucherDataJ.length - 1].data = this.allLedgerList
                this.voucherDataJ[this.voucherDataJ.length - 1].LedgerId = Number(data.id)

              }
            })
          }

          setTimeout(() => {
            if (this.ledgerSelect2) {
              this.ledgerSelect2.selector.nativeElement.focus()
            }
          }, 600)
        }
      }
    )
    this.commonService.getLedgerStatus().pipe(takeUntil(this.onDestroy$)).subscribe(
      (data: AddCust) => {
        if (data.id && data.name) {
          let newData = Object.assign([], this.paymentLedgerselect2)
          newData.push({ id: data.id, text: data.name })
          this.paymentLedgerselect2 = newData
          this.LedgerId = +data.id
          this.ledger = data.id
          this.voucherDatas[0] = {
            LedgerId: +data.id,
            Amount: 0,
            Type: 0,
            data: this.paymentLedgerselect2,
          }
          setTimeout(() => {
            if (this.ledgerSelect2) {
              this.ledgerSelect2.selector.nativeElement.focus()
            }
          }, 600)
        }
      }
    )
    this.newCustAddCutomer = this.commonService.getCustStatus().subscribe(
      (data: AddCust) => {
        if (data.id && data.name) {
          this.getListledger = data
          this.addNewLedgerFlag = false
          let newData = Object.assign([], this.ledgerData)
          let newData1 = Object.assign([], this.allLedgerList)
          newData1.push({ id: data.id, text: data.name })
          newData.push({ id: data.id, text: data.name })
          this.ledgerData = newData
          this.allLedgerList = newData1
          this.LedgerId = +data.id
          this.ledgerValue = data.id

          if (this.voucherDataJ.length === 1) {
            this.voucherDataJ = [{
              LedgerId: +data.id,
              Amount: 0,
              Type: 0,
              data: this.allLedgerList,
              default: 0
            }]
          }
          else {
            this.voucherDataJ.forEach((ele, index) => {
              if (+this.voucherDataJ[index]['Amount'] > 0 &&
                +this.voucherDataJ[index]['LedgerId'] > 0) {
                this.voucherDataJ[this.voucherDataJ.length - 1].data = this.allLedgerList
                this.voucherDataJ[this.voucherDataJ.length - 1].LedgerId = +data.id

              }
            })
          }
          this.addNewLedgerFlag = true
          setTimeout(() => {
            this.partySelect2.selector.nativeElement.focus()
          }, 600)
        }

      }
    )
    this.commonService.getVendStatus().pipe(takeUntil(this.onDestroy$)).subscribe(
      (data: AddCust) => {
        if (data.id && data.name) {

          this.addNewLedgerFlag = false
          this.getListledger = data
          let newData = Object.assign([], this.ledgerData)
          newData.push({ id: data.id, text: data.name })
          let newData1 = Object.assign([], this.allLedgerList)
          newData1.push({ id: data.id, text: data.name })
          this.ledgerData = newData
          this.allLedgerList = newData1
          this.PartyId = +data.id
          this.ledgerValue = data.id
          if (this.voucherDataJ.length === 1) {
            this.voucherDataJ = [{
              LedgerId: +data.id,
              Amount: 0,
              Type: 0,
              data: this.allLedgerList,
              default: 0
            }]
          }
          else {
            this.voucherDataJ.forEach((ele, index) => {
              if (+this.voucherDataJ[index]['Amount'] > 0 &&
                +this.voucherDataJ[index]['LedgerId'] > 0) {
                this.voucherDataJ[this.voucherDataJ.length - 1].data = this.allLedgerList
                this.voucherDataJ[this.voucherDataJ.length - 1].LedgerId = +data.id

              }
            })
          }
          this.addNewLedgerFlag = true
          setTimeout(() => {
            if (this.partySelect2) {
              this.partySelect2.selector.nativeElement.focus()
            }
          }, 600)


        }
      }
    )
    this.clientDateFormat = this.settings.dateFormat
    this.transferData = [
      { id: 0, text: 'Dr' },
      { id: 1, text: 'Cr' }
    ];
    this.getSPUitilityData()
    this.subscribe = this.purchaseService.organisationsData$.pipe(takeUntil(this.onDestroy$)).subscribe(
      data => {
        if (data.data) {
          this.organisationsData = data.data
          if (this.organisationsData.length >= 1) {
            this.OrgId = +this.organisationsData[0].id
            this.organisationValue = +this.organisationsData[0].id
            if (!this.voucherService.tabs[this.tabId - 1].voucherNoManual) {
              this.VoucherDate = this.gs.getDefaultDate(this.clientDateFormat)
              if (this.tabId === 1 || this.tabId === 2) {
                this.getNewBillNo()
              }
            }
          }
        }
      }
    )

    this.subscribe = this.voucherService.ledgerData$.pipe(takeUntil(this.onDestroy$)).subscribe(
      data => {
        if (data.data) {
          this.allLedgerList = data.data
          data.data.unshift({ id: '-1', text: UIConstant.ADD_NEW_OPTION })
          this.voucherDataJ = [
            {
              LedgerId: '0',
              Amount: 0,
              Type: 0,
              data: this.allLedgerList,
              default: 0
            }
          ]
          this.tempJournaldata = [
            {
              LedgerId: '0',
              Amount: 0,
              Type: 0,
              data: this.allLedgerList,
              default: 0
            }
          ]

        }
      }
    )

    this.subscribe = this.purchaseService.paymentModesData$.pipe(takeUntil(this.onDestroy$)).subscribe(
      data => {
        if (data.data) {
          this.paymentModesData = data.data
        }
      }
    )

    this.subscribe = this.voucherService.vendorData$.pipe(takeUntil(this.onDestroy$)).subscribe(
      data => {
        if (data.data) {
          this.ledgerData = data.data
          this.bankData = data.data
          this.voucherDatas[0] = {
            LedgerId: '0',
            Amount: 0,
            Type: 0,
            data: this.bankData,
          }
        }
      }
    )

    this.subscribe = this.voucherService.customerData$.pipe(takeUntil(this.onDestroy$)).subscribe(
      data => {
        if (data.data) {
          let allledger = [{ id: '-1', text: UIConstant.ADD_NEW_OPTION }]
          this.ledgerData = data.data
          this.cashData = data.data
          this.voucherDatas[1] = {
            LedgerId: '0',
            Amount: 0,
            Type: 1,
            data: this.cashData,
          }
        }
      }
    )
  }

  ngOnInit() {
    this.openModal()
  }

  getLedgerJournalData(data) {
    if (data.data) {
      this.allLedgerList = data.data
      this.voucherDataJ = [
        {
          LedgerId: '0',
          Amount: 0,
          Type: 0,
          data: this.allLedgerList,
          default: 0
        }
      ]
      this.tempJournaldata = [
        {
          LedgerId: '0',
          Amount: 0,
          Type: 0,
          data: this.allLedgerList,
          default: 0
        }
      ]
    }
  }
  getVoucherDetailsByVoucherId(voucherId) {
    this.voucherService.getVoucherEntryDetails(voucherId).subscribe(
      (res) => {
        if (res.Code === 1000) {
          this.editData = JSON.parse(JSON.stringify(res.Data));
          this.goToTab();
        }
      })
  }

  goToTab(){
    switch (this.editType) {
      case 'Payment':
        $('#vendorPaymentTabLink').click()
        this.onTabClick(1)
        break;
      case 'Receipt':
        $('#customerReceiptTabLink').click()
        this.onTabClick(2)
        break;
      case 'Contra':
        $('#contraTabLink').click()
        this.onTabClick(3)
        break;
      case 'Journal':
        $('#journalTabLink').click()
        this.onTabClick(4)
        break;
      case 'Expences':
        $('#paymentTabLink').click()
        this.onTabClick(5)
        break;
      case 'Income':
        $('#receiptTabLink').click()
        this.onTabClick(6)
        break;
      default:
        break;
    }
  }


  getjournalRefreshList() {
    let newData1 = Object.assign([], this.allLedgerList)
    if (this.getListledger.id > 0) {
      newData1.push({ id: this.getListledger.id, text: this.getListledger.name })
      this.allLedgerList = newData1
    }
    else {
      this.allLedgerList = newData1
    }
    this.voucherDataJ = [
      {
        LedgerId: '0',
        Amount: 0,
        Type: 0,
        data: this.allLedgerList,
        default: 0
      }
    ]

  }

  getListOfEnableLedger() {

    if (this.tempJournaldata.length > 0) {
      let newData = []
      this.allLedgerList = []
      this.tempJournaldata[0].data.forEach(ele => {
        newData.push({ id: ele.id, text: ele.text, disabled: false })
      })
      this.allLedgerList = newData
      this.voucherDataJ = [
        {
          LedgerId: '0',
          Amount: 0,
          Type: 0,
          data: this.allLedgerList,
          default: 0
        }
      ]
    }
  }

  openModal() {
    this.addNewLedgerFlag = true
    this.getListOfEnableLedger()
    this.getjournalRefreshList()
    this.initComp()
    this.getSetUpModules((JSON.parse(this.settings.moduleSettings).settings))
    setTimeout(() => {
      $('#voucher_modal').modal(UIConstant.MODEL_SHOW)
      this.setFocus()
    }, 1)
  }

  closeModal() {
    if ($('#voucher_modal').length > 0) {
      $('#voucher_modal').modal(UIConstant.MODEL_HIDE)
      this.voucherAddClosed.emit()
    }
  }

  initComp() {
    if (this.editId) {
      this.getVoucherDetailsByVoucherId(this.editId);
    } else {
      this.initParams()
    }
  }

  closeForm() {
    this.commonService.closeVoucher()
  }

  @ViewChild('organisation_select2') organisationSelect2: Select2Component
  onChangeOrganisationId(evt) {
    if (evt.value && evt.data.length > 0) {
      if (evt.value > 0 && evt.data[0] && evt.data[0].text) {
        this.OrgId = +evt.value
        this.getNewBillNo()
        this.getVoucherList()
      }
    }
  }

  getNewBillNo() {
    if (+this.OrgId > 0 && this.VoucherDate) {
      let newVoucherDate = this.gs.clientToSqlDateFormat(this.VoucherDate, this.clientDateFormat)
      let auto = this.voucherService.tabs[this.tabId - 1].type
      if (this.tabId === 5) {
        auto = this.voucherService.tabs[0].type
      }
      if (this.tabId === 6) {
        auto = this.voucherService.tabs[1].type
      }
      this.voucherService.getTransactionNo(auto,
        +this.OrgId, newVoucherDate, auto).
        pipe(takeUntil(this.onDestroy$), filter(data => {
          if (data.Code === UIConstant.THOUSAND) { return true } else { throw new Error(data.Description) }
        }), catchError(error => { return throwError(error) }), map(data => data.Data)).subscribe(
          data => {
            if (data.length > 0) {
              if (!this.voucherService.tabs[this.tabId - 1].voucherNoManual) {
                this.VoucherNo = data[0].BillNo
              } else {
                this.previousVoucherNo = data[0].BillNo
              }
            } else {
              this.previousVoucherNo = ''
              this.VoucherNo = ''
            }
          },
          (error) => {
            this.toastrService.showError(error, '')
          },
          () => {
          }
        )
    }
  }

  JournalDataForLedger: any = []
  loading = true
  getSPUitilityData() {
    return new Promise((resolve, reject) => {
      this.loading = true
      let _self = this
      this.commonService.getSPUtilityData(this.voucherService.tabs[this.tabId - 1].type).pipe(takeUntil(this.onDestroy$), filter(data => {
        if (data.Code === UIConstant.THOUSAND) { return true } else { throw new Error(data.Description) }
      }), catchError(error => { return throwError(error) }), map(data => data.Data)).subscribe(
        data => {
          this.purchaseService.createOrganisations(data.Organizations)
          this.JournalDataForLedger = data.Customers
          let journalData = this.voucherService.allLedgerList(data.Customers, UIConstant.JOURNAL_TYPE)
          if (journalData) {
            this.getLedgerJournalData(journalData)
          }
          if (_self.voucherService.tabs[_self.tabId - 1].type === UIConstant.PAYMENT_TYPE
            || _self.voucherService.tabs[_self.tabId - 1].type === UIConstant.RECEIPT_TYPE) {
            _self.purchaseService.createPaymentModes(data.PaymentModes)
            if (_self.voucherService.tabs[_self.tabId - 1].type === UIConstant.PAYMENT_TYPE) {
              _self.voucherService.createVendors(data.Vendors, UIConstant.PAYMENT_TYPE)
            } else if (_self.voucherService.tabs[_self.tabId - 1].type === UIConstant.RECEIPT_TYPE) {
              _self.voucherService.createCustomers(data.Customers, UIConstant.RECEIPT_TYPE)
            }
          } else if (_self.voucherService.tabs[_self.tabId - 1].type === UIConstant.CONTRA_TYPE) {
            _self.voucherService.createVendors(data.Vendors, UIConstant.CONTRA_TYPE)
            _self.voucherService.createCustomers(data.Customers, UIConstant.CONTRA_TYPE)
          } else if (_self.tabId === 5 || _self.tabId === 6) {
            _self.voucherService.createVendors(data.Vendors, _self.voucherService.tabs[_self.tabId - 1].type)
          }
          resolve('success');
        },
        (error) => {
          _self.toastrService.showError(error, '')
          _self.loading = false
        },
        () => {
          _self.loading = false
          _self.setVoucherDate()
        }
      )
    })
  }

  billSettlementType: number = 1
  getSetUpModules(settings) {
    if (this.tabId === 1 || this.tabId === 2) {
      settings.forEach(element => {
        if (element.id === SetUpIds.paymentAutoVoucher) {
          this.voucherService.tabs[0].voucherNoManual = !!(+element.val)
        }
        if (element.id === SetUpIds.receiptAutoVoucher) {
          this.voucherService.tabs[1].voucherNoManual = !!(+element.val)
        }
        if (element.id === SetUpIds.billSettlementType) {
          this.billSettlementType = +element.val
        }
      })
    }
  }

  getVoucherList() {
    if (!this.editId) {
      if (this.PartyId > 0 && +this.OrgId > 0) {
        this.voucherService.getVoucherList(this.voucherService.tabs[this.tabId - 1].ReportFor, 'Billwise', this.PartyId, +this.OrgId).pipe(takeUntil(this.onDestroy$), filter(data => {
          if (data.Code === UIConstant.THOUSAND) { return true } else { throw new Error(data.Description) }
        }), catchError(error => { return throwError(error) }), map(data => data.Data),
          map(data => { data.forEach(element => { element['selected'] = false; element['rejected'] = false; element['PaymentAmount'] = 0; element['IsAdvance'] = 0 }); return data; })).subscribe(
            data => {
              if (!_.isEmpty(data)) {
                this.voucherList = data
              } else {
                this.voucherList = []
                this.Amount = 0
                this.advancePayment = 0
                this.advanceBillNo = 0
              }
              this.updateAmount()
              this.checkForValidation()
            },
            (error) => {
              this.toastrService.showError(error, '')
            }
          )
      }
      else if (this.addNewLedgerFlag) {
        if (this.PartyId === -1) {
          this.partySelect2.selector.nativeElement.value = ''
          this.commonService.openConfirmation(false, ' ')
          // this.commonService.openledgerCretion('', 0)


        } else {
          this.voucherList = []
        }
      }
    }
  }

  getVoucherList_Payment_recipt() {
    if (!this.editId) {
      if (this.PartyId > 0 && +this.OrgId > 0) {
        this.voucherService.getVoucherList(this.voucherService.tabs[this.tabId - 1].ReportFor, 'Billwise', this.PartyId, +this.OrgId).pipe(takeUntil(this.onDestroy$), filter(data => {
          if (data.Code === UIConstant.THOUSAND) { return true } else { throw new Error(data.Description) }
        }), catchError(error => { return throwError(error) }), map(data => data.Data),
          map(data => { data.forEach(element => { element['selected'] = false; element['rejected'] = false; element['PaymentAmount'] = 0; element['IsAdvance'] = 0 }); return data; })).subscribe(
            data => {
              if (!_.isEmpty(data)) {
                this.voucherList = data
              } else {
                this.voucherList = []
                this.Amount = 0
                this.advancePayment = 0
                this.advanceBillNo = 0
              }
              this.updateAmount()
              this.checkForValidation()
            },
            (error) => {
              this.toastrService.showError(error, '')
            }
          )
      }
      else if (this.addNewLedgerFlag) {
        if (this.PartyId === -1) {
          this.partySelect2.selector.nativeElement.value = ''
          // this.commonService.openConfirmation(false, ' ')
          this.commonService.openledgerCretion('', 0)


        } else {
          this.voucherList = []
        }
      }
    }
  }
  toggleSelect(evt) {
    for (let i = 0; i < this.voucherList.length; i++) {
      this.voucherList[i].selected = evt.target.checked
    }
    this.updateAmount()
  }

  paymentLedgerselect2: Array<Select2OptionData>
  @ViewChild('payment_select2') paymentSelect2: Select2Component
  onPaymentModeSelect(event) {
    if (+event.value > 0 && event.data[0] && event.data[0].text) {
      this.Paymode = event.data[0].text
      this.PayModeId = +event.value
      if (+event.value !==1) {
        this.BankLedgerName = ''
        this.LedgerId = 0
        this.setpaymentLedgerSelect2(0,+event.value )
      } else if (+event.value === 1) {
        this.setLedgerSelectForCash();
      }
    }
    this.checkForValidation()
  }
  setLedgerSelectForCash() {
    this.paymentLedgerselect2 = Object.assign([], [{ id: '1', text: 'Cash' }])
    this.BankLedgerName = 'Cash'
    this.LedgerId = 1
    this.ledger = 1
    if (!_.isEmpty(this.ledgerSelect2)) {
      this.ledgerSelect2.setElementValue(this.LedgerId)
    }
  }

  setpaymentLedgerSelect2(i,paymentId) {
    let _self = this
    let newData = [{ id: '0', text: 'Select Ledger' }, { id: '-1', text: UIConstant.ADD_NEW_OPTION }]
    this.commonService.getPaymentLedgerDetail(paymentId).pipe(takeUntil(this.onDestroy$)).subscribe(data => {
      if (data.Code === UIConstant.THOUSAND && data.Data) {
        data.Data.forEach(element => {
          newData.push({
            id: element.Id,
            text: element.Name
          })
        })
      }
      _self.paymentLedgerselect2 = newData
    },
      (error) => console.log(error),
      () => {
      })
  }

  onSelectBank(event, index) {
    if (+event === -1) {
      this.voucherDatas[index].LedgerId = "0"
      this.commonService.openLedger('')
    }
  }

  addNewLedgerFlag: boolean = true
  onSelectLedger(event) {
    if (+event === -1) {
      this.ledgerSelect2.selector.nativeElement.value = ''
      this.commonService.openledgerCretion('', 0)
    }


  }

  LedgerIdJrnl: number
  onSelectJournalLedger(event, index) {
    if (+event === -1) {
      this.voucherDataJ[index].LedgerId = '0'
      this.commonService.openConfirmation(true, ' ')
    }
    else {
      this.LedgerIdJrnl = event
    }
  }

  @ViewChild('ledger_select2') ledgerSelect2: Select2Component
  onPaymentLedgerSelect(event) {
    if (event.value > 0 && event.data[0] && event.data[0].text) {
      this.LedgerId = +event.value
      this.BankLedgerName = event.data[0].text
    }
    if (+event.value === -1) {
      this.ledgerSelect2.selector.nativeElement.value = ''
      this.commonService.openLedger('')
    }
    this.checkForValidation()
  }

  initPayment(Data?) {
    let payMentData, ledgerData
    if (!_.isEmpty(Data)) {
      if (!_.isEmpty(Data.PaymentDetails)) {
        payMentData = { ...Data.PaymentDetails[0] }
      }
      if (!_.isEmpty(Data.LedgerVoucherMst))
        ledgerData = { ...Data.LedgerVoucherMst[0] }
    }
    this.Paymode = ''
    this.PayModeId = !_.isEmpty(payMentData) ? payMentData.PayModeId : 0
    this.LedgerId = 0
    this.Amount = !_.isEmpty(payMentData) ? payMentData.Amount : 0
    this.BankLedgerName = !_.isEmpty(ledgerData) ? ledgerData.BankLedgerName : ''
    this.Narration = !_.isEmpty(ledgerData) ? ledgerData.Narration : ''
    this.ledger = 0
    this.paymode = !_.isEmpty(payMentData) ? payMentData.PayModeId : 0
    if (!_.isEmpty(payMentData) && Number(payMentData.LedgerId) === 1) {
      this.setLedgerSelectForCash()
    }
  }

  @ViewChild('party_select2') partySelect2: Select2Component
  initParams() {
    this.initPayment()
    this.PartyId = 0
    if (this.organisationsData && this.organisationsData.length > 0) {
      this.OrgId = +this.organisationsData[0].id
      this.organisationValue = +this.organisationsData[0].id
      if (this.organisationSelect2) {
        this.organisationSelect2.setElementValue(this.OrgId)
      }
    }
    if (this.partySelect2) {
      this.partySelect2.setElementValue(0)
    }
    this.autoBill = true;
    this.selectAll = false
    this.advancePayment = 0
    this.tabId = 1
    this.ledgerValue = 0
    this.voucherList = []
    this.invalidObj = {}
    this.voucherDatas = []
    this.submitSave = false
    this.dateStatus = false
  }


  assignVoucherData(Data) {
    let ledgerData
    if (!_.isEmpty(Data) && !_.isEmpty(Data.LedgerVoucherMst)) {
      ledgerData = { ...Data.LedgerVoucherMst[0] }
    }
    this.initPayment(Data)
    this.PartyId = !_.isEmpty(ledgerData) ? ledgerData.LedgerId : 0
    if (this.organisationsData && this.organisationsData.length > 0) {
      this.OrgId = +this.organisationsData[0].id
      this.organisationValue = +this.organisationsData[0].id
      if (this.organisationSelect2) {
        this.organisationSelect2.setElementValue(this.OrgId)
      }
    }
    if (this.partySelect2) {
      this.partySelect2.setElementValue(this.PartyId)
    }
    if (!_.isEmpty(ledgerData)) {
      this.VoucherNo = ledgerData.VoucherNo
      if (this.VoucherDate) {
        this.VoucherDate = this.gs.utcToClientDateFormat(new Date(this.VoucherDate), this.clientDateFormat)
      }
    }
    this.autoBill = true;
    this.selectAll = false
    this.advancePayment = 0
    this.ledgerValue = !_.isEmpty(ledgerData) ? ledgerData.LedgerId : 0
    this.invalidObj = {}
    this.submitSave = false
    this.dateStatus = false
    if ((this.tabId === 1 || this.tabId === 2 || this.tabId === 5 || this.tabId === 6)
     && !_.isEmpty(Data) && !_.isEmpty(Data.ReceiptPaymentTransaction)) {
      const advancePaymentRowIndex = _.findIndex(Data.ReceiptPaymentTransaction, { BalanceType: 'AD' });
      const advancePaymentRow = Data.ReceiptPaymentTransaction[advancePaymentRowIndex]
      if (advancePaymentRowIndex !== -1) {
        Data.ReceiptPaymentTransaction.splice(advancePaymentRowIndex, 1);
      }
      this.voucherList = JSON.parse(JSON.stringify(Data.ReceiptPaymentTransaction))
      if (_.isEmpty(this.voucherList)) {
        this.getAdvancePaymentBillNo(this.Amount)
      }
      this.updateAmount()
      this.checkForValidation()
    } else {
      this.voucherList = []
    }
    if (this.tabId === 3 || this.tabId === 4) {
      if (!_.isEmpty(this.editData) && !_.isEmpty(this.editData.LedgerTransDetails)) {
        this.voucherDataJ = []
        const ledgerTransData = JSON.parse(JSON.stringify(this.editData.LedgerTransDetails));
        _.forEach(ledgerTransData, (item, index) => {
          if (this.editType === 'Contra') {
            this.voucherDatas[index]['Type'] = Number(item.CrDr)
            this.voucherDatas[index]['Amount'] = Number(item.Amount)
            this.voucherDatas[index]['LedgerId'] = Number(item.LedgerId)
          }
          if (this.editType === 'Journal') {
            const data = {
              Type: Number(item.CrDr),
              Amount: Number(item.Amount),
              LedgerId: Number(item.LedgerId),
              data: this.allLedgerList
            }
            this.voucherDataJ.push({ ...data });
          }
        })
      }
    }
  }

  setVoucherDate() {
    let _self = this
    $(function ($) {
      flatpickr('#voucher-date', {
        dateFormat: _self.clientDateFormat,
        defaultDate: [_self.gs.getDefaultDate(_self.clientDateFormat)]
      })
    })
    this.VoucherDate = _self.gs.getDefaultDate(_self.clientDateFormat)
  }

  private voucherAddParams() {
    let VoucherDate = this.gs.convertToSqlFormat(this.VoucherDate)
    if (this.tabId == 1 || this.tabId === 2 || this.tabId === 5 || this.tabId === 6) {
      let voucherList = JSON.parse(JSON.stringify(this.voucherList))
      voucherList.forEach(voucher => {
        if (voucher.BillDate) {
          voucher.BillDate = this.gs.convertToSqlFormat(new Date(voucher.BillDate))
        }
        if (voucher.BalanceType === 'OB') {
          voucher['IsAdvance'] = 2
        } else if (voucher.BalanceType === 'AD') {
          voucher['IsAdvance'] = 1
        }
        voucher['ParentId'] = voucher.Id
        voucher['Amount'] = +voucher.PaymentAmount
      })
      if (+this.advancePayment > 0) {
        voucherList.push({
          IsAdvance: 1,
          Amount: this.advancePayment
        })
      }
      let paymentDetails = [{
        Id: 0,
        Paymode: this.Paymode,
        PayModeId: this.PayModeId,
        LedgerId: this.LedgerId,
        BankLedgerName: this.BankLedgerName,
        Amount: +this.Amount,
        ChequeNo: this.Narration
      }]

      const voucherAddParams = {
        obj: {
          Id: this.editId ? this.editId : UIConstant.ZERO,
          OrgId: this.OrgId,
          VoucherType: this.voucherService.tabs[this.tabId - 1].voucherType,
          VoucherNo: this.VoucherNo,
          PartyId: this.PartyId,
          TotalAmount: +this.Amount,
          VoucherDate: VoucherDate,
          VoucherDatas: voucherList,
          PaymentDetails: paymentDetails
        } as VoucherAddModel
      }
      if (this.tabId === 5 || this.tabId === 6) {
        voucherAddParams.obj['IsIncomeExpence'] = 1
      }
      return voucherAddParams.obj
    } else {
      let voucherData = []
      if (this.tabId === 3) {
        voucherData = JSON.parse(JSON.stringify(this.voucherDatas));
      }
      if (this.tabId === 4) {
        voucherData = JSON.parse(JSON.stringify(this.voucherDataJ))
        if (+voucherData[voucherData.length - 1]['LedgerId'] === 0) {
          voucherData.splice(voucherData.length - 1, 1)
        }
      }
      _.forEach(voucherData, (item, index) => {
        _.omit(voucherData[index], ['data']);
      })
      let obj = {
        Id: this.editId ? this.editId : UIConstant.ZERO,
        OrgId: this.OrgId,
        VoucherType: this.voucherService.tabs[this.tabId - 1].voucherType,
        VoucherNo: this.VoucherNo,
        TotalAmount: +this.Amount,
        VoucherDate: VoucherDate,
        Narration: this.Narration,
        VoucherDatas: voucherData
      }
      return obj
    }
  }

  resetForm() {
    this.voucherDataJ = [{
      LedgerId: '0',
      Amount: 0,
      Type: 0,
      data: this.allLedgerList,
      default: 0
    }
    ]
    this.voucherDatas = [{
      LedgerId: 0,
      Amount: 0,
      Type: 0,
      data: this.paymentLedgerselect2,
    }]
  }

  manipulateData() {
    let _self = this
    this.submitSave = true
    if (this.checkForValidation()) {
      if (this.tabId === 2 || this.tabId === 1 || this.tabId === 6 || this.tabId === 5) {
        this.voucherService.postVoucher(this.voucherAddParams()).pipe(takeUntil(this.onDestroy$), filter(data => {
          if (data.Code === UIConstant.THOUSAND) { return true } else { throw new Error(data.Description) }
        }), catchError(error => { return throwError(error) }), map(data => data.Data)).subscribe(
          data => {
            if (data) {
              _self.toastrService.showSuccess(UIConstant.SAVED_SUCCESSFULLY, '')
              _self.commonService.newVoucherAdd()
              _self.commonService.closeVoucher()
              this.resetForm()
              this.closeModal()
            }
          },
          (error) => {
            _self.toastrService.showError(error, '')
          }
        )
      } else if (this.tabId === 3 || this.tabId === 4) {
        this.voucherService.postVoucherContraJournal(this.voucherAddParams()).pipe(takeUntil(this.onDestroy$), filter(data => {
          if (data.Code === UIConstant.THOUSAND) { return true } else { throw new Error(data.Description) }
        }), catchError(error => { return throwError(error) }), map(data => data.Data)).subscribe(
          data => {
            if (data) {
              _self.toastrService.showSuccess(UIConstant.SAVED_SUCCESSFULLY, '')
              _self.commonService.newVoucherAdd()
              _self.commonService.closeVoucher()
              this.resetForm()
              this.closeModal()
            }
          },
          (error) => {
            _self.toastrService.showError(error, '')
          }
        )
      }
    }
  }

  updateAmount() {
    if (this.autoBill) {
      let totalAmount = +this.Amount
      if (this.voucherList.length > 0) {
        this.voucherList.forEach(element => {
          if (!element['Rejected']) {
            if (totalAmount >= +element['Balance']) {
              element['PaymentAmount'] = +element['Balance']
              element['selected'] = true
              totalAmount = +totalAmount - element['PaymentAmount']
              if (this.voucherList.length === 1) {
                this.selectAll = true
              }
            } else {
              element['PaymentAmount'] = +totalAmount
              if (+totalAmount > 0) {
                element['selected'] = true
                totalAmount = +totalAmount - element['PaymentAmount']
              } else {
                element['selected'] = false
              }
              return
            }
          } else {
            element['PaymentAmount'] = 0
          }
        })
      }
    } else {
      if (!_.isEmpty(this.voucherList)) {
        this.Amount = 0
        this.advancePayment = 0
        this.voucherList.forEach(element => {
          if (!element.isPaymentEnable && element['selected']) {
            element.isPaymentEnable = true;
            element['PaymentAmount'] = element['Balance'];
          } else if (element.isPaymentEnable && !element['selected']) {
            element['PaymentAmount'] = 0;
            element.isPaymentEnable = false;
          } else if (!element.isPaymentEnable && !element['selected']) {
            element.isPaymentEnable = false;
            element['PaymentAmount'] = 0;
          }
          if (element['selected'] && element['PaymentAmount'] > 0) {
            this.Amount += +element['PaymentAmount']
            element['selected'] = true
          } else {
            element['selected'] = false
          }
        })
      }
    }
    this.checkForRows()
    this.checkForAdvancePayment()
  }

  setAdvancePaymentForNoVoucherList(event) {
    if (event.target.value && (this.tabId === 1 || this.tabId === 2) && this.PartyId && _.isEmpty(this.voucherList)) {
      if (event.target.value > 0) {
        this.getAdvancePaymentBillNo(event.target.value)
      }
    }
  }

  getAdvancePaymentBillNo(amount) {
    const request = this.tabId === 1 ? 'ADVANCEPAYMENT' : 'ADVANCERECEIPT';
    this.voucherService.getBillNoForAdvancePayment(request).subscribe((res) => {
      if (res.Code === 1000 && !_.isEmpty(res.Data)) {
        this.advanceBillNo = Number(res.Data[0].BillNo);
        this.advancePayment = amount;
      } else {
        this.advanceBillNo = null
      }
    })
  }

  trackByFn(index) {
    return index;
  }

  checkForRows() {
    if (this.voucherList.length > 0) {
      let selectAll = true
      for (let i = 0; i < this.voucherList.length; i++) {
        if (!this.voucherList[i].selected) {
          selectAll = false
          break
        }
      }
      this.selectAll = selectAll
    } else {
      this.selectAll = false
    }
  }

  onVoucherToggle(index, e: Event) {
    if (!this.autoBill) {
      if (!this.voucherList[index].selected) {
        this.voucherList[index]['PaymentAmount'] = 0
      } else {
        this.voucherList[index]['PaymentAmount'] = +this.voucherList[index]['Balance']
      }
      this.updateAmount()
    }
    if (+this.Amount > 0 && this.autoBill) {
      if (!this.voucherList[index].selected) {
        this.voucherList[index]['Rejected'] = true
        this.updateAmount()
      }
      if (this.voucherList[index].selected) {
        this.voucherList[index]['Rejected'] = false
        this.updateAmount()
      }
    } else {
      this.advancePayment = 0
    }
  }

  checkForAdvancePayment() {
    let amount = 0
    if (+this.Amount > 0 && this.autoBill && this.voucherList.length > 0) {
      this.voucherList.forEach(voucher => {
        if (voucher.selected) {
          amount += voucher['PaymentAmount']
        }
      })
      if (amount < +this.Amount) {
        const advancePayment = +this.Amount - amount
        if (advancePayment > 0) {
          this.getAdvancePaymentBillNo(advancePayment)
        }
      } else {
        this.advancePayment = 0
      }
    }
    else if (!this.autoBill && this.voucherList.length > 0) {
      this.advancePayment = 0
      let advancePayment = 0
      this.Amount = 0
      let storedAmount = 0
      this.voucherList.forEach((voucher, index) => {
        if (voucher['selected'] && voucher['PaymentAmount'] > 0) {
          if (Number(voucher['PaymentAmount']) > Number(voucher['Balance'])) {
            advancePayment = Number(advancePayment) + (Number(voucher['PaymentAmount']) - Number(voucher['Balance']))
            voucher['PaymentAmount'] = +voucher['Balance']
            storedAmount = +storedAmount + +voucher['PaymentAmount']
          } else {
            storedAmount = +storedAmount + +voucher['PaymentAmount']
          }
        }
        this.voucherList[index] = JSON.parse(JSON.stringify(voucher));
        $(`PaymentAmount${index}`).focus();
        if (!_.isEmpty(this.payMentAmountRef) && !_.isEmpty(this.payMentAmountRef.first)) {
          setTimeout(() => {
            this.payMentAmountRef.first.nativeElement.focus({ preventScroll: false })
          }, 300);
        }
      })
      this.Amount = storedAmount + advancePayment
      if (advancePayment > 0) {
        this.getAdvancePaymentBillNo(advancePayment);
      }
    }
  }

  checkForValidation() {
    let isValid = 1
    if (this.tabId === 1 || this.tabId === 2 || this.tabId === 5 || this.tabId === 6) {
      if (+this.Amount > 0 && this.voucherList.length > 0) {
        if (+this.PayModeId > 0) {
          this.invalidObj['PayModeId'] = false
        } else {
          isValid = 0
          this.invalidObj['PayModeId'] = true
        }
        if (+this.LedgerId > 0) {
          this.invalidObj['LedgerId'] = false
        } else {
          isValid = 0
          this.invalidObj['LedgerId'] = true
        }
        if (+this.Amount > 0) {
          this.invalidObj['Amount'] = false
        } else {
          isValid = 0
          this.invalidObj['Amount'] = true
        }
      } else {
        isValid = 1
      }
      return !!isValid
    } else if (this.tabId === 3) {
      if (this.voucherDatas.length > 1) {
        if (this.voucherDatas[0].Type !== this.voucherDatas[1].Type
          && +this.voucherDatas[0].Amount > 0
          && +this.voucherDatas[0].LedgerId > 0 && +this.voucherDatas[1].LedgerId > 0) {
          isValid = 1
        }
      } else {
        isValid = 0
      }
      return !!isValid
    } else if (this.tabId === 4) {
      let sumCr = 0
      let sumDr = 0
      if (this.voucherDataJ.length > 1) {
        this.voucherDataJ.forEach(element => {
          if (element.Type === 1) {
            sumCr += +element.Amount
          } else if (element.Type === 0) {
            sumDr += +element.Amount
          }
        });
        if (sumCr !== sumDr && this.submitSave) {
          isValid = 0
          this.toastrService.showError('Cr is not equal to Dr', '')
        }
      } else {
        isValid = 0
      }
      return !!isValid
    } else {
      this.invalidObj = {}
      return true
    }
  }

  deleteItem(index: number): void {
    this.enableDisableLedger(+this.voucherDataJ[index].LedgerId, false)
    this.voucherDataJ.splice(index, 1)
  }

  @ViewChildren('first') first: QueryList<Select2Component>

  addItems() {
    this.enableDisableLedger(+this.voucherDataJ[this.voucherDataJ.length - 1].LedgerId, true)
    if (+this.voucherDataJ[this.voucherDataJ.length - 1]['Amount'] > 0 &&
      +this.voucherDataJ[this.voucherDataJ.length - 1]['LedgerId'] > 0) {
      this.voucherDataJ.push({
        LedgerId: '0',
        Amount: 0,
        Type: 0,
        data: this.allLedgerList,
        default: 0
      })
      setTimeout(() => {
        this.first.forEach((item: Select2Component, index: number) => {
          if (index === (this.voucherDataJ.length - 1)) {
            item.selector.nativeElement.focus({ preventScroll: false })
          }
        })
      }, 100)
    }
  }
  CRDRId: number
  onchangesCRDRType(id) {
    this.CRDRId = +id
  }

  enableDisableLedger(ledgerId, toDisable) {
    if (+ledgerId > 0) {
      let index = this.allLedgerList.findIndex(ledger => +ledger.id === +ledgerId)
      if (index >= 0) {
        let text = this.allLedgerList[index].text
        this.allLedgerList.splice(index, 1)
        let newData = Object.assign([], this.allLedgerList)
        newData.push({ id: ledgerId, text: text, disabled: toDisable })
        this.allLedgerList = newData

      }
    }
  }

  setFocus() {
    setTimeout(() => {
      if (this.organisationSelect2) {
        this.organisationSelect2.selector.nativeElement.focus({ preventScroll: false })
      }
    }, 900)
  }

 async onTabClick(tabId) {
    this.initParams();
    this.tabId = tabId;
    await this.getSPUitilityData();
    this.getNewBillNo();
    if (this.tabId === 1) {
      this.ledgerPlaceholder = { placeholder: 'Select Party' };
    }
    if (this.tabId === 2) {
      this.ledgerPlaceholder = { placeholder: 'Select Vendor / Customer' }
    }
    if (this.tabId === 4) {
      this.ledgerPlaceholder = { placeholder: 'Select Ledger' }

    }
    if (this.tabId === 5) {
      this.ledgerPlaceholder = { placeholder: 'Select Expenses' }
    }
    if (this.tabId === 6) {
      this.ledgerPlaceholder = { placeholder: 'Select Income' }
    }
   if (this.editId) {
     this.assignVoucherData(this.editData)
   }
    this.setFocus()
  }

  setTypeForOther(index) {
    if (index === 0) {
      this.voucherDatas[1]['Type'] = (this.voucherDatas[0]['Type'] === 1) ? 0 : 1
    }
  }

  setAmountForOther(index) {
    if (index === 0) {
      this.voucherDatas[1]['Amount'] = this.voucherDatas[0]['Amount']
    }
  }

  ngOnDestroy() {
    this.onDestroy$.next()
    this.onDestroy$.complete()
    this.subscribe.unsubscribe()
  }
}

interface VoucherDatas {
  LedgerId: any,
  Amount: number,
  Type: number,
  data: Array<Select2OptionData>,
  default?: number,
  incorrect?: boolean
}
