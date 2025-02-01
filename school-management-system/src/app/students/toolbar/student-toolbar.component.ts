import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-student-toolbar',
  imports: [],
  templateUrl: './student-toolbar.component.html',
  styleUrl: './student-toolbar.component.scss',
})
export class StudentToolbarComponent {

 @Output() toolbarOperation = new EventEmitter()


 create(){
  this.toolbarOperation.emit('create');
 }
}
