import { Component, Input } from '@angular/core'
import { FormControl } from '@angular/forms'
import { ValidationService } from '../../../commonServices/validatio-services'

@Component({
  selector: 'control-message',
  templateUrl: './control-message.component.html',
  styleUrls: ['./control-message.component.css']
})
export class ControlMessageComponent {

  @Input() control: FormControl

  @Input() apiError: string

  @Input() submitClick: boolean

  get errorMessage () {
    if (null != this.control) {
      for (const propertyName in this.control.errors) {
        if (this.control.errors.hasOwnProperty(propertyName) && (this.control.touched || this.submitClick)) {
          return ValidationService.getValidatorErrorMessage(propertyName, this.control.errors[propertyName])
        }
      }
    }
    return null
  }
}
