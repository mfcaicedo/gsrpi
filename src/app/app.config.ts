import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom, LOCALE_ID, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { GsrpiPreset } from './gsrpi.preset.config';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { UserGateway } from './user-management/domain/models/gateway/user-gateway';
import { UserManagementService } from './user-management/infrastructure/adapter/user-api/user-management.service';
import { JwtModule } from '@auth0/angular-jwt';
import { AuthService } from './auth/auth.service';
import { authInterceptor } from './auth/auth.interceptor';
import { DatePipe } from '@angular/common';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes),
    provideAnimationsAsync(),
    provideAnimations(),
    provideHttpClient(),
    providePrimeNG({
      theme: {
        preset: GsrpiPreset,
        options: {
          darkModeSelector: false || 'none'
        }
      },
    }),
    //Configuracion de la inyeccion de dependencias
    { provide: UserGateway, useClass: UserManagementService },

    //Auth 
    importProvidersFrom([
      //Configuracion JWT
      JwtModule.forRoot({
        config: {
          tokenGetter: () => localStorage.getItem('token')
        }
      })
    ]),
    //Para que se ejecute el refresh token al iniciar la aplicacion
    {
      provide: APP_INITIALIZER,
      useFactory: initializerFactory,
      multi: true,
      deps: [AuthService]
    },
    //Se agrega el interceptor de autenticacion
    provideHttpClient(withInterceptors([authInterceptor])),
    DatePipe,
    {
      provide: LOCALE_ID,
      useValue: 'es-CO',
    },
  ]
};

export function initializerFactory(authService: AuthService) {
  return () => authService.refreshToken();
}
