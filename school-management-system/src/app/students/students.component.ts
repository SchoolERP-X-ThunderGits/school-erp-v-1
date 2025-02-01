import { Component } from '@angular/core';
import { StudentGridComponent } from './grid/student-grid.component';
import { StudentCurdComponent } from './curd/student-curd.component';
import { StudentToolbarComponent } from './toolbar/student-toolbar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-students',
  imports: [
    CommonModule,
    StudentGridComponent,
    StudentToolbarComponent,
    StudentCurdComponent
  ],
  templateUrl: './students.component.html',
  styleUrl: './students.component.scss'
})
export class StudentsComponent {
  display_right_panel: boolean = false

  toolbarOperation(type: string) {
    if (type == "create") {
      this.display_right_panel = true;
    }else if(type == "close"){
      this.display_right_panel = false
    }
  }
}
