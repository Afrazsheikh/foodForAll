import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AccountService } from 'app/modules/admin/account/account.service';

@Injectable({
    providedIn: 'root'
})
export class AccountResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _accountService: AccountService)
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>
    {
        return this._accountService.getData();
    }
}
