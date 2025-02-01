import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UrlService {


  constructor(private router: Router) { }

  // Navigate to a specific route
  navigateTo(route: string, queryParams?: any): void {
    this.router.navigate([route], { queryParams });
  }

  // Navigate with parameters
  navigateWithParams(route: string, params: any): void {
    this.router.navigate([route, params]);
  }

  // Navigate back to the previous page
  navigateBack(): void {
    this.router.navigate(['/']);
  }

  // Navigate forward
  navigateForward(): void {
    window.history.forward();
  }
}
