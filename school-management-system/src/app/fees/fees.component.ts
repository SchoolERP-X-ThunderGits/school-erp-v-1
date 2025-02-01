import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FeesToolbarComponent } from './toolbar/fees-toolbar.component';
import { FeesGridComponent } from './grid/fees-grid.component';
import { FeesCurdComponent } from './curd/fees-curd.component';

@Component({
  selector: 'app-fees',
  imports: [
    CommonModule,
    FeesToolbarComponent,
    FeesGridComponent,
    FeesCurdComponent,
  ],
  templateUrl: './fees.component.html',
  styleUrl: './fees.component.scss'
})
export class FeesComponent {
  display_right_panel: boolean = false
  data_to_add: any;
  selectedDataItem: any;
  data_to_update: any;
  callsource!: string;

  toolbarOperation(e: any) {
    if (e.action_type == "create") {
      this.callsource = 'create'
      this.display_right_panel = true;
    } else if (e.action_type == "close") {
      this.display_right_panel = false;
    }
    else if (e.action_type == "created") {
      this.display_right_panel = false
      this.data_to_add = e.data
    }
    else if (e.action_type == "update") {
      this.callsource = 'update'
      this.display_right_panel = true
      this.selectedDataItem = e.data
    }
    else if (e.action_type == "updated") {
      this.display_right_panel = false
      this.data_to_update = e.data
    }
  }
}