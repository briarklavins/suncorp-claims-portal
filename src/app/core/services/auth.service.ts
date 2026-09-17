import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Consultant } from '../../shared/models/consultant.model';

/**
 * Authentication is delegated to SiteMinder. The portal reads the SMSESSION cookie
 * and exchanges it for a consultant profile.
 */
@Injectable()
export class AuthService {

  private currentUserSubject = new BehaviorSubject<Consultant>(null);
  currentUser$: Observable<Consultant> = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
  }

  loadProfile(): Observable<Consultant> {
    return this.http.get<Consultant>(environment.claimsApiBaseUrl + '/session/profile')
      .pipe(
        tap(profile => this.currentUserSubject.next(profile)),
        catchError(() => {
          this.currentUserSubject.next(null);
          return of(null as Consultant);
        })
      );
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.getValue() !== null || this.readSiteminderCookie() !== null;
  }

  hasRole(role: string): boolean {
    const user = this.currentUserSubject.getValue();
    return !!user && user.roles.indexOf(role) >= 0;
  }

  redirectToLogin(): void {
    window.location.href = environment.siteminderLoginUrl + '?TARGET=' + encodeURIComponent(window.location.href);
  }

  getToken(): string {
    return this.readSiteminderCookie();
  }

  consultantId(): Observable<string> {
    return this.currentUser$.pipe(map(user => user ? user.consultantId : null));
  }

  private readSiteminderCookie(): string {
    const match = document.cookie.match(/SMSESSION=([^;]+)/);
    return match ? match[1] : null;
  }
}
