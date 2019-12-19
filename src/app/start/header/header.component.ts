import { ToastrCustomService } from './../../commonServices/toastr.service';
import { ItemmasterServices } from './../../commonServices/TransactionMaster/item-master.services';
import { LoginService } from './../../commonServices/login/login.services';
import { Component, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core'
import { CommonService } from 'src/app/commonServices/commanmaster/common.services';
import { Settings } from 'src/app/shared/constants/settings.constant';
import { ChangeUserNameComponent } from 'src/app/shared/components/change-user-name/change-user-name.component';
declare const $: any
import * as _ from 'lodash'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  @ViewChild('changeUserNameContainerRef', { read: ViewContainerRef }) changeUserNameContainerRef: ViewContainerRef;
  changeUserNameRef: any;
  loggedinUserData: any = {}
  showProfileStatus: any = {
    profileOpen: false,
    editMode: false
  }
  clientDateFormat: string = ''
  profile_img: string;
  imageList: any = { images: [], queue: [], safeUrls: [], baseImages: [], id: [] }
  ImageFiles: any = []
  constructor (
    private settings: Settings,
    public _loginService: LoginService,
    public commonService: CommonService,
    private resolver: ComponentFactoryResolver,
    private itemMaster: ItemmasterServices,
    private toaster: ToastrCustomService,
    ) {
    this.commonService.setupChange$.subscribe(() => {
      this.clientDateFormat = this.settings.dateFormat
    })
    // console.log(this.settings.dateFormat)
    this.clientDateFormat = this.settings.dateFormat
    const organization = JSON.parse(localStorage.getItem('SELECTED_ORGANIZATION'))
    this.loggedinUserData = {
      'fromDate': this.settings.finFromDate,
      'toDate': this.settings.finToDate,
      'name': organization.Name
    }
    this.profile_img = '../../../assets/img/man.png'
    this.commonService.sideMenuProfileImg = '../../../assets/img/man.png'
    if (!this.commonService.isEmpty(this._loginService.userData)) {
      if(!this.commonService.isEmpty(this._loginService.userData.ImageContents[0])){
        this.commonService.sideMenuProfileImg = this._loginService.userData.ImageContents[0].FilePath
      }
      if (!this.commonService.isEmpty(this._loginService.userData.LoginUserDetailsinfo[0])) {
        this.commonService.orgUserName = this._loginService.userData.LoginUserDetailsinfo[0].Name
      }
    }
  }
  public siderbarMenu () {
    $('.app').toggleClass('is-collapsed')
    $('.sidebar').toggleClass('page-container')
  }

  openChangeUserNameModal(data) {
    this.commonService.loadModalDynamically(this, 'changeUserNameContainerRef', 'changeUserNameRef', ChangeUserNameComponent,
      (res) => {
        if (res) {
          this.commonService.orgUserName = res
        }
      }, data);
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
}
