import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';
import { Donations, DonationsPagination } from './orders.types';

@Injectable({
    providedIn: 'root',
})
export class OrdersService {
    private _orders: BehaviorSubject<Donations[] | null> = new BehaviorSubject(
        null
    );
    private _order: BehaviorSubject<Donations | null> = new BehaviorSubject(
        null
    );
    private _pagination: BehaviorSubject<DonationsPagination | null> =
        new BehaviorSubject(null);

    constructor(private _httpClient: HttpClient) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    get orders$(): Observable<Donations[]> {
        return this._orders.asObservable();
    }

    get order$(): Observable<Donations> {
        return this._order.asObservable();
    }

    get pagination$(): Observable<DonationsPagination> {
        return this._pagination.asObservable();
    }

    getOrders(
        page: number = 0,
        size: number = 10,
        sort: string = 'pickupAddress',
        order: 'asc' | 'desc' | '' = 'asc',
        search: string = ''
    ): Observable<{ pagination: DonationsPagination; donations: Donations[] }> {
        return this._httpClient
            .get<{ pagination: DonationsPagination; donations: Donations[] }>(
                'http://localhost:8080/volunteer/donations',
                {
                    params: {
                        page: '' + page,
                        size: '' + size,
                        sort,
                        order,
                        search,
                    },
                }
            )
            .pipe(
                tap((response) => {
                    this._pagination.next(response.pagination);
                    this._orders.next(response.donations);
                })
            );
    }

    getOrderById(id: string): Observable<Donations> {
        return this.orders$.pipe(
            take(1),
            map((orders) => {
                const order = orders.find((item) => item.id === id) || null;
                this._order.next(order);
                return order;
            }),
            switchMap((order) => {
                if (!order) {
                    return throwError(
                        'Could not find order with id of ' + id + '!'
                    );
                }
                return of(order);
            })
        );
    }

    updateOrder(id: string, volunteerID: string): Observable<Donations> {
        return this.orders$.pipe(
            take(1),
            switchMap((orders) =>
                this._httpClient
                    .patch<Donations>(
                        'http://localhost:8080/volunteer/donation/' + id,
                        {
                            id,
                            volunteerID,
                        }
                    )
                    .pipe(
                        map((updatedOrder) => {
                            const index = orders.findIndex(
                                (item) => item.id === id
                            );
                            orders[index] = updatedOrder;
                            this._orders.next(orders);
                            return updatedOrder;
                        }),
                        switchMap((updatedOrder) =>
                            this.order$.pipe(
                                take(1),
                                filter((item) => item && item.id === id),
                                tap(() => {
                                    this._order.next(updatedOrder);
                                    return updatedOrder;
                                })
                            )
                        )
                    )
            )
        );
    }

    createDonation(donation: Donations): Observable<Donations> {
        return this.orders$.pipe(
            take(1),
            switchMap((donations) =>
                this._httpClient
                    .post<Donations>(
                        'http://localhost:8080/volunteer/donation',
                        donation
                    )
                    .pipe(
                        map((newDonation) => {
                            // Update the products with the new product
                            this._orders.next([newDonation, ...donations]);

                            // Return the new product
                            return newDonation;
                        })
                    )
            )
        );
    }
}
