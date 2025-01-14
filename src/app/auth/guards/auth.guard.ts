import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { map, take } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  if (!inject(AuthService).getSession().pipe(take(1), map(session => session !== null))) {
    inject(Router).navigate(['/login']);
    return false;
  }
  return true;
};
