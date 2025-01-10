import { HttpClient, HttpContext } from '@angular/common/http';
import { DestroyRef, Injectable, WritableSignal, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from './interfaces/models/user.model';
import { Login, LoginError, LoginResponse, LoginSuccess } from './login/types/login-response.type';
import { BehaviorSubject, Observable, catchError, of, tap, throwError } from 'rxjs';
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { IS_PUBLIC } from './auth.interceptor';
import ENVIRONMENTS from '../../environments/config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // El token será refrescado 5 minutos antes de la hora de expiración
  private readonly TOKEN_EXPIRY_THRESHOLD_MINUTES = 5;

  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly jwtHelper = inject(JwtHelperService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly CONTEXT = { context: new HttpContext().set(IS_PUBLIC, true) };

  private authStatusSubject = new BehaviorSubject<boolean>(this.isAuthenticated());
  public authStatus$ = this.authStatusSubject.asObservable();

  urls: string[] = [];
  privileges: string[] = [];

  constructor() { }

  get user(): WritableSignal<User | null> {

    const token = localStorage.getItem('token');
    return signal(token ? this.jwtHelper.decodeToken(token) : null);

  }

  isAuthenticated(): boolean {
    return !this.jwtHelper.isTokenExpired();
  }

  getDecodeToken() {

    const token = localStorage.getItem('token') ?? '';
    //Al decodificar el token obtenemos los datos del usuario, roles y privilegios
    return this.jwtHelper.decodeToken(token).sub

  }

  updateAuthStatus() {

    const isAuthenticated = this.isAuthenticated();
    this.authStatusSubject.next(isAuthenticated);

  }

  login(body: Login): Observable<any> {

    return this.http.post<LoginResponse>(`${ENVIRONMENTS.POST_LOGIN}`, body, this.CONTEXT)
      .pipe(
        catchError(error => {

          let loginErrorResponse: LoginError;

          if (error.status === 401) {
            // Credenciales inválidas
            console.log('Invalid credentials, ', error);
            loginErrorResponse = error as LoginError;
            return throwError(() => loginErrorResponse);
          }

          return throwError(() => error)

        }),
        tap(data => {

          const loginSuccessData = data as LoginSuccess;
          this.storeTokens(loginSuccessData);
          this.scheduleTokenRefresh(loginSuccessData.token);
          this.router.navigate(['/']);
          // Actualiza el estado de autenticación
          this.updateAuthStatus();

        })
      );

  }

  logout(): void {

    const refreshToken = localStorage.getItem('refreshToken');

    this.http.post<LoginResponse>(`${ENVIRONMENTS.POST_LOGOUT}`, { refreshToken })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        this.router.navigate(['/login']);
        // Actualiza el estado de autenticación
        this.updateAuthStatus();
      });

  }

  storeTokens(data: LoginSuccess): void {

    localStorage.setItem('token', data.token);
    localStorage.setItem('refreshToken', data.refreshToken);

  }

  refreshToken(): Observable<LoginResponse | null> {

    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      return of();
    }

    return this.http.post<LoginResponse>(
      `${ENVIRONMENTS.POST_REFRESH_TOKEN}`, { refreshToken }, this.CONTEXT)
      .pipe(
        catchError(() => of()),
        tap(data => {
          const loginSuccessData = data as LoginSuccess;
          this.storeTokens(loginSuccessData);
          this.scheduleTokenRefresh(loginSuccessData.token);
        })
      );
  }

  scheduleTokenRefresh(token: string): void {

    const expirationTime = this.jwtHelper.getTokenExpirationDate(token)?.getTime();
    const refreshTime = expirationTime ? expirationTime - this.TOKEN_EXPIRY_THRESHOLD_MINUTES * 60 * 1000 : Date.now();
    const refreshInterval = refreshTime - Date.now();

    if (refreshInterval > 0) {
      setTimeout(() => {
        this.refreshToken()
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe();
      }, refreshInterval);
    }

  }

  removeAccents(str: any) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

}
