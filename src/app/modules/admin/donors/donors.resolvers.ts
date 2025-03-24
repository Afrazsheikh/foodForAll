import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DonorsService } from './donors.service';
import { DonorsPagination, Donors } from './donors.types';

@Injectable({
    providedIn: 'root'
})
export class DonorsResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(private _donorsService: DonorsService) {
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<{ pagination: DonorsPagination; donors: Donors[] }> {
        return this._donorsService.getDonors();
    }
}

@Injectable({
    providedIn: 'root'
})
export class DonorDetailResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(
        private _donorsService: DonorsService,
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Donors> {
        return this._donorsService.getDonorById(route.paramMap.get('id'))
            .pipe(
                // Error here means the requested donor is not available
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
