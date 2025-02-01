import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-classes-toolbar',
  imports: [],
  templateUrl: './classes-toolbar.component.html',
  styleUrl: './classes-toolbar.component.scss'
})
export class ClassesToolbarComponent {
  @Output() toolbarOperation = new EventEmitter()


  create() {
    this.toolbarOperation.emit({action_type:'create',data:null})
  }
}
