import { Route } from '@angular/router';
import { CanopiesListComponent } from 'app/modules/admin/canopies/list/canopies-list.component';
import { CanopiesComponent } from 'app/modules/admin/canopies/canopies.component';
import { CanopiesResolver } from 'app/modules/admin/canopies/canopies.resolvers';

export const canopiesRoutes: Route[] = [
    {
        path     : '',
        component: CanopiesComponent,
        children:[
            {
                path     : '',
                component: CanopiesListComponent,
                resolve  : {
                    products : CanopiesResolver     
                }
            }
        ]
        
    }
];
