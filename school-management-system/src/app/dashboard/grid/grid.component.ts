import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReusableGridModule } from '../../common/reusable-grid/reusable-grid.module';


@Component({
  selector: 'app-grid',
  imports: [
    CommonModule,
    ReusableGridModule,
    
  ],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.scss'
})
export class GridComponent {
  gridData = [
    { ProductName: 'Apple', UnitPrice: 1.5, UnitsInStock: 100 },
    { ProductName: 'Banana', UnitPrice: 1.2, UnitsInStock: 150 },
    { ProductName: 'Orange', UnitPrice: 1.8, UnitsInStock: 80 }
  ];

  handleRowClick(row: any): void {
    console.log('Row clicked:', row);
  }
}
