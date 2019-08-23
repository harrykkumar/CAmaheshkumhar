import { ToastrCustomService } from 'src/app/commonServices/toastr.service';
import { SIDE_MENU_MODEL } from './side-menu-modal'
import { LoginService } from '../../commonServices/login/login.services'
import { Component } from '@angular/core'
import { Router } from '@angular/router'
import * as _ from 'lodash'
import { NgxSpinnerService } from 'ngx-spinner';
import { ItemmasterServices } from 'src/app/commonServices/TransactionMaster/item-master.services';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css']
})
export class SideMenuComponent {
  imageList: any = { images: [], queue: [], safeUrls: [], baseImages: [], id: [] }
  ImageFiles: any = []
  loggedinUserData: any = {}
  moduleList: Array<any> = []
  sideMenu: Array<any> = []
  constructor (private _route: Router,
    public _loginService: LoginService,
    private spinnerService: NgxSpinnerService,
    private itemMaster: ItemmasterServices,
    private toaster: ToastrCustomService 
    ) {
      this.profile_img = '../../../assets/img/man.png'
    this.initSideMenuData();
    this.initUpdatePermission()
  }
  profile_img:any
  openImageModal() {
    this.getUploadedImages()
    this.itemMaster.openImageModal(this.imageList)
  }

  getUploadedImages = () => {
    this.itemMaster.imageAdd$.subscribe((response)=> {
      this.imageList = response;
      this.createImageFiles()
    })
  }
  createImageFiles() {
    let ImageFiles = []
    if (!_.isEmpty(this.imageList)) {
      for (let i = 0; i < this.imageList['images'].length; i++) {
        let obj = { Name: this.imageList['queue'][i], BaseString: this.imageList['images'][i], IsBaseImage: this.imageList['baseImages'][i] }
        ImageFiles.push(obj)
      }
      this.ImageFiles = ImageFiles
      if (!_.isEmpty(this.ImageFiles)) {
        const data = {
          "ImageFiles": this.ImageFiles
        }
        this._loginService.uploadUserImage(data).subscribe(
          (res) => {
            if (res.Status === 1000) {
              this.toaster.showSuccess('', 'Image Changed Successfully')
            } else {
              this.toaster.showError('', res.Message)
            }
          })
      }
    }
  }
  Homepage(){
    this._route.navigate(['/dashboard'])
  }

  initSideMenuData = async () => {
    this.spinnerService.show()
    const selectedModule = JSON.parse(localStorage.getItem('SELECTED_MODULE'))
    this.loggedinUserData = { ...this._loginService.userData }
    if (!_.isEmpty(this._loginService.userData) &&
      !_.isEmpty(this._loginService.userData.Modules)) {
      if (this._loginService.userData.Modules[selectedModule['index']]) {
        this.sideMenu = [...this.loggedinUserData.Modules[selectedModule['index']]['sideMenu']]
        this.initMenuPath()
      }
    }
    this.spinnerService.hide()
  }

  initMenuPath = () => {
    _.map(this.sideMenu, (menu) => {
      const matchedMenu = _.find(SIDE_MENU_MODEL, {Id: menu.Id});
      if (!_.isEmpty(matchedMenu)) {
        menu['path'] = matchedMenu.path
        menu['icon'] = matchedMenu.icon
      }
      if (menu && menu.subMenu && menu.subMenu.length > 0) {
        _.map(menu.subMenu, (subMenu) => {
          const matchedSubMenu = _.find(SIDE_MENU_MODEL, {Id: subMenu.Id});
          if (!_.isEmpty(matchedSubMenu)) {
            subMenu['path'] = matchedSubMenu.path
            subMenu['icon'] = matchedSubMenu.icon
          }
        })
      }
    })
  }

  navigateTo = (selectedMenu) => {
    if (selectedMenu.path === "") {
      this._route.navigate(['dashboard'])
    } else if (selectedMenu.CommonCode > 0) {
      this._route.navigate([`${selectedMenu.path}/${selectedMenu.CommonCode}`]);
    } else {
      this._route.navigate([selectedMenu.path])
    }
  }

  initUpdatePermission = () => {
    this._loginService.permissionUpdated.subscribe(
      (res) => {
        if (res === true) {
          this.initSideMenuData()
        }
      })
  }
}
