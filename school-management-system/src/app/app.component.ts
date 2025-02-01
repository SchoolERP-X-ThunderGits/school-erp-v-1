import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from './admin/auth/login/login.component';
import { NavigatorTopComponent } from './navigator/navigator-top/navigator-top.component';
import { NavigatorLeftComponent } from './navigator/navigator-left/navigator-left.component';
import { environment } from '../environment/environment';
import { SenderService } from './shared/sender.service';
import { DataService } from './shared/data.service';
import { AuthService } from './shared/auth.service';
import { NotificationComponent } from './notification/notification/notification.component';
import { NotificationService } from './notification/notification.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    CommonModule,
    LoginComponent,
    NavigatorTopComponent,
    NavigatorLeftComponent,
    NotificationComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'school-management-system';

  constructor(
    private service_sender: SenderService,
    private service_data: DataService,
    private service_auth: AuthService,
    private service_notification: NotificationService,
  ) { }

  ngOnInit(): void {
    this.loggedIn = this.service_auth.isAuthenticated()
    if (this.loggedIn) {
      this.getUser();
    }
  }

  is_api_call_pending = true
  getUser() {
    this.is_api_call_pending = true
    let formUrl = environment.baseUrl + '/user/getUser';
    let formData = {
      id: sessionStorage.getItem('UserId')
    };

    this.service_sender.makeGetSeverCall(formUrl, formData).subscribe({
      next: (response: any) => {

        this.service_data.userDto = response[0];
        this.is_api_call_pending = false
        sessionStorage.setItem('UserId', this.service_data.userDto._id);
      },
      error: (error) => {
        this.service_notification.notifier('error',error.error.message)
      }
    })
  }

  loggedIn: boolean = false;
  isCollapsed: boolean = false;
  toggleOperation(e: boolean) {
    this.isCollapsed = e
  }

  loginOperation(e: boolean) {
    this.loggedIn = e
    this.is_api_call_pending = false
  }
}