import { HttpClient, HttpContext } from '@angular/common/http';
import { DestroyRef, Injectable, WritableSignal, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from './interfaces/models/user.model';
import { Login, LoginError, LoginResponse, LoginSuccess } from './login/types/login-response.type';
import { BehaviorSubject, Observable, catchError, from, of, tap, throwError } from 'rxjs';
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { IS_PUBLIC } from './auth.interceptor';
import ENVIRONMENTS from '../../environments/config';
import { AuthChangeEvent, createClient, Session, SupabaseClient } from '@supabase/supabase-js'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly supabase!: SupabaseClient;

  // El token será refrescado 5 minutos antes de la hora de expiración
  private readonly TOKEN_EXPIRY_THRESHOLD_MINUTES = 5;

  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly jwtHelper = inject(JwtHelperService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly CONTEXT = { context: new HttpContext().set(IS_PUBLIC, true) };

  private session = new BehaviorSubject<Session | null>(null);

  //Guardo el id de la configuración inicial en un BehaviorSubject
  configurationId: BehaviorSubject<number> = new BehaviorSubject<number>(12); //Por defecto será la FIET 

  urls: string[] = [];
  privileges: string[] = [];

  constructor() {
    this.supabase = createClient(ENVIRONMENTS.BASE_URL_SUPABASE,
      ENVIRONMENTS.PUBLIC_API_KEY_SUPABASE);
  }

  getSession() {
    return this.session.asObservable();
  }

  get user(): WritableSignal<User | null> {

    const token = localStorage.getItem('accessToken');
    return signal(token ? this.jwtHelper.decodeToken(token) : null);

  }

  saveConfigurationsId(id: number) {
    this.configurationId.next(id);
  }

  getConfigurationsId() {
    return this.configurationId.asObservable();
  }

  isAuthenticated(): boolean {
    return this.session.value !== null;
  }

  getDecodeToken() {

    const token = localStorage.getItem('accessToken') ?? '';
    //Al decodificar el token obtenemos los datos del usuario, roles y privilegios
    //Pero por el momento solo se obtiene el uid del usuario
    return this.jwtHelper.decodeToken(token).sub

  }

  updateAuthStatus() {

    this.supabase.auth.getSession().then(({ data: { session } }) => {
      this.session.next(session);
    });

  }

  login(body: Login): Observable<any> {

    return from(this.supabase.auth.signInWithPassword({
      email: body.username ?? '',
      password: body.password,
    }));

  }

  logout(): void {

    this.supabase.auth.signOut().then(() => {
      this.session.next(null);
      this.router.navigate(['/login']);
    });

  }

  refreshSession(): Observable<any> {

    return from(this.supabase.auth.refreshSession()).pipe(
      tap(({ data, error }) => {
        if (error) {
          console.error('Error al refrescar la sesión', error);
          return;
        }
        this.session.next(data.session);
      })
    );

  }

  createUser(email: string, password: string = "Gspri2025."): Observable<any> {

    return from(this.supabase.auth.signUp({
      email: email,
      password: password,
    }));
  }

  removeAccents(str: any) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

}
