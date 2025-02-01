import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[noDataTemplate]',
  standalone:false
})
export class ReusableGridNodataDirective {
  constructor(public template: TemplateRef<any>) {}

}
