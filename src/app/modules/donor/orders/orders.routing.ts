import { Route } from '@angular/router';
import { OrdersListComponent } from 'app/modules/donor/orders/list/orders-list.component';
import { OrdersComponent } from 'app/modules/donor/orders/orders.component';
import { OrdersResolver } from 'app/modules/donor/orders/orders.resolvers';

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
