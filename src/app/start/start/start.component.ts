import { CommonService } from 'src/app/commonServices/commanmaster/common.services';
import { LoginService } from './../../commonServices/login/login.services';
import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})
export class StartComponent implements OnInit {
  constructor (
    public _loginService: LoginService,
    public commonService: CommonService
  ) {
  }

  ngOnInit () {
  }

}
