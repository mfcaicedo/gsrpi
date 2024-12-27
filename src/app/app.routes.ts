import { Routes } from '@angular/router';
import { AppLayoutComponent } from './shared/layout/app.layout.component';
import { WelcomeComponent } from './shared/components/welcome/welcome.component';

export const routes: Routes = [{

    path: '',
    component: AppLayoutComponent,
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
