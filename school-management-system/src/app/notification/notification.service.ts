import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Notification } from './notification.model';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  notifications$ = this.notificationsSubject.asObservable();

  addNotification(notification: Notification) {
    const currentNotifications = this.notificationsSubject.value;
    this.notificationsSubject.next([...currentNotifications, notification]);

    // Auto-dismiss after the specified duration
    if (notification.duration) {
      setTimeout(() => this.removeNotification(notification.id), notification.duration);
    }
  }

  notifier(type: Notification['type'], message: string) {
    this.addNotification({
      id: Math.random().toString(),
      message: message,
      type: type,
      duration: 2000,
    })
  }

  removeNotification(id: string) {
    const updatedNotifications = this.notificationsSubject.value.filter(n => n.id !== id);
    this.notificationsSubject.next(updatedNotifications);
  }
}
