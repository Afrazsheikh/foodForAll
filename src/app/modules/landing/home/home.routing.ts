import { Route } from '@angular/router';
import { LandingHomeComponent } from 'app/modules/landing/home/home.component';
import { LandingPageComponent } from '../landing-page/landing-page.component';

export const landingHomeRoutes: Route[] = [
    {
        path: '',
        component: LandingPageComponent,
    },
];
