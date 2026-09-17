import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthTokenInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();
    const authorised = token
      ? request.clone({ setHeaders: { 'X-SM-Session': token, 'X-Channel': 'CLAIMS-PORTAL' } })
      : request;

    return next.handle(authorised).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.authService.redirectToLogin();
        }
        return throwError(error);
      })
    );
  }
}
