
import { Component, ContentChild, ContentChildren, Input, QueryList } from '@angular/core';
import { ReusableGridColumnComponent } from './reusable-grid-column/reusable-grid-column.component';
import { ReusableGridNodataDirective } from './directives/reusable-grid-nodata.directive';

@Component({
  selector: 'app-reusable-grid',
  templateUrl: './reusable-grid.component.html',
  styleUrl: './reusable-grid.component.scss',
  standalone: false
})
export class ReusableGridComponent {
  @ContentChildren(ReusableGridColumnComponent) columns!: QueryList<ReusableGridColumnComponent>;
  @ContentChild(ReusableGridNodataDirective) noDataTemplateDirective!: ReusableGridNodataDirective;
  @Input() gridData: any[] = []; // Input for grid data

  trackByIndex(index: number) {
    return index;
  }

}
