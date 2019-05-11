import { Component, Input } from '@angular/core'
import { CommonService } from '../../commonServices/commanmaster/common.services'

@Component({
  selector: 'app-table-custom',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent {
  @Input() header: any = []
  @Input() content: any = []
  @Input() footer: any = []
  @Input() keys: any = []
  @Input() actionList: any = []
  @Input() formName: number
  @Input() class: string

  constructor (private commonService: CommonService) {}
  onActionClicked (action, id) {
    action.id = id
    action['formname'] = this.formName
    this.commonService.onActionClicked(action)
  }

}
