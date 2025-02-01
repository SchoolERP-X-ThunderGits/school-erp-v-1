import { Component, Input, ContentChild, TemplateRef, AfterContentInit } from '@angular/core';
import { ReusableGridHeaderTemplateDirective } from '../directives/reusable-grid-header-template.directive';
import { ReusableGridCellTemplateDirective } from '../directives/reusable-grid-cell-template.directive';

@Component({
  selector: 'app-reusable-grid-column',
  template: '', // This component does not render HTML directly
  standalone: false
})
export class ReusableGridColumnComponent implements AfterContentInit {
  @Input() field!: string;
  @Input() title!: string;
  @Input() headerTemplate?: TemplateRef<any>;
  @Input() cellTemplate?: TemplateRef<{ dataItem: any,rowIndex:Number }>;

  @ContentChild(ReusableGridHeaderTemplateDirective)
  headerTemplateDirective!: ReusableGridHeaderTemplateDirective;

  @ContentChild(ReusableGridCellTemplateDirective)
  cellTemplateDirective!: ReusableGridCellTemplateDirective;

  ngAfterContentInit() {
    if (this.headerTemplateDirective) {
      this.headerTemplate = this.headerTemplateDirective.template;
    }
    if (this.cellTemplateDirective) {
      this.cellTemplate = this.cellTemplateDirective.template;
    }
  }
}
