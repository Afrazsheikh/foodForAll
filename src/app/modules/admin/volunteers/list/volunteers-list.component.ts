import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, Observable, Subject } from 'rxjs';
import { debounceTime, map, switchMap, takeUntil } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { Volunteers, VolunteersPagination } from 'app/modules/admin/volunteers/volunteers.types';
import { VolunteersService } from 'app/modules/admin/volunteers/volunteers.service';
import { tap } from 'rxjs/operators';

@Component({
    selector: 'volunteers-list',
    templateUrl: './volunteers-list.component.html',
    styles: [
        /* language=SCSS */
        `
            .volunteers-grid {
                grid-template-columns: 48px auto 40px;

                @screen sm {
                    grid-template-columns: 48px auto 112px 72px;
                }

                @screen md {
                    grid-template-columns: 48px 112px auto 112px 72px;
                }

                @screen lg {
                    grid-template-columns: 48px auto 112px 112px 96px 96px 72px;
                }
            }
        `
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations
})
export class VolunteersListComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;

    volunteers$: Observable<Volunteers[]>;

    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = false;
    pagination: VolunteersPagination;
    searchInputControl: FormControl = new FormControl();
    selectedVolunteer: Volunteers | null = null;
    selectedVolunteerForm: FormGroup;
    weekDays: Array<{id: number, day: string}>;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    hours24: string[] = Array.from({ length: 24 }, (_, hour) =>
        `${hour.toString().padStart(2, '0')}:00`
    );

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: FormBuilder,
        private _volunteersService: VolunteersService
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Create the selected volunteer form
        this.selectedVolunteerForm = this._formBuilder.group({
            id: [''],
            name: ['', [Validators.required]],
            contact: [''],
            volunteeringDays: [''],
            address: [''],
            pincode: [''],
            email: [''],
            volunteeringStartTime: [''],
            volunteeringEndTime: [''],
            password: [''],
            active: [true]
        });

        this.weekDays = [
            { id: 1, day: "Monday"},
            { id: 2, day: "Tuesday" },
            { id: 3, day: "Wednesday" },
            { id: 4, day: "Thursday" },
            { id: 5, day: "Friday" },
            { id: 6, day: "Saturday" },
            { id: 7, day: "Sunday" },
        ];

        // Get the pagination
        this._volunteersService.pagination$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((pagination: VolunteersPagination) => {

                // Update the pagination
                this.pagination = pagination;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the volunteers
        this.volunteers$ = this._volunteersService.volunteers$;

        // Subscribe to search input field value changes
        this.searchInputControl.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300),
                switchMap((query) => {
                    this.closeDetails();
                    this.isLoading = true;
                    return this._volunteersService.getVolunteers(0, 10, 'name', 'asc', query);
                }),
                map(() => {
                    this.isLoading = false;
                })
            )
            .subscribe();
    }

    /**
     * After view init
     */
    ngAfterViewInit(): void {
        if (this._sort && this._paginator) {
            // Set the initial sort
            this._sort.sort({
                id: 'name',
                start: 'asc',
                disableClear: true
            });

            // Mark for check
            this._changeDetectorRef.markForCheck();

            // If the user changes the sort order...
            this._sort.sortChange
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe(() => {
                    // Reset back to the first page
                    this._paginator.pageIndex = 0;

                    // Close the details
                    this.closeDetails();
                });

            // Get volunteers if sort or page changes
            merge(this._sort.sortChange, this._paginator.page).pipe(
                switchMap(() => {
                    this.closeDetails();
                    this.isLoading = true;
                    return this._volunteersService.getVolunteers(this._paginator.pageIndex, this._paginator.pageSize, this._sort.active, this._sort.direction);
                }),
                map(() => {
                    this.isLoading = false;
                })
            ).subscribe();
        }
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle volunteer details
     *
     * @param volunteerId
     */
    toggleDetails(volunteerId: string): void {
        // If the volunteer is already selected...
        if (this.selectedVolunteer && this.selectedVolunteer.id === volunteerId) {
            // Close the details
            this.closeDetails();
            return;
        }

        // Get the volunteer by id
        this._volunteersService.getVolunteerById(volunteerId)
            .subscribe((volunteer) => {

                // Set the selected volunteer
                this.selectedVolunteer = volunteer;

                // Fill the form
                this.selectedVolunteerForm.patchValue(volunteer);

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    /**
     * Close the details
     */
    closeDetails(): void {
        this.selectedVolunteer = null;
    }

    /**
     * Create volunteer
     */
    createVolunteer(): void {
        // Create the volunteer
        this._volunteersService.createVolunteer().subscribe((newVolunteer) => {

            // Go to new volunteer
            this.selectedVolunteer = newVolunteer;

            // Fill the form
            this.selectedVolunteerForm.patchValue(newVolunteer);

            // Mark for check
            this._changeDetectorRef.markForCheck();
        });
    }

    /**
     * Update the selected volunteer using the form data
     */
    updateSelectedVolunteer(): void {
        // Get the volunteer object
        const volunteer = this.selectedVolunteerForm.getRawValue();
        // Update the volunteer on the server
        this._volunteersService.updateVolunteer(volunteer.id, volunteer).subscribe(() => {

            // Show a success message
            this.showFlashMessage('success');
        });
    }


    /**
     * Show flash message
     */
    showFlashMessage(type: 'success' | 'error'): void {
        // Show the message
        this.flashMessage = type;

        // Mark for check
        this._changeDetectorRef.markForCheck();
        console.log(this.flashMessage)
        console.log("asdasd")
        // Hide it after 3 seconds
        setTimeout(() => {

            this.flashMessage = null;

            // Mark for check
            this._changeDetectorRef.markForCheck();
        }, 3000);
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
}
