import { Injectable } from '@angular/core';
import { assign, cloneDeep } from 'lodash-es';
import { FuseMockApiService, FuseMockApiUtils } from '@fuse/lib/mock-api';
import { volunteers as volunteersData } from 'app/mock-api/apps/ecommerce/volunteers/data';

@Injectable({
    providedIn: 'root'
})
export class VolunteersMockApi {
    private _volunteers: any[] = volunteersData;

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
        // @ Volunteers - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onGet('api/apps/ecommerce/volunteers')
            .reply(({ request }) => {

                // Get available queries
                const search = request.params.get('search');
                const sort = request.params.get('sort') || 'name';
                const order = request.params.get('order') || 'asc';
                const page = parseInt(request.params.get('page') ?? '1', 10);
                const size = parseInt(request.params.get('size') ?? '10', 10);

                // Clone the volunteers
                let volunteers: any[] | null = cloneDeep(this._volunteers);

                // Sort the volunteers
                if (sort === 'name' || sort === 'active') {
                    volunteers.sort((a, b) => {
                        const fieldA = a[sort].toString().toUpperCase();
                        const fieldB = b[sort].toString().toUpperCase();
                        return order === 'asc' ? fieldA.localeCompare(fieldB) : fieldB.localeCompare(fieldA);
                    });
                }
                else {
                    volunteers.sort((a, b) => order === 'asc' ? a[sort] - b[sort] : b[sort] - a[sort]);
                }

                // If search exists...
                if (search) {
                    // Filter the volunteers
                    volunteers = volunteers.filter(volunteer => volunteer.name && volunteer.name.toLowerCase().includes(search.toLowerCase()));
                }

                // Paginate - Start
                const volunteersLength = volunteers.length;

                // Calculate pagination details
                const begin = page * size;
                const end = Math.min((size * (page + 1)), volunteersLength);
                const lastPage = Math.max(Math.ceil(volunteersLength / size), 1);

                // Prepare the pagination object
                let pagination = {};

                // If the requested page number is bigger than
                // the last possible page number, return null for
                // volunteers but also send the last possible page so
                // the app can navigate to there
                if (page > lastPage) {
                    volunteers = null;
                    pagination = {
                        lastPage
                    };
                }
                else {
                    // Paginate the results by size
                    volunteers = volunteers.slice(begin, end);

                    // Prepare the pagination mock-api
                    pagination = {
                        length: volunteersLength,
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
                        volunteers,
                        pagination
                    }
                ];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Volunteer - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onGet('api/apps/ecommerce/volunteer')
            .reply(({ request }) => {

                // Get the id from the params
                const id = request.params.get('id');

                // Clone the volunteers
                const volunteers = cloneDeep(this._volunteers);

                // Find the volunteer
                const volunteer = volunteers.find(item => item.id === id);

                // Return the response
                return [200, volunteer];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Volunteer - POST
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onPost('api/apps/ecommerce/volunteer')
            .reply(() => {

                // Generate a new volunteer
                const newVolunteer = {
                    id: FuseMockApiUtils.guid(),
                    name: 'A New Volunteer',
                    phone: '',
                    address: '',
                    email: '',
                    volunteeringDays: [],
                    volunteeringStartTime: '',
                    volunteeringEndTime: '',
                    active: false
                };

                // Unshift the new volunteer
                this._volunteers.unshift(newVolunteer);

                // Return the response
                return [200, newVolunteer];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Volunteer - PATCH
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onPatch('api/apps/ecommerce/volunteer')
            .reply(({ request }) => {

                // Get the id and volunteer
                const id = request.body.id;
                const volunteer = cloneDeep(request.body.volunteer);

                // Prepare the updated volunteer
                let updatedVolunteer = null;

                // Find the volunteer and update it
                this._volunteers.forEach((item, index, volunteers) => {

                    if (item.id === id) {
                        // Update the volunteer
                        volunteers[index] = assign({}, volunteers[index], volunteer);

                        // Store the updated volunteer
                        updatedVolunteer = volunteers[index];
                    }
                });

                // Return the response
                return [200, updatedVolunteer];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Volunteer - DELETE
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onDelete('api/apps/ecommerce/volunteer')
            .reply(({ request }) => {

                // Get the id
                const id = request.params.get('id');

                // Find the volunteer and delete it
                this._volunteers.forEach((item, index) => {

                    if (item.id === id) {
                        this._volunteers.splice(index, 1);
                    }
                });

                // Return the response
                return [200, true];
            });
    }
}