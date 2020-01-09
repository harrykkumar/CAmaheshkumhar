import { ToastrCustomService } from './../../commonServices/toastr.service';
import { CommonService } from './../../commonServices/commanmaster/common.services';
import { ActivatedRoute } from '@angular/router';
import { UIConstant } from './../../shared/constants/ui-constant';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-common-menu',
  templateUrl: './common-menu.component.html',
  styleUrls: ['./common-menu.component.css']
})
export class CommonMenuComponent {
  private unSubscribe$ = new Subject<void>()
  searchForm: FormGroup
  openAddMenu: {};
  menuCode: string;
  menuData: any;
  listData: Array<any> = [];

  constructor(private _formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private commonService: CommonService,
    private toastr: ToastrCustomService) {
      this.route.paramMap.subscribe(
       async (parameters) => {
        this.menuCode = parameters.get('code');
        if (this.menuCode) {
          this.menuData = await this.commonService.getCommonMenu(this.menuCode);
          console.log(this.menuData)
          if (this.menuData) {
            this.getCommonMenuListData();
          }
          this.initDeleteCommonMenu()
        }
      })

      // this.commonService.onCommonMenuAdd$.subscribe((data) => {
      //   this.getCommonMenuListData()
      // })
    this.commonService.openCommonMenu$.subscribe((data) => {
      if (data.open === false) {
        this.getCommonMenuListData()
      }
    })
    this.buildForm()
   }

  getCommonMenuListData(){
    this.commonService.getCommonMenuDataList(this.menuCode, '').subscribe((response) => {
      if(response.Code === UIConstant.THOUSAND) {
        this.listData = response.Data;
        }
    })
  }

  buildForm () {
    this.searchForm = this._formBuilder.group({
      'searckKey': [UIConstant.BLANK]
    })
  }

  openAddCommonMenu(){
    this.commonService.openCommonMenu({open: true,data: this.menuData, isAddNew: true})
  }

  editCommonMenu(id){
    this.commonService.openCommonMenu({
      open: true,
      data: this.menuData,
      Id: id,
      isAddNew: false
    })
  }

  deleteCommonMenu(id){
    this.commonService.openDelete(id, this.menuData.CommonName, this.menuData.CommonName)
  }

  initDeleteCommonMenu(){
    this.commonService.getDeleteStatus().pipe(
      takeUntil(this.unSubscribe$)
    ).subscribe(
      (obj) => {
        if (obj.id && obj.type && obj.type === this.menuData.CommonName) {
          this.deleteItem(obj.id)
        }
      }
    )
  }

  deleteItem (id) {
    if (id) {
      this.commonService.deleteCommonMenu(this.menuData.CodeId, id).subscribe(Data => {
        if (Data.Code === UIConstant.THOUSAND) {
          this.toastr.showSuccess('Sucess', 'Deleted Successfully')
          this.commonService.closeDelete('')
          this.getCommonMenuListData()
        }
        if (Data.Code === UIConstant.CANNOTDELETERECORD) {
          this.toastr.showInfo('', Data.Description)
          this.commonService.closeDelete('')
        }
      })
    }
  }

  closeForm(data){
    this.openAddMenu ={
      open: false
    }
    if(data){
      this.getCommonMenuListData();
    }
  }

  searchFilter = () => {
    let input, filter, table, tr, tdArray, i, j, txtValue;
    input = document.getElementById("searchCommonMenu");
    filter = input.value.toUpperCase();
    table = document.getElementById("common_menu_table");
    tr = table.getElementsByTagName("tr");
    for (i = 1; i < tr.length; i++) {
      tdArray = tr[i].getElementsByTagName("td");
      loop2: for (j = 0; j < 2; j++) {
       const innerTd = tdArray[j];
        if (innerTd) {
          txtValue = innerTd.textContent || innerTd.innerText;
          if (txtValue.toUpperCase().indexOf(filter) > -1 ) {
            tr[i].style.display = "table-row";
            break loop2;
          } else {
            tr[i].style.display = "none";
          }
        }
      }
    }
  }
}
