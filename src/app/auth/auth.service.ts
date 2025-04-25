import { HttpClient, HttpContext } from '@angular/common/http';
import { DestroyRef, Injectable, WritableSignal, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from './interfaces/models/user.model';
import { Login, LoginError, LoginResponse, LoginSuccess } from './login/types/login-response.type';
import { BehaviorSubject, Observable, catchError, from, map, of, switchMap, tap, throwError } from 'rxjs';
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { IS_PUBLIC } from './auth.interceptor';
import ENVIRONMENTS from '../../environments/config';
import { AuthChangeEvent, createClient, Session, SupabaseClient } from '@supabase/supabase-js'
import { UserManagementUseCase } from '../user-management/domain/usecase/user-management-usecase';
import { UserDataSession } from './login/interfaces/models/user-data-session.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly supabase!: SupabaseClient;

  // El token será refrescado 5 minutos antes de la hora de expiración
  private readonly TOKEN_EXPIRY_THRESHOLD_MINUTES = 5;

  private session = new BehaviorSubject<Session | null>(null);

  //Guardo el id de la configuración inicial en un BehaviorSubject
  configurationId: BehaviorSubject<number> = new BehaviorSubject<number>(0); //Por defecto será la FIET 

  //UserDataSession
  userDataSession: BehaviorSubject<Partial<UserDataSession>> = new BehaviorSubject<Partial<UserDataSession>>({});

  urls: string[] = [];
  privileges: string[] = [];

  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly jwtHelper = inject(JwtHelperService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly CONTEXT = { context: new HttpContext().set(IS_PUBLIC, true) };

  constructor() {
    this.supabase = createClient(ENVIRONMENTS.BASE_URL_SUPABASE,
      ENVIRONMENTS.PUBLIC_API_KEY_SUPABASE,
      // {
      // auth: {
      //   storage: sessionStorage, //Se almacena la sesión en el almacenamiento de sesión del navegador y no en el localstorage
      //   autoRefreshToken: true,
      //   persistSession: true,
      //   detectSessionInUrl: true, // Detectar la sesión en la URL (por ejemplo, para autenticación de proveedores externos)
      // }
      // }
    );
    this.initializeAuthState();
  }

  private async initializeAuthState() {
    const { data: { session } } = await this.supabase.auth.getSession();
    this.session.next(session);
    this.supabase.auth.onAuthStateChange((_event, session) => {
      this.session.next(session);
    });
  }

  getSession(): Observable<Session | null> {
    if (this.session.value !== null) {
      return this.session.asObservable(); // ya está cargada
    }
  
    // Hacemos el fetch async, y luego emitimos
    return from(this.supabase.auth.getSession()).pipe(
      switchMap(({ data: { session } }) => {
        this.session.next(session);
        return this.session.asObservable(); // ahora sí con el valor actualizado
      })
    );
  }

  get user(): WritableSignal<User | null> {

    const token = sessionStorage.getItem('accessToken');
    return signal(token ? this.jwtHelper.decodeToken(token) : null);

  }

  saveConfigurationId(id: number) {
    this.configurationId.next(id);
  }

  getConfigurationId() {
    if (this.configurationId.value === 0) {
      const userDataSession = sessionStorage.getItem('userDataSession');
      //lo convierto a objeto para sacar la configuración 
      const userData = JSON.parse(userDataSession ?? '');
      const configurationId = userData.configurationId;
      if (configurationId) {
        this.configurationId.next(parseInt(configurationId));
      }
    }
    return this.configurationId.asObservable();
  }

  isAuthenticated(): boolean {
    //TODO: revisar mañana 
    return this.session.value !== null; 
  }

  getDecodeToken() {

    const token = sessionStorage.getItem('accessToken') ?? '';
    //Al decodificar el token obtenemos los datos del usuario, roles y privilegios
    //Pero por el momento solo se obtiene el uid del usuario
    return this.jwtHelper.decodeToken(token).sub

  }

  async updateAuthStatus() {

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
      this.userDataSession.next({});
      sessionStorage.removeItem('userDataSession');
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

  //Servicios para guardar archivo en supabase
  saveFile(file: File, fileName: string, bucket: string, folder: string): Observable<any> {

    return from(this.supabase
      .storage
      .from(bucket)
      .upload(`${folder}/${fileName}-${new Date().getTime()}.pdf`, file, {
        cacheControl: '3600', // mantener en caché durante 1 hora
        upsert: false // no sobrescribir el archivo si ya existe
      }))

  }

  //Servicio para actualizar archivo en supabase
  updateFile(file: File, fileName: string, bucket: string, folder: string) {

    return from(this.supabase
      .storage
      .from(bucket)
      .update(`${folder}/${fileName}`, file, {
        cacheControl: '3600', // mantener en caché durante 1 hora
        upsert: true // sobrescribir el archivo si ya existe
      }))

  }

  //Servicio para eliminar uno o varios archivo en supabase
  deleteFiles(files: string[], bucket: string) {

    return from(this.supabase
      .storage
      .from(bucket)
      .remove(files)) //files es un array con los nombres de los archivos a eliminar [nombrecarpeta/nombrearchivo]

  }

  //Servicio para obtener archivo en supabase
  getFile(bucket: string, path: string) {

    return from(this.supabase
      .storage
      .from(bucket)
      .download(path))

  }

  //Servicio para obtener todos los archivos en supabase de un bucket 
  getFiles(bucket: string, folder: string) {

    return from(this.supabase
      .storage
      .from(bucket)
      .list(folder, {
        limit: 100,
        offset: 0,
        sortBy: { column: 'name', order: 'asc' },
      })
    )

  }

  setUserDataSession(userData: Partial<UserDataSession>) {
    this.userDataSession.next(userData);
    sessionStorage.setItem('userDataSession', JSON.stringify(userData));
  }

  getUserDataSession() {

    if (Object.keys(this.userDataSession.value).length === 0) {
      const userDataSession = sessionStorage.getItem('userDataSession');
      if (userDataSession) {
        this.userDataSession.next(JSON.parse(userDataSession));
      }
    }
    return this.userDataSession.asObservable();

  }

  removeAccents(str: any) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

}
