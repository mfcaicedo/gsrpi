import { Routes } from '@angular/router';
import { AppLayoutComponent } from './shared/layout/app.layout.component';
import { WelcomeComponent } from './shared/components/welcome/welcome.component';
import { accountGuard, authGuard } from './auth/guards';
import { AuthorizedGuard } from './auth/guards/authorized.guard';
import { RoleNames } from './auth/enums/roles.enum';
import { AccessDeniedComponent } from './auth/pages/access-denied/access-denied.component';
import { PrivacyPoliciesComponent } from './shared/components/privacy-policies/privacy-policies.component';

export const routes: Routes = [
    {
        path: 'login',
        canActivate: [accountGuard],
        loadComponent: () => import('./auth/login/pages/login.component').then(m => m.LoginComponent),
    },
    {
        path: '',
        component: AppLayoutComponent,
        canActivate: [authGuard],
        children: [
            {
                path: '',
                component: WelcomeComponent
            },
            {
                path: 'politicas',
                component: PrivacyPoliciesComponent,
            },
            {
                path: 'gestion-usuarios',
                loadChildren: () => import('./user-management/user-management.routes').then(m => m.routes)
            },
            {
                path: 'configuracion-sistema',
                canActivate: [AuthorizedGuard],
                data: { roles: [RoleNames.ADMIN, RoleNames.ADMIN_CIARP] },
                loadChildren: () => import('./system-configuration/system-configuration.routes').then(m => m.routes)
            },
            {
                path: 'solicitudes-reconocimiento',
                canActivate: [AuthorizedGuard],
                data: { roles: [RoleNames.CPD_SECRETARY, RoleNames.CPD_PRESIDENT, RoleNames.CPD_MEMBER, RoleNames.TEACHER] },
                loadChildren: () => import('./applications-recognition/applications-recognition.routes').then(m => m.routes)
            },
            {
                path: 'revision-solicitudes',
                canActivate: [AuthorizedGuard],
                data: {
                    roles: [RoleNames.CPD_SECRETARY, RoleNames.CPD_PRESIDENT, RoleNames.CPD_MEMBER, RoleNames.TEACHER,
                    RoleNames.CIARP_SECRETARY, RoleNames.CIARP_MEMBER]
                },
                loadChildren: () => import('./review-applications/review-applications.routes').then(m => m.routes)
            }
        ]
    },
    {
        path: 'acceso-denegado',
        canActivate: [authGuard],
        component: AccessDeniedComponent,
    },
    {
        path: '**',
        redirectTo: '/acceso-denegado'
    }
];
