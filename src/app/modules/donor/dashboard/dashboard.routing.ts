import { Route } from '@angular/router';
import { DashboardComponent } from 'app/modules/donor/dashboard/dashboard.component';
import { DashboardResolver } from 'app/modules/donor/dashboard/dashboard.resolvers';

export const dashboardRoutes: Route[] = [
    {
        path     : '',
        component: DashboardComponent,
        resolve  : {
            data: DashboardResolver
        }
    }
];
