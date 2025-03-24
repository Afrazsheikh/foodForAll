import { Route } from '@angular/router';
import { AccountComponent } from 'app/modules/admin/account/account.component';
import { AccountResolver } from 'app/modules/admin/account/account.resolvers';

export const exampleRoutes: Route[] = [
    {
        path     : '',
        component: AccountComponent,
        resolve  : {
            data: AccountResolver
        }
    }
];
