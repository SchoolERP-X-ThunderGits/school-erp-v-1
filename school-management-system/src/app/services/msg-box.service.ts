import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationDialogComponent } from '../common/confirmation-dialog/confirmation-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class MsgBoxService {

  constructor(private modalService: NgbModal) { }


  confirm(
    title: string,
    message: string,
    buttons: { label: string; style: string; value: any }[] = [
      { label: 'Yes', style: 'primary', value: true },
      { label: 'No', style: 'secondary', value: false },
    ]
  ): Promise<any> {
    const appRoot = document.querySelector('app-root');
    appRoot?.setAttribute('inert', '');

    const modalRef = this.modalService.open(ConfirmationDialogComponent, {
      backdrop: 'static',
      keyboard: false,
      centered: true,
    });

    modalRef.componentInstance.title = title;
    modalRef.componentInstance.message = message;
    modalRef.componentInstance.buttons = buttons;

    return modalRef.result
      .then((result) => {
        appRoot?.removeAttribute('inert');
        return result;
      })
      .catch(() => {
        appRoot?.removeAttribute('inert');
        return null;
      });
  }
}
