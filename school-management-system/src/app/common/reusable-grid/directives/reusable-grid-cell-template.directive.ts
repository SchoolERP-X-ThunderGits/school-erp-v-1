import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[reusableGridCellTemplate]',
  standalone:false
})
export class ReusableGridCellTemplateDirective {
  constructor(public template: TemplateRef<any>) {}
}
