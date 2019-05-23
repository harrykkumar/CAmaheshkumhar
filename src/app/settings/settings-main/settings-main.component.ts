import { Component } from '@angular/core'
import { SettingsService } from '../settings.service';

@Component({
  selector: 'app-settings-main',
  templateUrl: './settings-main.component.html',
  styleUrls: ['./settings-main.component.css']
})
export class SettingsMainComponent {
  constructor (private settingsService: SettingsService) {}

  saveForm () {
    this.settingsService.saveForm()
  }
}
