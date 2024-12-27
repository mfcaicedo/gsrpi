import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { GsrpiPreset } from './gsrpi.preset.config';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { UserGateway } from './user-management/domain/models/gateway/user-gateway';
import { UserManagementService } from './user-management/infrastructure/adapter/user-api/user-management.service';

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
    {provide: UserGateway, useClass: UserManagementService},
  ]
};
