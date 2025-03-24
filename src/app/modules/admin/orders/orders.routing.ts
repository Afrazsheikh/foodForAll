import { Route } from '@angular/router';
import { OrdersListComponent } from 'app/modules/admin/orders/list/orders-list.component';
import { OrdersComponent } from 'app/modules/admin/orders/orders.component';
import { OrdersResolver } from 'app/modules/admin/orders/orders.resolvers';
import { VolunteersResolver } from 'app/modules/admin/volunteers/volunteers.resolvers';

export const ordersRoutes: Route[] = [
    {
        path: '',
        component: OrdersComponent,
        children: [
            {
                path: '',
                component: OrdersListComponent,
                resolve: {
                    orders: OrdersResolver,
                    volunteers: VolunteersResolver
                }
            }
        ]
    }
];
