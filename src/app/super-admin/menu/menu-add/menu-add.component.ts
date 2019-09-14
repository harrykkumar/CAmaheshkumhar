import { Component, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { Settings } from '../../../shared/constants/settings.constant';
import { ToastrCustomService } from '../../../commonServices/toastr.service';
import { GlobalService } from '../../../commonServices/global.service';
import { MenuService } from '../menu.service';
import { AddCust } from '../../../model/sales-tracker.model';
import { UIConstant } from '../../../shared/constants/ui-constant';
import { Subscription } from 'rxjs';
import { Select2OptionData, Select2Component } from 'ng2-select2';
import { select2Return, PostMenu, PostModule } from '../../super-admin.model';
declare const $: any
@Component({
  selector: 'app-menu-add',
  templateUrl: './menu-add.component.html'
})
export class MenuAddComponent {
  onDestroy$: Subscription
  tabId: number = 1
  parentMenuData: Array<Select2OptionData> = []
  menuAdd = {}
  moduleAdd = {}
  moduleData: Array<Select2OptionData> = []
  industryData: Array<Select2OptionData> = []
  subModulesData: Array<Select2OptionData> = []
  constructor(private menuService: MenuService, 
    private toastrService: ToastrCustomService,
    private gs: GlobalService, private settings: Settings, private renderer: Renderer2) {
    this.onDestroy$ = this.menuService.modalOpenStatus$.subscribe(
      (status: AddCust) => {
        if (status.open) {
          this.openModal()
        } else {
          this.closeModal()
        }
      })
    this.onDestroy$ = this.menuService.select2$.subscribe((data: select2Return) => {
      if (data.data && data.type) {
        if (data.type === 'Menu') {
          this.parentMenuData = data.data
        } else if (data.type === 'Modules') {
          this.moduleData = data.data
        } else if (data.type === 'Industries') {
          this.industryData = data.data
        } else if (data.type === 'Sub Modules') {
          this.subModulesData = data.data
        }
      }
    })
    this.getParentMenuList()
  }

  onChange (evt: {value: string[]}, type) {
    if (evt.value) {
      if (type === 'sub') {
        this.moduleAdd['SubModuleId'] = evt.value.join(',')
      }
    }
  }

  private moduleAddParams(): PostModule {
    let moduleAdd = JSON.parse(JSON.stringify(this.moduleAdd))
    let obj = {...moduleAdd, Id: 0}
    console.log(JSON.stringify(obj))
    return obj
  }

  postModule () {
    let _self = this
    this.menuService.postModule(this.moduleAddParams()).subscribe(
      (data) => {
        console.log(' post module: ', data)
        _self.toastrService.showSuccess('Successfully done', '')
        _self.initComp()
      },
      (error) => {
        this.toastrService.showError(error, '')
      }
    )
  }

  private menuAddParams(): PostMenu {
    let menuAdd = JSON.parse(JSON.stringify(this.menuAdd))
    let obj = {...menuAdd, Id: 0}
    console.log(JSON.stringify(obj))
    return obj
  }

  postMenu () {
    let _self = this
    this.menuService.postMenu(this.menuAddParams()).subscribe(
      (data) => {
        console.log('parentMenu list : ', data)
        _self.toastrService.showSuccess('Successfully done', '')
        // _self.menuService.onCloseModal()
        _self.initComp()
        _self.menuService.onMenuAdd()
      },
      (error) => {
        this.toastrService.showError(error, '')
      }
    )
  }

  validate (form) {
    console.log(form)
    console.log(this.menuAdd)
  }

  getParentMenuList () {
    this.menuService.getMenuList('?IsParent=1').subscribe(
      (data) => {
        console.log('parentMenu list : ', data)
        this.menuService.returnSelect2List(data, 'Menu')
      },
      (error) => {
        this.toastrService.showError(error, '')
      }
    )
  }

  @ViewChild('first_menu') firstMenu: ElementRef
  @ViewChild('module_select2') moduleSelect2: Select2Component
  setFocus () {
    if (this.tabId === 1) {
      setTimeout(() => {
        const element = this.firstMenu.nativeElement
        element.focus({ preventScroll: false })
      }, 100)
    }
    if (this.tabId === 3) {
      setTimeout(() => {
        if (this.moduleSelect2) {
          this.moduleSelect2.selector.nativeElement.focus({ preventScroll: false })
        }
      }, 100)
    }
  }

  initComp () {
    this.menuAdd = {}
    this.moduleAdd = {}
  }

  getUtilityData () {
    this.getModulesList();
    this.getSubModuleList();
    this.getIndustryList();
  }

  getSubModuleList () {
    this.menuService.getSubModuleList().subscribe(
      (data) => {
        if (data && data.length > 0) {
          this.menuService.returnSelect2List(data, 'Sub Modules')
        }
      }
    )
  }

  getModulesList () {
    let _self = this
    this.menuService.getModulesList().subscribe(
      (data) => {
        console.log(data)
        this.menuService.returnSelect2List(data, 'Modules')
      },
      (error) => {
        _self.toastrService.showError(error, '')
      }
    )
  }

  getIndustryList () {
    let _self = this
    this.menuService.getIndustryList().subscribe(
      (data) => {
        console.log(data)
        this.menuService.returnSelect2List(data, 'Industries')
      },
      (error) => {
        _self.toastrService.showError(error, '')
      }
    )
  }

  openModal() {
    $('#menu_admin').modal(UIConstant.MODEL_SHOW)
    this.initComp()
  }

  closeModal () {
    if ($('#menu_admin').length > 0) {
      $('#menu_admin').modal(UIConstant.MODEL_HIDE)
    }
  }
}