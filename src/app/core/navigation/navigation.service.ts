import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { Navigation } from 'app/core/navigation/navigation.types';
import { compact } from 'lodash';
import { FuseNavigationItem } from '@fuse/components/navigation';
import { cloneDeep } from 'lodash-es';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class NavigationService {
    private _navigation: ReplaySubject<Navigation> =
        new ReplaySubject<Navigation>(1);
    private defaultNavigation: FuseNavigationItem[];

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient, private _router: Router) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for navigation
     */
    get navigation$(): Observable<Navigation> {
        return this._navigation.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get all navigation data
     */
    get(): Observable<Navigation> {
        return this._httpClient
            .get<FuseNavigationItem[]>('http://localhost:8080/auth/navigation')
            .pipe(
                map((navigation) => ({
                    compact: [],
                    default: navigation, // Put the response array into default
                    futuristic: [],
                    horizontal: [],
                })),
                tap((mappedNavigation) => {
                    // this.defaultNavigation = navigation
                    // let nav ={
                    //         compact   : [],
                    //         default   : cloneDeep(this.defaultNavigation),
                    //         futuristic: [],
                    //         horizontal: []
                    //     };
                    // console.log("navdto");
                    // console.log(nav)
                    this._navigation.next(mappedNavigation);
                    console.log(mappedNavigation['default'][0]['link']);
                    // this._router.navigateByUrl(mappedNavigation["default"][0]["link"]);
                })
            );
    }
}
