import { CommonService } from 'src/app/commonServices/commanmaster/common.services';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-view-map',
  templateUrl: './view-map.component.html',
  styleUrls: ['./view-map.component.css']
})
export class ViewMapComponent implements OnInit {
  @Output() closeModal = new EventEmitter();
  lat: number = 26.860990;
  lng: number = 75.794229;
  mapType = 'satellite';
  dir: any
  constructor(
    private commonService: CommonService
  ) {
    this.dir = {
      origin: { lat: 24.799448, lng: 120.979021 },
      destination: { lat: 24.799524, lng: 120.975017 }
    }
  }

  ngOnInit() {
  }

  openModal(item?) {
    this.commonService.openModal('view_map');
    if(!this.commonService.isEmpty(item)){
      this.dir = {
        origin: { lat: item.StartLatitude, lng: item.StartLongitude },
        destination: { lat: item.EndLatitude, lng: item.EndLongitude }
      }
    }
  }

  closePopUp(){
    this.commonService.closeModal('view_map')
    this.closeModal.emit();
  }

}
