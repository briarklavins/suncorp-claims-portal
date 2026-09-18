import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Adds the correlation identifier that the Suncorp ESB propagates through to
 * the mainframe transaction logs.
 */
@Injectable()
export class CorrelationIdInterceptor implements HttpInterceptor {

  private static newCorrelationId(): string {
    let id = '';
    for (let i = 0; i < 16; i++) {
      id += Math.floor(Math.random() * 16).toString(16);
    }
    return 'CLM-' + id.toUpperCase();
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request.clone({
      setHeaders: { 'X-Correlation-Id': CorrelationIdInterceptor.newCorrelationId() }
    }));
  }
}
