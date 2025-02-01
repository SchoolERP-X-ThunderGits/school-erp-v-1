import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  setToken(key: string, value: string): void {
    sessionStorage.setItem(key, value)
  }


  getToken(key: string): string | null {

    return sessionStorage.getItem(key);
  }

  deleteToken(key: string): void {
    sessionStorage.removeItem(key)
  }

  isAuthenticated() {
    return !!this.getToken('authToken')
  }
}
