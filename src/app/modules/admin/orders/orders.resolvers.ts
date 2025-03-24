import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { OrdersService } from './orders.service';
import { DonationsPagination, Donations } from './orders.types';
import { VolunteersService } from 'app/modules/admin/volunteers/volunteers.service';
import { VolunteersPagination, Volunteers } from 'app/modules/admin/volunteers/volunteers.types';

@Injectable({
    providedIn: 'root'
})
export class OrdersResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(private _ordersService: OrdersService) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<{ pagination: DonationsPagination; donations: Donations[] }> {
        return this._ordersService.getOrders();
    }
}

@Injectable({
    providedIn: 'root'
})
export class OrderDetailResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(
        private _ordersService: OrdersService,
        private _router: Router
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Donations> {
        return this._ordersService.getOrderById(route.paramMap.get('id'))
            .pipe(
                // Error here means the requested order is not available
                catchError((error) => {

                    // Get the parent url
                    const parentUrl = state.url.split('/').slice(0, -1).join('/');

                    // Navigate to there
                    this._router.navigateByUrl(parentUrl);

                    // Throw an error
                    return throwError(error);
                })
            );
    }
}

// @Injectable({
//     providedIn: 'root'
// })
// export class VolunteersResolver implements Resolve<any> {
//     /**
//      * Constructor
//      */
//     constructor(private _volunteersService: VolunteersService) {
//     }

//     // -----------------------------------------------------------------------------------------------------
//     // @ Public methods
//     // -----------------------------------------------------------------------------------------------------

//     /**
//      * Resolver
//      *
//      * @param route
//      * @param state
//      */
//     resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<{ pagination: VolunteersPagination; volunteers: Volunteers[] }> {
//         return this._volunteersService.getVolunteers();
//     }
// }