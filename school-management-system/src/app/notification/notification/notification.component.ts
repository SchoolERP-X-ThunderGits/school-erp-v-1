import { Component } from '@angular/core';

import { Notification } from '../notification.model';
import { NotificationService } from '../notification.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notification',
  imports:[
    CommonModule
  ],
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent {


  constructor(private notificationService: NotificationService) {
    this.notifications$ = this.notificationService.notifications$
  }
  notifications$: any = [];

  dismissNotification(id: string) {
    this.notificationService.removeNotification(id);
  }
}
