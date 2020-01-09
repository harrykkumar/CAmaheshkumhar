import { CommonService } from './../../commonServices/commanmaster/common.services';
import { Component, OnInit, ViewContainerRef, ViewChild, ComponentFactoryResolver } from '@angular/core';
import { EmailEditorService } from './email-editor.service';
import { ToastrCustomService } from '../../commonServices/toastr.service';
import { Subscription } from 'rxjs';
import { EmailEditorCustomComponent } from 'src/app/shared/transactionMaster/email-editor/email-editor.component';
@Component({
  selector: 'email-list-editor',
  templateUrl: './email-editor-list.component.html'
})
export class EmailEditorListComponent implements OnInit {
  @ViewChild('emailEditorContainerRef', { read: ViewContainerRef }) emailEditorContainerRef: ViewContainerRef;
  emailEditorRef: any;
  p: number = 1
  itemsPerPage: number = 20
  lastItemIndex: number = 0
  templates: any = []
  destroy$: Subscription[] = []
  constructor(
     private _es: EmailEditorService,
     private _ts: ToastrCustomService,
     private resolver: ComponentFactoryResolver,
     private commonService: CommonService) {
    // this.destroy$.push(this._es.onAdd$.subscribe(() => {
    //   this.getAllTemplates()
    // }))
  }

  ngOnInit() {
    this.getAllTemplates()
  }

  openEditor(item?) {
    this.commonService.loadModalDynamically(this, 'emailEditorContainerRef', 'emailEditorRef', EmailEditorCustomComponent,
      (res) => {
        this.getAllTemplates();
      }, item);
  }

  getAllTemplates() {
    this._es.getAllTemplates('?Page=' + this.p + '&Size=' + this.itemsPerPage).subscribe((data) => {
      this.templates = data
    },
    (error) => {
      this._ts.showErrorLong(error, '')
    })
  }

  // edit(item) {
  //   this._es.openEditor(item.Id, item)
  // }

  ngOnDestroy() {
    // if (this.destroy$ && this.destroy$.length > 0) {
    //   this.destroy$.forEach((element) => {
    //     element.unsubscribe()
    //   })
    // }
  }

}














