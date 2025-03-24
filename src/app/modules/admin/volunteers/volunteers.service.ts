import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';
import { VolunteersPagination, Volunteers } from './volunteers.types';

@Injectable({
    providedIn: 'root',
})
export class VolunteersService {
    private _volunteers: BehaviorSubject<Volunteers[] | null> =
        new BehaviorSubject(null);
    private _volunteer: BehaviorSubject<Volunteers | null> =
        new BehaviorSubject(null);
    private _pagination: BehaviorSubject<VolunteersPagination | null> =
        new BehaviorSubject(null);

    constructor(private _httpClient: HttpClient) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    get volunteers$(): Observable<Volunteers[]> {
        return this._volunteers.asObservable();
    }

    get volunteer$(): Observable<Volunteers> {
        return this._volunteer.asObservable();
    }

    get pagination$(): Observable<VolunteersPagination> {
        return this._pagination.asObservable();
    }

    getVolunteers(
        page: number = 0,
        size: number = 10,
        sort: string = 'name',
        order: 'asc' | 'desc' | '' = 'asc',
        search: string = ''
    ): Observable<{
        pagination: VolunteersPagination;
        volunteers: Volunteers[];
    }> {
        return this._httpClient
            .get<{
                pagination: VolunteersPagination;
                volunteers: Volunteers[];
            }>('http://localhost:8080/admin/volunteers', {
                params: {
                    page: '' + page,
                    size: '' + size,
                    sort,
                    order,
                    search,
                },
            })
            .pipe(
                tap((response) => {
                    this._pagination.next(response.pagination);
                    this._volunteers.next(response.volunteers);
                })
            );
    }

    getVolunteerById(id: string): Observable<Volunteers> {
        return this.volunteers$.pipe(
            take(1),
            map((volunteers) => {
                const volunteer =
                    volunteers.find((item) => item.id === id) || null;
                this._volunteer.next(volunteer);
                return volunteer;
            }),
            switchMap((volunteer) => {
                if (!volunteer) {
                    return throwError(
                        'Could not find volunteer with id of ' + id + '!'
                    );
                }
                return of(volunteer);
            })
        );
    }

    createVolunteer(): Observable<Volunteers> {
        return this.volunteers$.pipe(
            take(1),
            switchMap((volunteers) =>
                this._httpClient
                    .post<Volunteers>('http://localhost:8080/admin/volunteer', {
                        name: 'Please add a Name',
                        contact: '000000000',
                        address: 'Please add address',
                        pincode: 'Please add pincode',
                        email: 'email',
                        volunteeringDays: [1, 2, 3],
                        volunteeringStartTime: '8:00',
                        volunteeringEndTime: '18:00',
                        active: true,
                        password: 'add password',
                    })
                    .pipe(
                        map((newVolunteer) => {
                            this._volunteers.next([
                                newVolunteer,
                                ...volunteers,
                            ]);
                            return newVolunteer;
                        })
                    )
            )
        );
    }

    updateVolunteer(id: string, volunteer: Volunteers): Observable<Volunteers> {
        return this.volunteers$.pipe(
            take(1),
            switchMap((volunteers) =>
                this._httpClient
                    .patch<Volunteers>(
                        'http://localhost:8080/admin/volunteer/' + id,
                        volunteer
                    )
                    .pipe(
                        map((updatedVolunteer) => {
                            const index = volunteers.findIndex(
                                (item) => item.id === id
                            );
                            volunteers[index] = updatedVolunteer;
                            this._volunteers.next(volunteers);
                            console.log('here2');
                            console.log(updatedVolunteer);
                            return updatedVolunteer;
                        }),
                        switchMap((updatedVolunteer) =>
                            this.volunteer$.pipe(
                                take(1),
                                filter((item) => item && item.id === id),
                                tap(() => {
                                    this._volunteer.next(updatedVolunteer);
                                    return updatedVolunteer;
                                })
                            )
                        )
                    )
            )
        );
    }

    // inactivateVolunteer(id: string, volunteer: Volunteers): Observable<Volunteers> {
    //     volunteer.active = false;
    //     return this.updateVolunteer(id, volunteer);
    // }
}
