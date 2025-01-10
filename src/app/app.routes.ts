import { Routes } from '@angular/router';
import { AppLayoutComponent } from './shared/layout/app.layout.component';
import { WelcomeComponent } from './shared/components/welcome/welcome.component';
import { accountGuard, authGuard } from './auth/guards';

export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () => import('./auth/login/pages/login.component').then(m => m.LoginComponent),
        canActivate: [accountGuard],
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
                path: 'user-management',
                loadChildren: () => import('./user-management/user-management.routes').then(m => m.routes)
            }
        ]

    }];
