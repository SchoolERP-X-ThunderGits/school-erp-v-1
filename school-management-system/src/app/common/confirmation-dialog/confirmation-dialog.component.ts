import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
interface ConfirmationButton {
  label: string;
  style: string;
  value: any;
}

@Component({
  selector: 'app-confirmation-dialog',
  imports: [
    CommonModule
  ],
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.scss'
})
export class ConfirmationDialogComponent {
  @Input() title!: string;
  @Input() message!: string;
  @Input() buttons: ConfirmationButton[] = [];

  constructor(public activeModal: NgbActiveModal) { }

  onButtonClick(buttonValue: any) {
    this.activeModal.close(buttonValue);
  }
}
