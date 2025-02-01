import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[reusableGridHeaderTemplate]',
  standalone:false
})
export class ReusableGridHeaderTemplateDirective {
  constructor(public template: TemplateRef<any>) {}
}
