import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CanopiesService } from 'app/modules/admin/canopies/canopies.service';
import { CanopiesPagination, Canopies } from 'app/modules/admin/canopies/canopies.types';


@Injectable({
    providedIn: 'root'
})
export class CanopyResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(
        private _canopiesService: CanopiesService,
        private _router: Router
    )
    {
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Canopies>
    {
        return this._canopiesService.getCanopyById(route.paramMap.get('id'))
                   .pipe(
                       // Error here means the requested product is not available
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

@Injectable({
    providedIn: 'root'
})
export class CanopiesResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _canopiesService: CanopiesService)
    {
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<{ pagination: CanopiesPagination; canopies: Canopies[] }>
    {
        return this._canopiesService.getCanopies();
    }
}