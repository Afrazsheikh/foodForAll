import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { Title } from '@angular/platform-browser';
import { Location, Appearance, GermanAddress } from '@angular-material-extensions/google-maps-autocomplete';
/// <reference types="@types/googlemaps" />
import PlaceResult = google.maps.places.PlaceResult;

@Component({
    selector     : 'auth-sign-up',
    templateUrl  : './sign-up.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class AuthSignUpComponent implements OnInit
{
    @ViewChild('signUpNgForm') signUpNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type   : 'success',
        message: ''
    };
    signUpForm: FormGroup;
    showAlert: boolean = false;
    public appearance = Appearance;
    public zoom: number;
    public latitude: number;
    public longitude: number;
    public selectedAddress: PlaceResult;
    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _formBuilder: FormBuilder,
        private _router: Router,
        private titleService: Title
    )
    {
    }


    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Create the form
        this.signUpForm = this._formBuilder.group({
                name      : ['', Validators.required],
                email     : ['', [Validators.required, Validators.email]],
                password  : ['', Validators.required],
                // address: ['', Validators.required],
                pincode: ['', Validators.required],
                contact: ['', Validators.required],
                agreements: ['', Validators.requiredTrue]
            }
        );

        this.titleService.setTitle('Home | @angular-material-extensions/google-maps-autocomplete');

        this.zoom = 10;
        this.latitude = 52.520008;
        this.longitude = 13.404954;

        this.setCurrentPosition();
        
    }


    private setCurrentPosition() {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                this.latitude = position.coords.latitude;
                this.longitude = position.coords.longitude;
                this.zoom = 12;
            });
        }
    }

    onAutocompleteSelected(result: PlaceResult) {
        console.log('onAutocompleteSelected: ', result);
    }

    onLocationSelected(location: Location) {
        console.log('onLocationSelected: ', location);
        this.latitude = location.latitude;
        this.longitude = location.longitude;
    }

    onGermanAddressMapped($event: GermanAddress) {
        console.log('onGermanAddressMapped', $event);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign up
     */
    signUp(): void
    {
        // Do nothing if the form is invalid
        if ( this.signUpForm.invalid )
        {
            return;
        }

        // Disable the form
        this.signUpForm.disable();

        // Hide the alert
        this.showAlert = false;

        // Sign up
        this._authService.signUp(this.signUpForm.value)
            .subscribe(
                (response) => {

                    // Navigate to the confirmation required page
                    this._router.navigateByUrl('/sign-in');
                },
                (response) => {

                    // Re-enable the form
                    this.signUpForm.enable();

                    // Reset the form
                    this.signUpNgForm.resetForm();

                    // Set the alert
                    this.alert = {
                        type   : 'error',
                        message: 'Something went wrong, please try again.'
                    };

                    // Show the alert
                    this.showAlert = true;
                }
            );
    }
}
