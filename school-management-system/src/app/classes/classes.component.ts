import { Component } from '@angular/core';
import { ClassesToolbarComponent } from './toolbar/classes-toolbar.component';
import { ClassesCurdComponent } from './curd/classes-curd.component';
import { CommonModule } from '@angular/common';
import { ClassesGridComponent } from './grid/classes-grid.component';

@Component({
  selector: 'app-classes',
  imports: [
    CommonModule,
    ClassesToolbarComponent,
    ClassesCurdComponent,
    ClassesGridComponent
  ],
  templateUrl: './classes.component.html',
  styleUrl: './classes.component.scss'
})
export class ClassesComponent {


  display_right_panel: boolean = false
  data_to_add:any;
  selectedDataItem:any;
  data_to_update:any;
  callsource!:string;

  toolbarOperation(e: any) {
    if (e.action_type == "create") {
      this.callsource = 'create'
      this.display_right_panel = true;
    }else if(e.action_type == "close"){
      this.display_right_panel = false;
    }
    else if(e.action_type == "created"){
      this.display_right_panel = false
      this.data_to_add = e.data
    }
    else if(e.action_type == "update"){
       this.callsource = 'update'
      this.display_right_panel = true
      this.selectedDataItem = e.data
    }
    else if(e.action_type == "updated"){
      this.display_right_panel = false
      this.data_to_update = e.data
    }
  }
}
