import { Route } from '@angular/router';
import { VolunteersListComponent } from 'app/modules/admin/volunteers/list/volunteers-list.component';
import { VolunteersComponent } from 'app/modules/admin/volunteers/volunteers.component';
import { VolunteersResolver } from 'app/modules/admin/volunteers/volunteers.resolvers';

export const volunteersRoutes: Route[] = [
    {
        path: '',
        component: VolunteersComponent,
        children: [
            {
                path: '',
                component: VolunteersListComponent,
                resolve: {
                    volunteers: VolunteersResolver
                }
            }
        ]

    }
];
