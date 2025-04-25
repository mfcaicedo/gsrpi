import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { map, take } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  return authService.getSession().pipe(
    take(1),
    map(session => {
      if (session === null) {
        router.navigate(['/login']);
        return false;
      }
      return true;
    })
  );
};