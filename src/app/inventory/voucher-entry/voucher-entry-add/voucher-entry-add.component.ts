/**created by dolly garg */
import { Component, ViewChild, OnDestroy, ViewChildren, QueryList, ElementRef, Output, EventEmitter, OnInit, HostListener } from '@angular/core';
import { CommonService } from "src/app/commonServices/commanmaster/common.services";
import { map } from 'rxjs/internal/operators';
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
@Component({
  selector: 'voucher-entry-add',
  templateUrl: './voucher-entry-add.component.html'
})
export class VoucherEntryAddComponent implements OnInit, OnDestroy {
  @ViewChildren('paymentRef') payMentAmountRef: QueryList<ElementRef>
  @Output() voucherAddClosed = new EventEmitter();
  editId: number
  editType: string
  addType: string = '';
  addTypeId: number = 0;
  editData: any
  isPaymentAmount = false
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
  advanceBillNo: string;
  sumCr: number = 0
  sumDr: number = 0
  onDestroy$: Subscription[] = []
  @HostListener('window:keydown',['$event'])
  onKeyPress($event: KeyboardEvent) {
    // console.log($event)
    if(($event.altKey || $event.metaKey) && $event.keyCode == 18) {
      if(confirm(
        'It looks like you have been editing something. '
        + 'If you leave before saving, your changes will be lost.')){
        if (this.tabId < 6 && this.tabId > 0 && !this.dateStatus) {
          this.tabId++
        } else if (this.tabId === 6) {
          this.tabId = 1
        }
        this.onTabClick(this.tabId)
        this.setFocus()
        return true
      } else {
        return false
      }
    }
  }
  constructor(private commonService: CommonService, private purchaseService: PurchaseService,
    private voucherService: VoucherEntryServie, private settings: Settings, private gs: GlobalService,
    private toastrService: ToastrCustomService) {
    this.onDestroy$.push(this.commonService.getledgerCretionStatus().subscribe(
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
    ))
    this.onDestroy$.push(this.commonService.getLedgerStatus().subscribe(
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
    ))
    this.onDestroy$.push(this.commonService.getCustStatus().subscribe(
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
    ))
    this.onDestroy$.push(this.commonService.getVendStatus().subscribe(
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
    ))
    this.clientDateFormat = this.settings.dateFormat
    this.transferData = [
      { id: 0, text: 'Dr' },
      { id: 1, text: 'Cr' }
    ];
    // this.getSPUitilityData()
    this.onDestroy$.push(this.purchaseService.organisationsData$.subscribe(
      data => {
        if (data.data) {
          this.organisationsData = data.data
          if (this.organisationsData.length > 0) {
            this.OrgId = +this.organisationsData[0].id
            this.organisationValue = +this.organisationsData[0].id
            if (!this.voucherService.tabs[this.tabId - 1].voucherNoManual) {
              // this.VoucherDate = this.gs.getDefaultDate(this.clientDateFormat)
              // if (this.tabId === 1 || this.tabId === 2) {
              //   this.getNewBillNo()
              // }
            }
          }
        }
      }
    ))

    this.onDestroy$.push(this.voucherService.ledgerData$.subscribe(
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
    ))

    this.onDestroy$.push(this.purchaseService.paymentModesData$.subscribe(
      data => {
        if (data.data) {
          this.paymentModesData = data.data
        }
      }
    ))

    this.onDestroy$.push(this.voucherService.vendorData$.subscribe(
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
        if (this.addType && this.addTypeId) {
          this.loading = false
          this.getVoucherEntryListForParty()
        }
      }
    ))

    this.onDestroy$.push(this.voucherService.customerData$.subscribe(
      data => {
        if (data.data) {
          // let allledger = [{ id: '-1', text: UIConstant.ADD_NEW_OPTION }]
          this.ledgerData = data.data
          this.cashData = data.data
          this.voucherDatas[1] = {
            LedgerId: '0',
            Amount: 0,
            Type: 1,
            data: this.cashData,
          }
        }
        if (this.addType && this.addTypeId) {
          this.loading = false
          this.getVoucherEntryListForParty()
        }
      }
    ))
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
    this.onDestroy$.push(this.voucherService.getVoucherEntryDetails(voucherId).subscribe(
    (res) => {
      this.editData = JSON.parse(JSON.stringify(res));
      this.goToTab();
    }, 
    (error) => {
      this.toastrService.showError(error, '')
    }))
  }

  notToDisable: number = 0
  goToTab() {
    switch (this.editType) {
      case 'Payment':
        $('#vendorPaymentTabLink').click()
        this.notToDisable = 1
        this.onTabClick(1)
        break;
      case 'Receipt':
        $('#customerReceiptTabLink').click()
        this.notToDisable = 2
        this.onTabClick(2)
        break;
      case 'Contra':
        $('#contraTabLink').click()
        this.notToDisable = 3
        this.onTabClick(3)
        break;
      case 'Journal':
        $('#journalTabLink').click()
        this.notToDisable = 4
        this.onTabClick(4)
        break;
      case 'Expences':
        $('#paymentTabLink').click()
        this.notToDisable = 5
        this.onTabClick(5)
        break;
      case 'Income':
        $('#receiptTabLink').click()
        this.notToDisable = 6
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
    if (this.addType === 'sale') {
      this.tabId = 2
    } else {
      this.tabId = 1
    }
    this.getListOfEnableLedger()
    this.getjournalRefreshList()
    this.voucherDatas = []
    this.voucherDataJ = []
    this.initComp()
    this.getSetUpModules((JSON.parse(this.settings.moduleSettings).settings))
    setTimeout(() => {
      $('#voucher_modal').modal(UIConstant.MODEL_SHOW)
      this.setFocus()
    }, 1)
  }

  getVoucherEntryListForParty() {
    if (this.addType === 'sale') {
      this.tabId = 2
    }
    if (this.addType === 'purchase') {
      this.tabId = 1
    }
    const selectedOrg = JSON.parse(localStorage.getItem('SELECTED_ORGANIZATION'));
    const query = {
      ReportFor: this.addType,
      Type: 'Billwise',
      OrgId: +selectedOrg.Id,
      Id: +this.addTypeId
    }
    this.onDestroy$.push(this.voucherService.getVoucherEntryListForParty(query).pipe(
    map((data: any) => {
      data.forEach(element => {
        element['selected'] = false;
        element['rejected'] = false;
        element['PaymentAmount'] = 0;
        element['IsAdvance'] = 0
      });
      return data; 
    })).subscribe(
      (data) => {
        if (!_.isEmpty(data)) {
          data = this.updatePartyId(data)
          this.voucherList = data
        } else {
          this.voucherList = []
          this.Amount = 0
          this.advancePayment = 0
          this.advanceBillNo = ''
        }
        this.updateAmount()
        this.checkForValidation()
        this.partySelect2.setElementValue(Number(data[0].LedgerId));
        this.PartyId = Number(data[0].LedgerId)
      },
      (error) => {
        this.toastrService.showError(error, '')
      }
    ))
  }

  closeModal(type?) {
    if ($('#voucher_modal').length > 0) {
      $('#voucher_modal').modal(UIConstant.MODEL_HIDE)
      this.voucherAddClosed.emit(type)
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
        // this.getNewBillNo()
        // this.getVoucherList()
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
      this.onDestroy$.push(this.gs.manipulateResponse(this.voucherService.getTransactionNo(auto,
        +this.OrgId, newVoucherDate, auto)).subscribe(data => {
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
        }
      ))
    }
  }

  JournalDataForLedger: any = []
  loading = true
  getSPUitilityData() {
    return new Promise((resolve) => {
      this.loading = true
      let _self = this
      this.onDestroy$.push(this.gs.manipulateResponse(this.commonService.getSPUtilityData(this.voucherService.tabs[this.tabId - 1].type)).
        subscribe(data => {
          _self.setVoucherDate(data.TransactionNoSetups[0].CurrentDate)
          _self.purchaseService.createOrganisations(data.Organizations)
          _self.JournalDataForLedger = data.Customers
          let journalData = _self.voucherService.allLedgerList(data.Customers, UIConstant.JOURNAL_TYPE)
          if (journalData) {
            _self.getLedgerJournalData(journalData)
          }
          if (_self.voucherService.tabs[_self.tabId - 1].type === UIConstant.PAYMENT_TYPE
            || _self.voucherService.tabs[_self.tabId - 1].type === UIConstant.RECEIPT_TYPE) {
            _self.purchaseService.createPaymentModes(data.PaymentModes)
            if (_self.voucherService.tabs[_self.tabId - 1].type === UIConstant.PAYMENT_TYPE) {
              _self.voucherService.createVendors(data.Vendors, UIConstant.PAYMENT_TYPE)
            } else if (_self.voucherService.tabs[_self.tabId - 1].type === UIConstant.RECEIPT_TYPE) {
              _self.voucherService.createCustomers(data.Customers, UIConstant.RECEIPT_TYPE, _self.multipleBillSettlement)
            }
          } else if (_self.voucherService.tabs[_self.tabId - 1].type === UIConstant.CONTRA_TYPE) {
            _self.voucherService.createVendors(data.Vendors, UIConstant.CONTRA_TYPE)
            _self.voucherService.createCustomers(data.Customers, UIConstant.CONTRA_TYPE, _self.multipleBillSettlement)
          } else if (_self.tabId === 5 || _self.tabId === 6) {
            _self.voucherService.createVendors(data.Vendors, _self.voucherService.tabs[_self.tabId - 1].type)
          }
          if (data.TransactionNoSetups.length > 0) {
            if (!this.voucherService.tabs[this.tabId - 1].voucherNoManual) {
              this.VoucherNo = data.TransactionNoSetups[0].BillNo
              this.previousVoucherNo = ''
            } else {
              this.VoucherNo = ''
              this.previousVoucherNo = data.TransactionNoSetups[0].BillNo
            }
          } else {
            this.previousVoucherNo = ''
            this.VoucherNo = ''
          }
          resolve('success');
        },
        (error) => {
          _self.toastrService.showError(error, '')
          _self.loading = false
        },
        () => {
          if (this.editId) {
            _self.loading = false
            console.log('edit data : ', this.editData)
            this.assignVoucherData(this.editData)
          }
          if (!(this.addType && this.addTypeId)) {
            _self.loading = false
          }
        }
      ))
    })
  }

  billSettlementType: number = 1
  multipleBillSettlement: boolean = false
  getSetUpModules(settings) {
    if (this.tabId === 1 || this.tabId === 2) {
      settings.forEach(element => {
        if (element.id === SetUpIds.paymentAutoVoucher) {
          this.voucherService.tabs[0].voucherNoManual = element.val
        }
        if (element.id === SetUpIds.receiptAutoVoucher) {
          this.voucherService.tabs[1].voucherNoManual = element.val
        }
        if (element.id === SetUpIds.billSettlementType) {
          this.billSettlementType = +element.val
        }
        if (element.id === SetUpIds.multipleBillSettlement) {
          this.multipleBillSettlement = element.val
        }
      })
    }
  }

  updatePartyId (data) {
    data.forEach(element => {
      element['PartyId'] = this.PartyId
    })
    return data
  }

  getVoucherList() {
    if (!this.editId) {
      if (this.PartyId > 0 && +this.OrgId > 0) {
        return new Promise((resolve, reject) => {
          this.onDestroy$.push(this.voucherService.getVoucherList(this.voucherService.tabs[this.tabId - 1].ReportFor, 'Billwise', this.PartyId, +this.OrgId)
          .pipe(map((data: any) => { 
            data.forEach(element => {
              element['selected'] = false;
              element['rejected'] = false;
              element['PaymentAmount'] = 0;
              element['IsAdvance'] = 0 
            }); 
            return data; 
          })).subscribe(
            data => {
            console.log('voucher data : ', data)
            if (!_.isEmpty(data)) {
              data = this.updatePartyId(data)
              this.voucherList = data
            } else {
              this.voucherList = []
              this.Amount = 0
              this.advancePayment = 0
              this.advanceBillNo = ''
            }
            this.updateAmount()
            this.checkForValidation()
            resolve('done')
          },
          (error) => {
            this.toastrService.showError(error, '')
            reject()
          }
        ))
        })
      }
      else if (this.addNewLedgerFlag) {
        if (this.PartyId === -1) {
          this.partySelect2.selector.nativeElement.value = ''
          this.commonService.openConfirmation(false, ' ')
        } else {
          this.voucherList = []
        }
      }
    }
  }

  getVoucherList_Payment_recipt() {
    if (!this.editId) {
      if (this.PartyId > 0 && +this.OrgId > 0) {
        this.onDestroy$.push(this.voucherService.getVoucherList(this.voucherService.tabs[this.tabId - 1].ReportFor,
          'Billwise', this.PartyId, +this.OrgId)
        .pipe(
          map((data: any) => {
            data.forEach(element => {
              element['selected'] = false;
              element['rejected'] = false;
              element['PaymentAmount'] = 0;
              element['IsAdvance'] = 0 
            }); 
            return data; 
          })).subscribe(
            data => {
              if (!_.isEmpty(data)) {
                this.voucherList = data
              } else {
                this.voucherList = []
                this.Amount = 0
                this.advancePayment = 0
                this.advanceBillNo = ''
              }
              this.updateAmount()
              this.checkForValidation()
            },
            (error) => {
              this.toastrService.showError(error, '')
            }
          ))
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
      if (+event.value !== 1) {
        this.BankLedgerName = ''
        this.LedgerId = 0
        this.setpaymentLedgerSelect2(+event.value)
      } else if (+event.value === 1) {
        this.setLedgerSelectForCash();
      }
      this.invalidObj['PayModeId'] = false;
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

  setpaymentLedgerSelect2(paymentId) {
    if (+paymentId > 0) {
      let _self = this
      let newData = [{ id: '0', text: 'Select Ledger' }, { id: '-1', text: UIConstant.ADD_NEW_OPTION }]
      this.onDestroy$.push(this.gs.manipulateResponse(this.commonService.getPaymentLedgerDetail(paymentId)).subscribe(data => {
        data.forEach(element => {
          newData.push({
            id: element.Id,
            text: element.Name
          })
        })
        _self.paymentLedgerselect2 = newData
      },
      (error) => console.log(error),
      () => {
        if (this.editId) {
          setTimeout(() => {
            this.LedgerId = !_.isEmpty(this.editData.PaymentDetails[0]) ? this.editData.PaymentDetails[0].LedgerId : 0
            this.ledger =  !_.isEmpty(this.editData.PaymentDetails[0]) ? this.editData.PaymentDetails[0].LedgerId : 0
            this.checkForValidation()
          }, 0)
        }
      }))
    }
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
      this.invalidObj['LedgerId'] = false
    }
    if (+event.value === -1) {
      this.ledgerSelect2.selector.nativeElement.value = ''
      this.commonService.openLedger('')
    }
    this.checkForValidation()
  }

  onChangeAmount() {
    if (this.Amount) {
      this.invalidObj['Amount'] = false;
    }
  }

  initPayment(Data?) {
    let paymentData, ledgerData
    if (!_.isEmpty(Data)) {
      paymentData = { ...Data.PaymentDetails[0] }
      ledgerData = { ...Data.LedgerVoucherMst[0] }
    }
    this.Paymode = ''
    this.PayModeId = !_.isEmpty(paymentData) ? paymentData.PayModeId : 0
    this.Amount = !_.isEmpty(paymentData) ? paymentData.Amount : 0
    this.BankLedgerName = !_.isEmpty(paymentData) ? paymentData.BankLedgerName : ''
    this.Narration = !_.isEmpty(ledgerData) ? ledgerData.Narration : ''
    this.paymode = !_.isEmpty(paymentData) ? paymentData.PayModeId : 0
    if (!_.isEmpty(paymentData) && Number(paymentData.LedgerId) === 1) {
      this.setLedgerSelectForCash()
      this.checkForValidation()
    } else {
      this.setpaymentLedgerSelect2(this.PayModeId)
    }
  }

  @ViewChild('party_select2') partySelect2: Select2Component
  initParams() {
    this.initPayment()
    this.notToDisable = 0
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
    if (this.paymentSelect2) {
      this.paymentSelect2.setElementValue(0)
    }
    this.autoBill = true
    this.selectAll = false
    this.advancePayment = 0
    this.ledgerValue = 0
    this.voucherList = []
    this.invalidObj = {}
    this.idsBefore = []
    this.submitSave = false
    this.dateStatus = false
    this.sumCr = 0
    this.sumDr = 0
    this.VoucherDate = ''
  }

  onAddNew () {
    this.getNewBillNo()
  }

  assignVoucherData(Data) {
    console.log('voucher data : ', Data)
    let ledgerData
    if (!_.isEmpty(Data) && !_.isEmpty(Data.LedgerVoucherMst)) {
      ledgerData = { ...Data.LedgerVoucherMst[0] }
      this.VoucherDate = this.gs.utcToClientDateFormat(ledgerData.VoucherDate, this.clientDateFormat)
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
    }
    this.autoBill = true;
    this.selectAll = false
    this.advancePayment = 0
    if (this.tabId === 2 && this.multipleBillSettlement) {
      this.ledgerValue = (!_.isEmpty(ledgerData) && ledgerData.LedgerIds) ? ledgerData.LedgerIds.split(',') : []
    } else {
      this.ledgerValue = !_.isEmpty(ledgerData) ? ledgerData.LedgerId : 0
    }
    this.invalidObj = {}
    this.submitSave = false
    this.dateStatus = false
    if ((this.tabId === 1 || this.tabId === 2 || this.tabId === 5 || this.tabId === 6)
      && !_.isEmpty(Data) && !_.isEmpty(Data.ReceiptPaymentTransaction)) {
      const advancePaymentRowIndex = _.findIndex(Data.ReceiptPaymentTransaction, { BalanceType: 'AD' });
      // const advancePaymentRow = Data.ReceiptPaymentTransaction[advancePaymentRowIndex]
      if (advancePaymentRowIndex !== -1) {
        Data.ReceiptPaymentTransaction.splice(advancePaymentRowIndex, 1);
      }
      this.voucherList = JSON.parse(JSON.stringify(Data.ReceiptPaymentTransaction))
      if (_.isEmpty(this.voucherList)) {
        this.getAdvancePaymentBillNo(this.Amount)
      }
      this.updateAmount()
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

  setVoucherDate(date: string) {
    this.VoucherDate = this.gs.utcToClientDateFormat(date, this.clientDateFormat)
    console.log('this.VoucherDate : ', this.VoucherDate)
  }

  private voucherAddParams() {
    let ApplyTerms = this.voucherService.tabs[this.tabId - 1].type
    let VoucherDate = this.gs.clientToSqlDateFormat(this.VoucherDate, this.clientDateFormat)
    if (this.tabId == 1 || this.tabId === 2 || this.tabId === 5 || this.tabId === 6) {
      let voucherList = JSON.parse(JSON.stringify(this.voucherList))
      voucherList.forEach(voucher => {
        if (voucher.BillDate) {
          voucher.BillDate = this.gs.convertToSqlFormat(voucher.BillDate)
        }
        if (voucher.BalanceType === 'OB') {
          voucher['IsAdvance'] = 2
        } else if (voucher.BalanceType === 'AD') {
          voucher['IsAdvance'] = 1
        }
        voucher['ParentId'] = voucher.Id
        voucher['Amount'] = +voucher.PaymentAmount
      })
      if (+this.advancePayment > 0 && !(this.tabId === 2 && this.multipleBillSettlement)) {
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
          Id: this.editId ? this.editId : 0,
          OrgId: this.OrgId,
          VoucherType: this.voucherService.tabs[this.tabId - 1].voucherType,
          VoucherNo: this.VoucherNo,
          PartyId: this.PartyId,
          TotalAmount: +this.Amount,
          VoucherDate: VoucherDate,
          IsGroupTransaction: (this.tabId === 2) ? +this.multipleBillSettlement : 0,
          VoucherDatas: voucherList,
          PaymentDetails: paymentDetails,
          ApplyPayMethod: (this.tabId == 1 || this.tabId === 2 ) ? +this.autoBill : 1,
          ApplyTerms: ApplyTerms
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
        Id: this.editId ? this.editId : 0,
        OrgId: this.OrgId,
        VoucherType: this.voucherService.tabs[this.tabId - 1].voucherType,
        VoucherNo: this.VoucherNo,
        TotalAmount: +this.Amount,
        VoucherDate: VoucherDate,
        Narration: this.Narration,
        VoucherDatas: voucherData,
        ApplyPayMethod: 1,
        ApplyTerms: ApplyTerms
      }
      return obj
    }
  }

  manipulateData(mode: string) {
    let _self = this
    this.submitSave = true
    if (this.checkForValidation(true)) {
      if (this.tabId === 2 || this.tabId === 1 || this.tabId === 6 || this.tabId === 5) {
        this.onDestroy$.push(this.voucherService.postVoucher(this.voucherAddParams()).subscribe(
          data => {
            if (data) {
              _self.toastrService.showSuccess(UIConstant.SAVED_SUCCESSFULLY, '')
              if (mode === 'new') {
                _self.commonService.newVoucherAdd()
                this.closeModal(true)
              } else if (mode === 'reset') {
                this.initParams()
                this.onAddNew()
              }
              // _self.commonService.closeVoucher()
            }
          },
          (error) => {
            _self.toastrService.showError(error, '')
          }
        ))
      } else if (this.tabId === 3 || this.tabId === 4) {
        this.onDestroy$.push(this.voucherService.postVoucherContraJournal(this.voucherAddParams()).subscribe(
          data => {
            if (data) {
              _self.toastrService.showSuccess(UIConstant.SAVED_SUCCESSFULLY, '')
              if (mode === 'new') {
                _self.commonService.newVoucherAdd()
                this.closeModal()
              } else if (mode === 'reset') {
                this.setVoucherDatas(this.tabId)
                this.initParams()
                this.onAddNew()
              }
            }
          },
          (error) => {
            _self.toastrService.showError(error, '')
          }
        ))
      }
    }
  }

  setVoucherDatas (tabId) {
    if (tabId === 3) {
      this.voucherDatas = [{
        LedgerId: '0',
        Amount: 0,
        Type: 0,
        data: this.bankData,
      },
      {
        LedgerId: '0',
        Amount: 0,
        Type: 1,
        data: this.cashData,
      }]
    } else if (tabId === 4) {
      this.voucherDataJ = [{
        LedgerId: '0',
        Amount: 0,
        Type: 0,
        data: this.allLedgerList,
        default: 0
      }]
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
        console.log('voucherList', this.voucherList)
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
    if (event.target.value && (this.tabId === 1 || this.tabId === 2 && !(this.tabId === 2 && this.multipleBillSettlement))
      && this.PartyId > 0 && _.isEmpty(this.voucherList)) {
      if (event.target.value > 0) {
        this.getAdvancePaymentBillNo(event.target.value)
      }
    }
  }

  getAdvancePaymentBillNo(amount) {
    const request = this.tabId === 1 ? 'ADVANCEPAYMENT' : 'ADVANCERECEIPT';
    this.onDestroy$.push(this.voucherService.getBillNoForAdvancePayment(request).subscribe((res) => {
      if (!_.isEmpty(res)) {
        this.advanceBillNo = res[0].BillNo;
        this.advancePayment = amount;
      } else {
        this.advanceBillNo = ''
      }
    }))
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
        // this.voucherList[index] = JSON.parse(JSON.stringify(voucher));
        // $(`PaymentAmount${index}`).focus();
        // if (!_.isEmpty(this.payMentAmountRef) && !_.isEmpty(this.payMentAmountRef.first)) {
        //   setTimeout(() => {
        //     this.payMentAmountRef.first.nativeElement.focus({ preventScroll: false })
        //   }, 300);
        // }
      })
      this.Amount = storedAmount + advancePayment
      if (advancePayment > 0) {
        this.getAdvancePaymentBillNo(advancePayment);
      }
    }
  }

  checkForValidation(fromSave?) {
    let isValid = 1
    if (this.tabId === 1 || this.tabId === 2 || this.tabId === 5 || this.tabId === 6) {
      if ((+this.Amount > 0 && this.voucherList.length > 0) || fromSave) {
        if (+this.PartyId > 0) {
          this.invalidObj['PartyId'] = false
        } else if(isValid) {
          isValid = 0
          this.invalidObj['PartyId'] = true
          if (fromSave) {
            this.toastrService.showError('', 'Please Select Party');
            this.partySelect2.selector.nativeElement.focus({ preventScroll: false })
          }
        }
        if (+this.PayModeId > 0) {
          this.invalidObj['PayModeId'] = false
        } else if(isValid) {
          isValid = 0
          this.invalidObj['PayModeId'] = true
          if (fromSave) {
            this.toastrService.showError('', 'Please Select Payment Mode');
            this.paymentSelect2.selector.nativeElement.focus({ preventScroll: false })
          }
        }
        if (+this.LedgerId > 0) {
          this.invalidObj['LedgerId'] = false
        } else if(isValid) {
          isValid = 0
          this.invalidObj['LedgerId'] = true
          if (fromSave) {
            this.toastrService.showError('', 'Please Select Ledger');
            this.ledgerSelect2.selector.nativeElement.focus({ preventScroll: false })
          }
        }
        if (+this.Amount > 0) {
          this.invalidObj['Amount'] = false
        } else if(isValid) {
          isValid = 0
          this.invalidObj['Amount'] = true
          $('#Amount').focus();
          this.toastrService.showError('', 'Amount Should be greater than 0');
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
        } else if (fromSave) {
          if (this.voucherDatas[0].Type === this.voucherDatas[1].Type) {
            $('#contraType-1').focus();
            this.toastrService.showError('', 'Type should be different')
            isValid = 0
          } else if ((+this.voucherDatas[0].LedgerId === 0) || (+this.voucherDatas[1].LedgerId === 0)) {
            if(+this.voucherDatas[0].LedgerId === 0){
              $('#LedgerId-0 input').focus();
            } else if(+this.voucherDatas[1].LedgerId === 0){
              $('#LedgerId-1 input').focus();
            }
            this.toastrService.showError('', 'Please Select Ledger')
            isValid = 0
          }  else if ((+this.voucherDatas[0].Amount <= 0) || (+this.voucherDatas[1].Amount <= 0)) {
            $('#Amount').focus();
            this.toastrService.showError('', 'Amount Should be greater than zero');
            isValid = 0
          }
        }
      } else {
        isValid = 0
      }
      return !!isValid
    } else if (this.tabId === 4) {
      if (this.voucherDataJ.length > 1) {
        this.voucherDataJ.forEach((element, index) => {
           if(index < (this.voucherDataJ.length - 1)) {
            if(!Number(element.LedgerId)) {
              isValid = 0
              this.toastrService.showError('', 'Please Select Ledger')
              $(`#LedgerId-${index} input`).focus()
            } else if(!element.Amount) {
              isValid = 0
              this.toastrService.showError('', 'Amount should be greater than 0')
              $(`#Amount-${index}`).focus()
            }
           }
        });
        if (this.sumCr !== this.sumDr && this.submitSave) {
          isValid = 0
          this.toastrService.showError('Cr is not equal to Dr', '')
        }
      } else {
        this.voucherDataJ.forEach((element, index) => {
          if (!Number(element.LedgerId)) {
            isValid = 0
            this.toastrService.showError('', 'Please Select Ledger')
            $(`#LedgerId-${index} input`).focus()
          } else if (!element.Amount) {
            isValid = 0
            this.toastrService.showError('', 'Amount should be greater than 0')
            $(`#Amount-${index}`).focus()
          }
        });
        if (this.voucherDataJ.length > 0 && isValid) {
          if(Number(this.voucherDataJ[0].Type) === 0) {
            this.toastrService.showError('Please Add atleast one Cr', '')
            isValid = 0
            $('#addButton-0').focus()
          } else if(Number(this.voucherDataJ[0].Type) === 1) {
            this.toastrService.showError('Please Add atleast one Dr', '')
            isValid = 0
            $('#addButton-0').focus()
          }
        } else if(isValid) {
          // this.toastrService.showError('Please Add atleast one Dr', '')
          isValid = 0
        }
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

  evaluateCrDrSum(){
    if (this.voucherDataJ.length > 1) {
      this.sumCr = 0
      this.sumDr = 0
      this.voucherDataJ.forEach(element => {
        if (element.Type === 1) {
          this.sumCr += +element.Amount
        } else if (element.Type === 0) {
          this.sumDr += +element.Amount
        }
      });
    }
  }

  addItems(index) {
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
        $(`#LedgerId-${index + 1} input`).focus()
      }, 100)
      this.evaluateCrDrSum()
    }  else if (+this.voucherDataJ[this.voucherDataJ.length - 1]['LedgerId'] <= 0) {
      this.toastrService.showError('', 'Please Select Ledger')
      $(`#LedgerId-${index} input`).focus()
    } else if (+this.voucherDataJ[this.voucherDataJ.length - 1]['Amount'] <= 0) {
      this.toastrService.showError('', 'Amount should be greater than 0')
      $(`#Amount-${index}`).focus()
    }
  }

  CRDRId: number
  onchangesCRDRType(id) {
    this.CRDRId = +id
    this.evaluateCrDrSum()
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

  checkForBill () {
    if (!this.editId) {
      this.getNewBillNo()
    }
  }

  async onTabClick(tabId) {
    this.initParams();
    this.tabId = tabId;
    await this.getSPUitilityData();
    // this.getNewBillNo();
    if (this.tabId === 1) {
      this.ledgerPlaceholder = { placeholder: 'Select Vendor / Customer' }
    }
    if (this.tabId === 2) {
      this.ledgerPlaceholder = { multiple: this.multipleBillSettlement, placeholder: 'Select Party' }
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
    // if (this.editId) {
    //   console.log('edit data : ', this.editData)
    //   this.assignVoucherData(this.editData)
    // }
    this.setFocus()
  }

  idsBefore: any = []
  async onPartySelect (evt: any) {
    // if (this.addTypeId && this.addType) {
      console.log('on select : ', evt)
      if (!this.multipleBillSettlement || this.tabId === 1) {
        this.addNewLedgerFlag = true
        this.PartyId = +evt.value;
        this.getVoucherList()
      } else {
        this.addNewLedgerFlag = false
        let diff = _.differenceWith(evt.value, this.idsBefore)
        console.log('diff : ', diff)
        if(!_.isEmpty(diff)) {
          this.PartyId = +(diff[diff.length - 1])
          let voucherList = this.voucherList
          await this.getVoucherList()
          this.voucherList = this.voucherList.concat(voucherList)
        } else {
          let diff = _.differenceWith(this.idsBefore, evt.value)
          console.log('diff : ', diff)
          let partyId = +(diff[diff.length - 1])
          let voucherList = JSON.parse(JSON.stringify(this.voucherList))
          let _voucherList = _.filter(voucherList, (element) => {
            return element.PartyId !== partyId
          })
          this.voucherList = _voucherList
          console.log('newVoucher list : ', this.voucherList)
        }
        this.idsBefore = evt.value
      }
    // }
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
    if (this.onDestroy$ && this.onDestroy$.length > 0) {
      this.onDestroy$.forEach((element) => {
        element.unsubscribe()
      })
    }
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
