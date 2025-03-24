import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { VolunteersService } from 'app/modules/admin/volunteers/volunteers.service';
import { VolunteersPagination, Volunteers } from 'app/modules/admin/volunteers/volunteers.types';

@Injectable({
    providedIn: 'root'
})
export class VolunteersResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(private _volunteersService: VolunteersService) {
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<{ pagination: VolunteersPagination; volunteers: Volunteers[] }> {
        return this._volunteersService.getVolunteers();
    }
}

@Injectable({
    providedIn: 'root'
})
export class VolunteerDetailResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(
        private _volunteersService: VolunteersService,
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Volunteers> {
        return this._volunteersService.getVolunteerById(route.paramMap.get('id'))
            .pipe(
                // Error here means the requested volunteer is not available
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
