import { Routes } from '@angular/router';
import { AppLayoutComponent } from './layout/app.layout.component';
import { WelcomeComponent } from './components/welcome/welcome.component';

export const routes: Routes = [{

    path: '',
    component: AppLayoutComponent,
    children: [
        {
            path: '',
            component: WelcomeComponent
        }
    ]


}];
