import { CommonService } from 'src/app/commonServices/commanmaster/common.services';
import { UIConstant } from 'src/app/shared/constants/ui-constant';
import { Component, OnInit } from '@angular/core'
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  constructor(
    public commonService: CommonService
  ) { }
  ngOnInit() {
  }
}
