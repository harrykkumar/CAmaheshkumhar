import { FormGroup } from '@angular/forms';

// custom validator to check that two fields match
export function DependencyCheck(controlName: string, dependencyControlName: string, type: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const dependencyControl = formGroup.controls[dependencyControlName];
        if ((dependencyControl.value && control.value) || (!dependencyControl.value && !control.value)) {
          dependencyControl.setErrors(null);
          control.setErrors(null);
        } else if (control.value && !dependencyControl.value) {
          if (type === 'date') {
            dependencyControl.setErrors({ isValidDate: true });
          }
          if (type === 'amount') {
            dependencyControl.setErrors({ isValidAmount: true });
          }
          control.setErrors(null)
        } else if (!control.value && dependencyControl.value) {
          if (type === 'date') {
            control.setErrors({ isValidDate: true });
          }
          if (type === 'amount') {
            control.setErrors({ isValidAmount: true });
          }
          dependencyControl.setErrors(null);
        }
    }
}