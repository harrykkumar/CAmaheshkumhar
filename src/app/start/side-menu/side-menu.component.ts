import { ChangeUserNameComponent } from './../../shared/components/change-user-name/change-user-name.component';
import { ApiConstant } from 'src/app/shared/constants/api';
import { BaseServices } from 'src/app/commonServices/base-services';
import { CommonService } from 'src/app/commonServices/commanmaster/common.services';
import { UIConstant } from './../../shared/constants/ui-constant';
import { ToastrCustomService } from 'src/app/commonServices/toastr.service';
import { SIDE_MENU_MODEL } from './side-menu-modal'
import { LoginService } from '../../commonServices/login/login.services'
import { Component, ViewContainerRef, ViewChild, ComponentFactoryResolver } from '@angular/core'
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
  @ViewChild('changeUserNameContainerRef', { read: ViewContainerRef }) changeUserNameContainerRef: ViewContainerRef;
  changeUserNameRef: any;
  imageList: any = { images: [], queue: [], safeUrls: [], baseImages: [], id: [] }
  ImageFiles: any = []
  loggedinUserData: any = {}
  moduleList: Array<any> = []
  sideMenu: Array<any> = []
  userName: any;
  currentModuleId: any;
  constructor (private _route: Router,
    public _loginService: LoginService,
    private spinnerService: NgxSpinnerService,
    private itemMaster: ItemmasterServices,
    private toaster: ToastrCustomService,
    public commonService: CommonService,
    private baseService: BaseServices,
    private resolver: ComponentFactoryResolver,
    ) {
      this.profile_img = '../../../assets/img/man.png'
      this.commonService.sideMenuProfileImg = '../../../assets/img/man.png'
    this.initSideMenuData();
    this.initUpdatePermission()
    if (!this.commonService.isEmpty(this._loginService.userData)) {
      if(!this.commonService.isEmpty(this._loginService.userData.ImageContents[0])){
        this.commonService.sideMenuProfileImg = this._loginService.userData.ImageContents[0].FilePath
      }
      if (!this.commonService.isEmpty(this._loginService.userData.LoginUserDetailsinfo[0])) {
        this.commonService.orgUserName = this._loginService.userData.LoginUserDetailsinfo[0].Name
      }
    }
    this.currentModuleId = JSON.parse(localStorage.getItem('SELECTED_MODULE')).Id
  }
  profile_img:any

  public siderbarMenu () {
    $('.app').toggleClass('is-collapsed')
    $('.sidebar').toggleClass('page-container')
  }

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
              this.commonService.sideMenuProfileImg = res.Data
              this.toaster.showSuccess('', 'Image Changed Successfully')
            } else {
              this.toaster.showError('', res.Message)
            }
          })
      }
    }
  }

  Homepage() {
    if (this.currentModuleId === 4) {
      this._route.navigate(['crm/dashboard'])
    } else {
      this._route.navigate(['/dashboard'])
    }
  }

  initSideMenuData = async () => {
    this.spinnerService.show()
    const selectedModule = JSON.parse(localStorage.getItem('SELECTED_MODULE'))
    this.loggedinUserData = { ...this._loginService.userData }
    console.log('this._loginService.userData.Modules : ', this._loginService.userData.Modules)
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
          console.log(subMenu, subMenu.CommonCode)
          const matchedSubMenu = _.find(SIDE_MENU_MODEL, {Id: subMenu.Id});
          if (!_.isEmpty(matchedSubMenu)) {
            subMenu['path'] = matchedSubMenu.path
            subMenu['icon'] = matchedSubMenu.icon
          } else if(subMenu.CommonCode > 0) {
            subMenu['path'] = "common-menu"
            subMenu['icon'] = ""
          } else if(subMenu.IsMasterSetting === 1) {
            subMenu['path'] = "menu-setting"
            subMenu['icon'] = ""
          }
        })
      }
    })
    console.log('side menu to check', this.sideMenu)
  }

  navigateTo = (selectedMenu) => {
    if (selectedMenu.path === "") {
      this._route.navigate(['dashboard'])
    } else if (selectedMenu.CommonCode > 0) {
      this._route.navigate([`${selectedMenu.path}/${selectedMenu.CommonCode}`]);
    } else if (selectedMenu.IsMasterSetting === 1) {
      this._route.navigate([`${selectedMenu.path}/${selectedMenu.Id}`]);
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
  openChangeUserNameModal(data) {
    const data1 = {
      title: 'Add User Name',
      label: 'Name',
      value: data
    }
    this.commonService.loadModalDynamically(this, 'changeUserNameContainerRef', 'changeUserNameRef', ChangeUserNameComponent,
      (res) => {
        if (res) {
          this.commonService.orgUserName = res
        }
      }, data1);
  }
}
