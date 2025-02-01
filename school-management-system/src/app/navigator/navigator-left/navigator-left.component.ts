import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { KeyValuePipe } from '../../pipes/key-value.pipe';
import { CommonModule } from '@angular/common';
import { UrlService } from '../../shared/url.service';
import { DataService } from '../../shared/data.service';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-navigator-left',
  imports: [
    CommonModule,
    KeyValuePipe,
  ],
  templateUrl: './navigator-left.component.html',
  styleUrl: './navigator-left.component.scss'
})
export class NavigatorLeftComponent implements OnInit {
  isCollapsed = false;
  constructor(
    private service_url: UrlService,
    private service_data: DataService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.bind_navbar()
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.urlAfterRedirects;
        console.log(`Navigated to: ${this.currentRoute}`);
      }
    });
  }
  currentRoute = ''

  @Output() toggleOperation = new EventEmitter()

  schoolModules = {
    Dashboard: {
      name: 'Dashboard',
      icon: 'bi-speedometer2',
      route: '/dashboard',
      display: false,
      children: [],
    },
    Students: {
      name: 'Students',
      icon: 'bi-people',
      route: 'students/details',
      display: false,
      children: [
        // {
        //   name: 'Admissions', route: '/students/admissions', icon: 'bi-person-plus', display: true,
        // },
        // { name: 'Attendance', route: '/students/attendance' , icon: 'bi-check2-circle', display: false,},
        // { name: 'Details', route: '/students/details' , icon: 'bi-check2-circle', display: true,},
        // { name: 'ID Card ', route: '/students/attendance' , icon: 'bi-check2-circle', display: true,},
        // { name: 'Performance', route: '/students/performance', icon: 'bi-graph-up', display: false, },
      ],
    },
    Teachers: {
      name: 'Teachers',
      icon: 'bi-person',
      route: '/teachers',
      display: false,
      children: [
        { name: 'Schedule', route: '/teachers/schedule', icon: 'bi-check2-circle', display: true, },
        { name: 'Attendance', route: '/teachers/attendance', icon: 'bi-check2-circle', display: true, },
      ],
    },
    Academics: {
      name: 'Academics',
      icon: 'bi-check2-circle',
      route: '/classes',
      display: false,
      children: [
        // { name: 'Timetable', route: '/classes/timetable', icon: 'bi-calendar', display: true, },
        // { name: 'Subjects', route: '/classes/subjects', icon: 'bi-book', display: true, },
      ],
    },
    Examinations: {
      name: 'Examinations',
      icon: 'bi-mortarboard',
      route: '/examinations',
      display: false,
      children: [
        { name: 'Schedule', route: '/examinations/schedule', icon: 'bi-file-earmark-bar-graph', display: true, },
        { name: 'Results', route: '/examinations/results', icon: 'bi-file-earmark-bar-graph', display: true, },
      ],
    },
    Fees: {
      name: 'fees',
      icon: 'bi-currency-dollar',
      route: '/fees',
      display: false,
      children: [
        // { name: 'Collection', route: '/fees/collection', icon: 'bi-wallet', display: true, },
        // { name: 'Due List', route: '/fees/due-list', icon: 'bi-list-check', display: true, },
      ],
    },
    Library: {
      name: 'Library',
      icon: 'bi-journal-bookmark',
      route: '/library',
      display: false,
      children: [
        { name: 'Books', route: '/library/books', icon: 'bi-journal', display: true, },
        { name: 'Borrowed', route: '/library/borrowed', icon: 'bi-journal-arrow-down', display: true, },
      ],
    },
    Transport: {
      name: 'Transport',
      icon: 'bi-bus-front',
      route: '/transport',
      display: false,
      children: [
        { name: 'Routes', route: '/transport/routes', icon: 'bi-map', display: true, },
        { name: 'Vehicles', route: '/transport/vehicles', icon: 'bi-truck', display: true, },
      ],
    },
    Settings: {
      name: 'Settings',
      icon: 'bi-gear',
      route: '/settings',
      display: false,
      children: [],
    },
  };

  bind_navbar() {
    if (this.service_data.userDto.role == "admin") {
      this.schoolModules.Dashboard.display = true;
      this.schoolModules.Students.display = true;
      this.schoolModules.Academics.display = true;
      this.schoolModules.Examinations.display = true;
      this.schoolModules.Fees.display = true;
    }
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
    this.toggleOperation.emit(this.isCollapsed)
  }

  changeInternalView(route: string) {
    this.service_url.navigateTo(route)
  }
}
