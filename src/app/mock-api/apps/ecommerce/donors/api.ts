import { Injectable } from '@angular/core';
import { assign, cloneDeep } from 'lodash-es';
import { FuseMockApiService, FuseMockApiUtils } from '@fuse/lib/mock-api';
import { donors as donorsData } from 'app/mock-api/apps/ecommerce/donors/data';

@Injectable({
    providedIn: 'root'
})
export class DonorsMockApi {
    private _donors: any[] = donorsData;

    /**
     * Constructor
     */
    constructor(private _fuseMockApiService: FuseMockApiService) {
        // Register Mock API handlers
        this.registerHandlers();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Register Mock API handlers
     */
    registerHandlers(): void {
        // -----------------------------------------------------------------------------------------------------
        // @ Donors - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onGet('api/apps/donors')
            .reply(({ request }) => {

                // Get available queries
                const search = request.params.get('search');
                const sort = request.params.get('sort') || 'name';
                const order = request.params.get('order') || 'asc';
                const page = parseInt(request.params.get('page') ?? '1', 10);
                const size = parseInt(request.params.get('size') ?? '10', 10);

                // Clone the donors
                let donors: any[] | null = cloneDeep(this._donors);

                // Sort the donors
                if (sort === 'name' || sort === 'email') {
                    donors.sort((a, b) => {
                        const fieldA = a[sort].toString().toUpperCase();
                        const fieldB = b[sort].toString().toUpperCase();
                        return order === 'asc' ? fieldA.localeCompare(fieldB) : fieldB.localeCompare(fieldA);
                    });
                }
                else {
                    donors.sort((a, b) => order === 'asc' ? a[sort] - b[sort] : b[sort] - a[sort]);
                }

                // If search exists...
                if (search) {
                    // Filter the donors
                    donors = donors.filter(donor => donor.name && donor.name.toLowerCase().includes(search.toLowerCase()));
                }

                // Paginate - Start
                const donorsLength = donors.length;

                // Calculate pagination details
                const begin = page * size;
                const end = Math.min((size * (page + 1)), donorsLength);
                const lastPage = Math.max(Math.ceil(donorsLength / size), 1);

                // Prepare the pagination object
                let pagination = {};

                // If the requested page number is bigger than
                // the last possible page number, return null for
                // donors but also send the last possible page so
                // the app can navigate to there
                if (page > lastPage) {
                    donors = null;
                    pagination = {
                        lastPage
                    };
                }
                else {
                    // Paginate the results by size
                    donors = donors.slice(begin, end);

                    // Prepare the pagination mock-api
                    pagination = {
                        length: donorsLength,
                        size: size,
                        page: page,
                        lastPage: lastPage,
                        startIndex: begin,
                        endIndex: end - 1
                    };
                }

                // Return the response
                return [
                    200,
                    {
                        donors,
                        pagination
                    }
                ];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Donor - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onGet('api/apps/donor')
            .reply(({ request }) => {

                // Get the id from the params
                const id = request.params.get('id');

                // Clone the donors
                const donors = cloneDeep(this._donors);

                // Find the donor
                const donor = donors.find(item => item.id === id);

                // Return the response
                return [200, donor];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Donor - POST
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onPost('api/apps/donor')
            .reply(() => {

                // Generate a new donor
                const newDonor = {
                    id: FuseMockApiUtils.guid(),
                    name: '',
                    address: '',
                    pincode: '',
                    contact: '',
                    email: ''
                };

                // Unshift the new donor
                this._donors.unshift(newDonor);

                // Return the response
                return [200, newDonor];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Donor - PATCH
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onPatch('api/apps/donor')
            .reply(({ request }) => {
                // Get the id and donor
                const id = request.body.id;
                const donor = cloneDeep(request.body.donor);

                // Prepare the updated donor
                let updatedDonor = null;

                // Find the donor and update it
                this._donors.forEach((item, index, donors) => {

                    if (item.id === id) {
                        // Update the donor
                        donors[index] = assign({}, donors[index], donor);

                        // Store the updated donor
                        updatedDonor = donors[index];
                    }
                });

                // Return the response
                return [200, updatedDonor];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Donor - DELETE
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onDelete('api/apps/donor')
            .reply(({ request }) => {

                // Get the id
                const id = request.params.get('id');

                // Find the donor and delete it
                this._donors.forEach((item, index) => {

                    if (item.id === id) {
                        this._donors.splice(index, 1);
                    }
                });

                // Return the response
                return [200, true];
            });
    }
}