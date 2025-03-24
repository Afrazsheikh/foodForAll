import { Route } from '@angular/router';
import { OrdersListComponent } from 'app/modules/volunteer/orders/list/orders-list.component';
import { OrdersComponent } from 'app/modules/volunteer/orders/orders.component';
import { OrdersResolver } from 'app/modules/volunteer/orders/orders.resolvers';

export const ordersRoutes: Route[] = [
    {
        path: '',
        component: OrdersComponent,
        children: [
            {
                path: '',
                component: OrdersListComponent,
                resolve: {
                    orders: OrdersResolver                }
            }
        ]
    }
];
