import { HttpContextToken, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { switchMap } from 'rxjs/operators';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  // Cuando se adjunta HttpContextToken en una petición sigunifica que el usuario no necesita autenticación
  // Por lo tanto, no se adjunta el encabezado de autorización (Ej. Inicio de sesión)
  if (req.context.get(IS_PUBLIC)) {
    return next(req);
  }

  if (authService.isAuthenticated()) {
    const authRequest = addAuthorizationHeader(req);
    return next(authRequest);

  } else {
    return authService.refreshSession().pipe(
      switchMap(() => {
        const authRequest = addAuthorizationHeader(req);
        return next(authRequest);
      })
    );
    
  }
};

const addAuthorizationHeader = (req: HttpRequest<any>) => {
  const token = localStorage.getItem('sb-bleayfxzpykreishpdvw-auth-token');
  const tokenFormattedJson = JSON.parse(token ?? '{}');

  return req.clone({
    headers: req.headers.set('Authorization', `Bearer ${tokenFormattedJson.access_token}`)
  });
};

export const IS_PUBLIC = new HttpContextToken(() => false);