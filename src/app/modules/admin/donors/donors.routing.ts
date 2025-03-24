import { Route } from '@angular/router';
import { DonorsListComponent } from 'app/modules/admin/donors/list/donors-list.component';
import { DonorsComponent } from 'app/modules/admin/donors/donors.component';
import { DonorsResolver } from 'app/modules/admin/donors/donors.resolvers';

export const donorsRoutes: Route[] = [
    {
        path: '',
        component: DonorsComponent,
        children: [
            {
                path: '',
                component: DonorsListComponent,
                resolve: {
                    donors: DonorsResolver
                }
            }
        ]
    }
];