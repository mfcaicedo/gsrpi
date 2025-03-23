import { Injectable, inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../auth.service';

export const AuthorizedGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    // Obtener los roles requeridos de la ruta
    const requiredRoles: string[] = route.data['roles'] || [];

    // Obtener los roles del usuario autenticado
    let userRoles: string[] = [];
    authService.getUserDataSession().subscribe(data => {
        userRoles = (data.userRoles?.map(role => role?.role?.name) ?? []).filter((role): role is string => role !== undefined);
    });

    // Verificar si el usuario tiene al menos uno de los roles requeridos
    const hasRole = userRoles.some(role => requiredRoles.includes(role));

    if (!hasRole) {
        router.navigate(['/acceso-denegado']); // Redirigir si no tiene permisos
        return false;
    }

    return true;
};