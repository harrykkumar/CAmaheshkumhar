import { LoginService } from './../../commonServices/login/login.services';
import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})
export class StartComponent implements OnInit {

  // tslint:disable-next-line:no-empty
  constructor (
    public _loginService: LoginService
  ) {}

  // tslint:disable-next-line:no-empty
  ngOnInit () {
  }

}
