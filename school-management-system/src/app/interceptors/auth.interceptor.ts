import { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../shared/auth.service';

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  // Inject the current `AuthService` and use it to get an authentication token:
  const authToken = inject(AuthService).getToken('authToken');

  // Clone the request to add the authentication header.
  if (authToken) {
    const newReq = req.clone({
      headers: req.headers.append('authorization', authToken),
    });
    return next(newReq);
  }

  return next(req);
};
