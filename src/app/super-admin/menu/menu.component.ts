import { Component, OnInit } from '@angular/core';
import { ToastrCustomService } from '../../commonServices/toastr.service';
import { MenuService } from './menu.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  menuList = []
  moduleList = []
  p: number = 1
  itemsPerPage: number = 20
  total: number = 0
  lastItemIndex: number = 0
  p1: number = 1
  itemsPerPage1: number = 20
  total1: number = 0
  lastItemIndex1: number = 0
  onDestroy$: Subscription
  constructor(private menuService: MenuService, private toastrService: ToastrCustomService) {
    this.getList()
    this.getModuleList()
    this.getModulesList()
    this.getIndustryList()
    this.onAdd()
  }

  onAdd () {
    this.onDestroy$ = this.menuService.onMenuAdd$.subscribe(
      () => {
        this.getList()
      }
    )
  }

  onEdit (menuId) {
    this.menuService.getMenuList(`?Id=${menuId}`).subscribe(
      (data) => {
        console.log('editdata : ', data)
        // this.menuService.onOpenModal(data)
      },
      (error) => {
        this.toastrService.showError(error, '')
      }
    )
  }

  getModuleList () {
    let _self = this
    this.menuService.getModuleInIndustry(`?Page=${this.p1}&Size=${this.itemsPerPage1}`).subscribe(
      (data) => {
        // console.log('module list in industry : ', data)
        _self.moduleList = data
        this.total1 = _self.moduleList[0] ? _self.moduleList[0].TotalRows : 0
      },
      (error) => {
        this.toastrService.showError(error, '')
      }
    )
  }

  getList () {
    let _self = this
    this.menuService.getMenuList(`?Page=${this.p}&Size=${this.itemsPerPage}`).subscribe(
      (data) => {
        console.log('menu list : ', data)
        _self.menuList = data
        _self.total = _self.menuList[0] ? _self.menuList[0].TotalRows : 0
      },
      (error) => {
        this.toastrService.showError(error, '')
      }
    )
  }

  openModal () {
    this.menuService.onOpenModal()
  }
  ngOnInit() {
  }

  getModulesList () {
    let _self = this
    this.menuService.getModulesList().subscribe(
      (data) => {
        // console.log(data)
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
        // console.log(data)
        this.menuService.returnSelect2List(data, 'Industries')
      },
      (error) => {
        _self.toastrService.showError(error, '')
      }
    )
  }

  ngOnDestroy() {
    this.onDestroy$.unsubscribe()
  }
}
