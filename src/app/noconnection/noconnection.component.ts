import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-noconnection',
  templateUrl: './noconnection.component.html',
  styleUrls: ['./noconnection.component.css']
})
export class NoconnectionComponent implements OnInit {
  imagePath: string;
  constructor() { }

  ngOnInit() {
    this.imagePath = localStorage.getItem('NO_CONNECTION_IMG_URL');
  }

}
