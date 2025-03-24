import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';
import { Donors, DonorsPagination } from './donors.types';

@Injectable({
    providedIn: 'root',
})
export class DonorsService {
    private _donors: BehaviorSubject<Donors[] | null> = new BehaviorSubject(
        null
    );
    private _donor: BehaviorSubject<Donors | null> = new BehaviorSubject(null);
    private _pagination: BehaviorSubject<DonorsPagination | null> =
        new BehaviorSubject(null);

    constructor(private _httpClient: HttpClient) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    get donors$(): Observable<Donors[]> {
        return this._donors.asObservable();
    }

    get donor$(): Observable<Donors> {
        return this._donor.asObservable();
    }

    get pagination$(): Observable<DonorsPagination> {
        return this._pagination.asObservable();
    }

    getDonors(
        page: number = 0,
        size: number = 10,
        sort: string = 'name',
        order: 'asc' | 'desc' | '' = 'asc',
        search: string = ''
    ): Observable<{ pagination: DonorsPagination; donors: Donors[] }> {
        return this._httpClient
            .get<{ pagination: DonorsPagination; donors: Donors[] }>(
                'http://localhost:8080/admin/donors',
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
                    this._donors.next(response.donors);
                })
            );
    }

    getDonorById(id: string): Observable<Donors> {
        return this.donors$.pipe(
            take(1),
            map((donors) => {
                const donor = donors.find((item) => item.id === id) || null;
                this._donor.next(donor);
                return donor;
            }),
            switchMap((donor) => {
                if (!donor) {
                    return throwError(
                        'Could not find donor with id of ' + id + '!'
                    );
                }
                return of(donor);
            })
        );
    }

    createDonor(): Observable<Donors> {
        return this.donors$.pipe(
            take(1),
            switchMap((donors) =>
                this._httpClient.post<Donors>('api/apps/donor', {}).pipe(
                    map((newDonor) => {
                        this._donors.next([newDonor, ...donors]);
                        return newDonor;
                    })
                )
            )
        );
    }

    updateDonor(id: string, donor: Donors): Observable<Donors> {
        return this.donors$.pipe(
            take(1),
            switchMap((donors) =>
                this._httpClient
                    .patch<Donors>('api/apps/donor', {
                        id,
                        donor,
                    })
                    .pipe(
                        map((updatedDonor) => {
                            const index = donors.findIndex(
                                (item) => item.id === id
                            );
                            donors[index] = updatedDonor;
                            this._donors.next(donors);
                            return updatedDonor;
                        }),
                        switchMap((updatedDonor) =>
                            this.donor$.pipe(
                                take(1),
                                filter((item) => item && item.id === id),
                                tap(() => {
                                    this._donor.next(updatedDonor);
                                    return updatedDonor;
                                })
                            )
                        )
                    )
            )
        );
    }
}
