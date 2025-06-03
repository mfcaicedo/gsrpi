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
import { SystemConfigurationGateway } from './system-configuration/domain/models/gateway/system-configuration-gateway';
import { SystemConfigService } from './system-configuration/infrastructure/adapter/system-configuration-api/system-config.service';
import { ApplicationsRecognitionGateway } from './applications-recognition/domain/models/gateway/applications-recognition-gateway';
import { ApplicationManagementService } from './applications-recognition/infrastructure/adapter/application-management-api/application-management.service';
import { ReviewApplicationsGateway } from './review-applications/domain/models/gateway/review-applications-gateway';
import { ReviewApplicationsManagementService } from './review-applications/infrastructure/adapter/review-applications-management-api/review-applications-management.service';
import { provideMarkdown } from 'ngx-markdown';
import { loadingInterceptor } from './auth/loading.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes),
    provideAnimationsAsync(),
    provideMarkdown(),
    provideAnimations(),
    //Se agrega el interceptor de autenticacion
    provideHttpClient(withInterceptors([authInterceptor, loadingInterceptor])),
    //Configuracion de PrimeNG
    providePrimeNG({
      theme: {
        preset: GsrpiPreset,
        options: {
          darkModeSelector: false || 'none'
        }
      },
    }),

    //Auth 
    importProvidersFrom([
      //Configuracion JWT
      JwtModule.forRoot({
        config: {
          tokenGetter: () => localStorage.getItem('accessToken')
        }
      }),
    ]),
    //Para que se ejecute el refresh token al iniciar la aplicacion
    // {
    //   provide: APP_INITIALIZER,
    //   useFactory: initializerFactory,
    //   multi: true,
    //   deps: [AuthService]
    // },

    //Configuracion de la inyeccion de dependencias para el desacoplamiento de la capa de infraestructura
    { provide: UserGateway, useClass: UserManagementService },
    { provide: SystemConfigurationGateway, useClass: SystemConfigService },
    { provide: ApplicationsRecognitionGateway, useClass: ApplicationManagementService },
    { provide: ReviewApplicationsGateway, useClass: ReviewApplicationsManagementService },

  ]
};

export function initializerFactory(authService: AuthService) {
  return () => authService.refreshSession();
}
