import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';
import {
    CanopiesPagination,
    Canopies,
} from 'app/modules/admin/canopies/canopies.types';

@Injectable({
    providedIn: 'root',
})
export class CanopiesService {
    // private _data: BehaviorSubject<any> = new BehaviorSubject(null);
    private _canopies: BehaviorSubject<Canopies[] | null> = new BehaviorSubject(
        null
    );
    private _canopy: BehaviorSubject<Canopies | null> = new BehaviorSubject(
        null
    );

    private _pagination: BehaviorSubject<CanopiesPagination | null> =
        new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for data
     */
    // get data$(): Observable<any>
    // {
    //     return this._data.asObservable();
    // }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get data
     */
    // getData(): Observable<any>
    // {
    //     return this._httpClient.get('api/dashboards/project').pipe(
    //         tap((response: any) => {
    //             this._data.next(response);
    //         })
    //     );
    // }

    /**
     * Getter for canopies
     */
    get canopies$(): Observable<Canopies[]> {
        return this._canopies.asObservable();
    }

    /**
     * Getter for canopies
     */
    get canopy$(): Observable<Canopies> {
        return this._canopy.asObservable();
    }

    /**
     * Getter for pagination
     */
    get pagination$(): Observable<CanopiesPagination> {
        return this._pagination.asObservable();
    }

    /**
     * Get products
     *
     *
     * @param page
     * @param size
     * @param sort
     * @param order
     * @param search
     */
    getCanopies(
        page: number = 0,
        size: number = 10,
        sort: string = 'name',
        order: 'asc' | 'desc' | '' = 'asc',
        search: string = ''
    ): Observable<{ pagination: CanopiesPagination; canopies: Canopies[] }> {
        return this._httpClient
            .get<{ pagination: CanopiesPagination; canopies: Canopies[] }>(
                'http://localhost:8080/admin/canopies',
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
                    this._canopies.next(response.canopies);
                })
            );
    }

    /**
     * Get product by id
     */
    getCanopyById(id: string): Observable<Canopies> {
        return this._canopies.pipe(
            take(1),
            map((canopies) => {
                // Find the product
                const canopy = canopies.find((item) => item.id === id) || null;

                // Update the product
                this._canopy.next(canopy);

                // Return the product
                return canopy;
            }),
            switchMap((canopy) => {
                if (!canopy) {
                    return throwError(
                        'Could not found product with id of ' + id + '!'
                    );
                }

                return of(canopy);
            })
        );
    }

    /**
     * Create product
     */
    createCanopy(): Observable<Canopies> {
        return this.canopies$.pipe(
            take(1),
            switchMap((canopies) =>
                this._httpClient
                    .post<Canopies>('http://localhost:8080/admin/canopy', {
                        name: 'Please add a name',
                        pincode: '000000',
                        address: 'Please add an address',
                    })
                    .pipe(
                        map((newCanopy) => {
                            // Update the products with the new product
                            this._canopies.next([newCanopy, ...canopies]);

                            // Return the new product
                            return newCanopy;
                        })
                    )
            )
        );
    }

    /**
     * Update product
     *
     * @param id
     * @param product
     */
    updateCanopy(id: string, canopy: Canopies): Observable<Canopies> {
        return this.canopies$.pipe(
            take(1),
            switchMap((canopies) =>
                this._httpClient
                    .patch<Canopies>(
                        'http://localhost:8080/admin/canopy/' + id,
                        canopy
                    )
                    .pipe(
                        map((updateCanopy) => {
                            // Find the index of the updated product
                            const index = canopies.findIndex(
                                (item) => item.id === id
                            );

                            // Update the product
                            canopies[index] = updateCanopy;

                            // Update the products
                            this._canopies.next(canopies);

                            // Return the updated product
                            return updateCanopy;
                        }),
                        switchMap((updatedCanopy) =>
                            this.canopy$.pipe(
                                take(1),
                                filter((item) => item && item.id === id),
                                tap(() => {
                                    // Update the product if it's selected
                                    this._canopy.next(updatedCanopy);

                                    // Return the updated product
                                    return updatedCanopy;
                                })
                            )
                        )
                    )
            )
        );
    }

    /**
     * Delete the product
     *
     * @param id
     */
    deleteProduct(id: string, canopy: Canopies): Observable<Canopies> {
        canopy.active = false;
        return this.updateCanopy(id, canopy);
        // return this.canopies$.pipe(
        //     take(1),
        //     switchMap(canopies => this._httpClient.patch<Canopies>('api/apps/ecommerce/inventory/product/delete', {
        //         id,
        //         canopy
        //     }).pipe(
        //         map((updateCanopy) => {

        //             // Find the index of the updated product
        //             const index = canopies.findIndex(item => item.id === id);

        //             // Update the product
        //             canopies[index] = updateCanopy;

        //             // Update the products
        //             this._canopies.next(canopies);

        //             // Return the updated product
        //             return updateCanopy;
        //         }),
        //         switchMap(updatedCanopy => this.canopy$.pipe(
        //             take(1),
        //             filter(item => item && item.id === id),
        //             tap(() => {

        //                 // Update the product if it's selected
        //                 this._canopy.next(updatedCanopy);

        //                 // Return the updated product
        //                 return updatedCanopy;
        //             })
        //         ))
        //     ))
        // );
    }
}
