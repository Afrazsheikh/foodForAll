import { Injectable } from '@angular/core';
import { assign, cloneDeep } from 'lodash-es';
import { FuseMockApiService, FuseMockApiUtils } from '@fuse/lib/mock-api';
import { donations as ordersData } from 'app/mock-api/apps/ecommerce/orders/data';

@Injectable({
    providedIn: 'root'
})
export class OrdersMockApi {
    private _orders: any[] = ordersData;

    /**
     * Constructor
     */
    constructor(private _fuseMockApiService: FuseMockApiService) {
        // Register Mock API handlers
        this.registerHandlers();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Register Mock API handlers
     */
    registerHandlers(): void {
        // -----------------------------------------------------------------------------------------------------
        // @ Orders - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onGet('api/apps/orders')
            .reply(({ request }) => {

                // Get available queries
                const search = request.params.get('search');
                const sort = request.params.get('sort') || 'pickupAddress';
                const order = request.params.get('order') || 'asc';
                const page = parseInt(request.params.get('page') ?? '1', 10);
                const size = parseInt(request.params.get('size') ?? '10', 10);

                // Clone the orders
                let orders: any[] | null = cloneDeep(this._orders);

                // Sort the orders
                if (sort === 'pickupAddress' || sort === 'currentState') {
                    orders.sort((a, b) => {
                        const fieldA = a[sort].toString().toUpperCase();
                        const fieldB = b[sort].toString().toUpperCase();
                        return order === 'asc' ? fieldA.localeCompare(fieldB) : fieldB.localeCompare(fieldA);
                    });
                }
                else {
                    orders.sort((a, b) => order === 'asc' ? a[sort] - b[sort] : b[sort] - a[sort]);
                }

                // If search exists...
                if (search) {
                    // Filter the orders
                    orders = orders.filter(order => order.pickupAddress && order.pickupAddress.toLowerCase().includes(search.toLowerCase()));
                }

                // Paginate - Start
                const ordersLength = orders.length;

                // Calculate pagination details
                const begin = page * size;
                const end = Math.min((size * (page + 1)), ordersLength);
                const lastPage = Math.max(Math.ceil(ordersLength / size), 1);

                // Prepare the pagination object
                let pagination = {};

                // If the requested page number is bigger than
                // the last possible page number, return null for
                // orders but also send the last possible page so
                // the app can navigate to there
                if (page > lastPage) {
                    orders = null;
                    pagination = {
                        lastPage
                    };
                }
                else {
                    // Paginate the results by size
                    orders = orders.slice(begin, end);

                    // Prepare the pagination mock-api
                    pagination = {
                        length: ordersLength,
                        size: size,
                        page: page,
                        lastPage: lastPage,
                        startIndex: begin,
                        endIndex: end - 1
                    };
                }

                // Return the response
                return [
                    200,
                    {
                        orders,
                        pagination
                    }
                ];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Order - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onGet('api/apps/order')
            .reply(({ request }) => {

                // Get the id from the params
                const id = request.params.get('id');

                // Clone the orders
                const orders = cloneDeep(this._orders);

                // Find the order
                const order = orders.find(item => item.id === id);

                // Return the response
                return [200, order];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Order - POST
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onPost('api/apps/order')
            .reply(() => {

                // Generate a new order
                const newOrder = {
                    id: FuseMockApiUtils.guid(),
                    pickupAddress: '',
                    dropAddress: '',
                    currentState: '',
                    donor: {},
                    volunteer: {},
                    pincode: '',
                    modifiedOn: new Date(),
                    donationTime: '',
                    donationDate: new Date()
                };

                // Unshift the new order
                this._orders.unshift(newOrder);

                // Return the response
                return [200, newOrder];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Order - PATCH
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onPatch('api/apps/order')
            .reply(({ request }) => {
                // Get the id and order
                const id = request.body.id;
                const order = cloneDeep(request.body.order);

                // Prepare the updated order
                let updatedOrder = null;

                // Find the order and update it
                this._orders.forEach((item, index, orders) => {

                    if (item.id === id) {
                        // Update the order
                        orders[index] = assign({}, orders[index], order);

                        // Store the updated order
                        updatedOrder = orders[index];
                    }
                });

                // Return the response
                return [200, updatedOrder];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Order - DELETE
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onDelete('api/apps/order')
            .reply(({ request }) => {

                // Get the id
                const id = request.params.get('id');

                // Find the order and delete it
                this._orders.forEach((item, index) => {

                    if (item.id === id) {
                        this._orders.splice(index, 1);
                    }
                });

                // Return the response
                return [200, true];
            });
    }
}