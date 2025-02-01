import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReusableGridComponent } from './reusable-grid.component';
import { ReusableGridColumnComponent } from './reusable-grid-column/reusable-grid-column.component';
import { ReusableGridHeaderTemplateDirective } from './directives/reusable-grid-header-template.directive';
import { ReusableGridCellTemplateDirective } from './directives/reusable-grid-cell-template.directive';
import { ReusableGridNodataDirective } from './directives/reusable-grid-nodata.directive';



@NgModule({
  declarations: [
    ReusableGridComponent,
    ReusableGridColumnComponent,
    ReusableGridHeaderTemplateDirective,
    ReusableGridCellTemplateDirective,
    ReusableGridNodataDirective

  ],
  imports: [
    CommonModule
  ],
  exports: [
    ReusableGridComponent,
    ReusableGridColumnComponent,
    ReusableGridHeaderTemplateDirective,
    ReusableGridCellTemplateDirective,
    ReusableGridNodataDirective
  ]
})
export class ReusableGridModule { }
