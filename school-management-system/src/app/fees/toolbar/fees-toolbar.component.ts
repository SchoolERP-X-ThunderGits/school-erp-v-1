import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-fees-toolbar',
  imports: [],
  templateUrl: './fees-toolbar.component.html',
  styleUrl: './fees-toolbar.component.scss'
})
export class FeesToolbarComponent {
  @Output() toolbarOperation = new EventEmitter()
  create() {
    this.toolbarOperation.emit({ action_type: 'create', data: null })
  }
}
