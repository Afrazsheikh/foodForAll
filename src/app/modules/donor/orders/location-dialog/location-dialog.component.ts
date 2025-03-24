import { Component, OnInit } from '@angular/core';

declare var google: any; // Ensure Google Maps API is available

@Component({
    selector: 'app-location-dialog',
    templateUrl: './location-dialog.component.html',
    styleUrls: ['./location-dialog.component.scss'],
})
export class LocationDialogComponent implements OnInit {
    volunteerLat: number = 28.5; // Volunteer Default Location
    volunteerLng: number = 77.4;
    donorLat: number = 28.6139; // Noida Default Location
    donorLng: number = 77.209;

    estimatedTime: string = ''; // To store estimated arrival time
    map: any;
    directionsService: any;
    directionsRenderer: any;
    distanceService: any;

    constructor() {}

    ngOnInit(): void {
        this.trackVolunteer(); // Live tracking
        this.directionsService = new google.maps.DirectionsService();
        this.directionsRenderer = new google.maps.DirectionsRenderer();
        this.distanceService = new google.maps.DistanceMatrixService();
    }

    // Track Volunteer’s Live Location
    trackVolunteer() {
        if (navigator.geolocation) {
            navigator.geolocation.watchPosition((position) => {
                this.volunteerLat = position.coords.latitude;
                this.volunteerLng = position.coords.longitude;
                this.getRoute(); // Update route on movement
                this.getEstimatedTime(); // Update time estimate
            });
        }
    }

    // Get Map Instance
    onMapReady(map) {
        this.map = map;
        this.directionsRenderer.setMap(this.map);
        this.getRoute();
        this.getEstimatedTime();
    }

    // Get Route from Volunteer to Donor
    getRoute() {
        if (!this.map || !this.donorLat || !this.volunteerLat) return;

        const request = {
            origin: { lat: this.volunteerLat, lng: this.volunteerLng },
            destination: { lat: this.donorLat, lng: this.donorLng },
            travelMode: google.maps.TravelMode.DRIVING,
        };

        this.directionsService.route(request, (response, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
                this.directionsRenderer.setDirections(response);
            }
        });
    }

    // Get Estimated Travel Time using Distance Matrix API
    getEstimatedTime() {
        if (!this.donorLat || !this.volunteerLat) return;

        this.distanceService.getDistanceMatrix(
            {
                origins: [{ lat: this.volunteerLat, lng: this.volunteerLng }],
                destinations: [{ lat: this.donorLat, lng: this.donorLng }],
                travelMode: google.maps.TravelMode.DRIVING,
            },
            (response, status) => {
                if (status === 'OK') {
                    const results = response.rows[0].elements[0];
                    if (results.status === 'OK') {
                        this.estimatedTime = results.duration.text; // Store estimated time
                    }
                }
            }
        );
    }
}
