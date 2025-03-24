import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, Observable, Subject } from 'rxjs';
import { debounceTime, map, switchMap, takeUntil } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import {
    Donations,
    DonationsPagination,
} from 'app/modules/donor/orders/orders.types';
import { OrdersService } from 'app/modules/donor/orders/orders.service';
import { tap } from 'rxjs/operators';
import { activities } from 'app/mock-api/pages/activities/data';
import { MatDialog } from '@angular/material/dialog';
import { MailboxComposeComponent } from 'app/modules/donor/orders/compose/compose.component';
import { HttpClient } from '@angular/common/http';
import { LocationDialogComponent } from '../location-dialog/location-dialog.component';

@Component({
    selector: 'orders-list',
    templateUrl: './orders-list.component.html',
    styles: [
        /* language=SCSS */
        `
            .orders-grid {
                grid-template-columns: 48px auto 40px;

                @screen sm {
                    grid-template-columns: 48px auto 112px 72px;
                }

                @screen md {
                    grid-template-columns: 48px 112px auto 112px 72px;
                }

                @screen lg {
                    grid-template-columns: 50px 150px 250px 150px 150px 150px 150px;
                }
            }
        `,
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations,
})
export class OrdersListComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;

    orders$: Observable<Donations[]>;

    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = false;
    pagination: DonationsPagination;
    searchInputControl: FormControl = new FormControl();
    selectedOrder: Donations | null = null;
    selectedOrderForm: FormGroup;
    donor: FormGroup;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    volunteerLat: number = 0; // Volunteer Latitude
    volunteerLng: number = 0; // Volunteer Longitude
    donorLat: number = 0; // Donor Latitude
    donorLng: number = 0; // Donor Longitude
    directionsService: any;
    directionsDisplay: any;

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: FormBuilder,
        private _ordersService: OrdersService,
        private _matDialog: MatDialog,
        private http: HttpClient
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.directionsService = new google.maps.DirectionsService();
        this.directionsDisplay = new google.maps.DirectionsRenderer();
        // Create the selected order form
        this.selectedOrderForm = this._formBuilder.group({
            id: [''],
            pickupAddress: ['', [Validators.required]],
            dropAddress: ['', [Validators.required]],
            currentState: [''],
            customerId: [''],
            volunteerName: [''],
            time: [''],
            date: [''],
            pincode: [''],
            donationTime: [''],
            active: [false],
            status: [false],
        });

        // Get the pagination
        this._ordersService.pagination$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((pagination: DonationsPagination) => {
                // Update the pagination
                this.pagination = pagination;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the orders
        this.orders$ = this._ordersService.orders$;

        // Subscribe to search input field value changes
        this.searchInputControl.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300),
                switchMap((query) => {
                    this.closeDetails();
                    this.isLoading = true;
                    return this._ordersService.getOrders(
                        0,
                        10,
                        'pickupAddress',
                        'asc',
                        query
                    );
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
        this.orders$.subscribe((orders) => {
            console.log('Orders:', orders);
        });
        if (this._sort && this._paginator) {
            // Set the initial sort
            this._sort.sort({
                id: 'pickupAddress',
                start: 'asc',
                disableClear: true,
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

            // Get orders if sort or page changes
            merge(this._sort.sortChange, this._paginator.page)
                .pipe(
                    switchMap(() => {
                        this.closeDetails();
                        this.isLoading = true;
                        return this._ordersService.getOrders(
                            this._paginator.pageIndex,
                            this._paginator.pageSize,
                            this._sort.active,
                            this._sort.direction
                        );
                    }),
                    map(() => {
                        this.isLoading = false;
                    })
                )
                .subscribe();
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
     * Toggle order details
     *
     * @param orderId
     */
    toggleDetails(orderId: string): void {
        // If the order is already selected...
        if (this.selectedOrder && this.selectedOrder.id === orderId) {
            // Close the details
            this.closeDetails();
            return;
        }

        // Get the order by id
        this._ordersService.getOrderById(orderId).subscribe((order) => {
            // Set the selected order
            this.selectedOrder = order;
            // Fill the form
            this.selectedOrderForm.patchValue(order);
            // Mark for check
            this._changeDetectorRef.markForCheck();
        });
    }

    /**
     * Close the details
     */
    closeDetails(): void {
        this.selectedOrder = null;
    }

    /**
     * Update the selected order using the form data
     */
    updateSelectedOrder(): void {
        // Get the order object
        const order = this.selectedOrderForm.getRawValue();
        // Update the order on the server
        this._ordersService
            .updateOrder(order.id, order.assignedVolunteerId)
            .subscribe(() => {
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

    /**
     * Open openDonationDialog dialog
     */
    openDonationDialog(): void {
        // Open the dialog
        const dialogRef = this._matDialog.open(MailboxComposeComponent);

        dialogRef.afterClosed().subscribe((result) => {
            console.log('Compose dialog was closed!');
        });
    }
    getCoordinates(address: string) {
        this.http
            .get(
                `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=AIzaSyDpSpG2tYsXynSyTvf-Y0UuThqeh2tEsnI`
            )
            .subscribe((response: any) => {
                if (response.status === 'OK') {
                    const location = response.results[0].geometry.location;
                    this.volunteerLat = location.lat;
                    this.volunteerLng = location.lng;
                }
            });
    }
    trackVolunteer() {
        if (navigator.geolocation) {
            navigator.geolocation.watchPosition((position) => {
                this.volunteerLat = position.coords.latitude;
                this.volunteerLng = position.coords.longitude;
            });
        }
    }
    getRoute() {
        this.directionsService.route(
            {
                origin: { lat: this.volunteerLat, lng: this.volunteerLng },
                destination: { lat: this.donorLat, lng: this.donorLng },
                travelMode: google.maps.TravelMode.DRIVING,
            },
            (response, status) => {
                if (status === google.maps.DirectionsStatus.OK) {
                    this.directionsDisplay.setDirections(response);
                }
            }
        );
    }

    locationDialog() {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const dialogWidth = screenWidth < 600 ? '90vw' : '1200px';
        const dialogHeight = screenWidth < 600 ? '80vh' : '800px';

        const dialogRef = this._matDialog.open(LocationDialogComponent, {
            width: dialogWidth,
            height: dialogHeight,
        });

        dialogRef.afterClosed().subscribe(() => {
            console.log('Location dialog was closed!');
        });
    }
}
