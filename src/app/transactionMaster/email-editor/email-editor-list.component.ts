import { Component, OnInit } from '@angular/core';
import { EmailEditorService } from './email-editor.service';
import { ToastrCustomService } from '../../commonServices/toastr.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'email-list-editor',
  templateUrl: './email-editor-list.component.html'
})
export class EmailEditorListComponent implements OnInit {
  p: number = 1
  itemsPerPage: number = 20
  lastItemIndex: number = 0
  templates: any = []
  destroy$: Subscription[] = []
  constructor(private _es: EmailEditorService, private _ts: ToastrCustomService) {
    this.destroy$.push(this._es.onAdd$.subscribe(() => {
      this.getAllTemplates()
    }))
  }

  ngOnInit() {
    this.getAllTemplates()
  }

  openEditor() {
    this._es.openEditor('')
  }

  getAllTemplates() {
    this.destroy$.push(this._es.getAllTemplates('?Page=' + this.p + '&Size=' + this.itemsPerPage).subscribe((data) => {
      // console.log(data)
      this.templates = data
    },
    (error) => {
      this._ts.showErrorLong(error, '')
    }))
  }

  edit(item) {
    this._es.openEditor(item.Id, item)
  }

  ngOnDestroy() {
    if (this.destroy$ && this.destroy$.length > 0) {
      this.destroy$.forEach((element) => {
        element.unsubscribe()
      })
    }
  }

}














