import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { Title } from '@angular/platform-browser';

// import { Location, Appearance, GermanAddress } from '@angular-material-extensions/google-maps-autocomplete';
// // import { } from '@types/googlemaps';
// import PlaceResult = google.maps.places.PlaceResult;

@Component({
    selector     : 'auth-sign-in',
    templateUrl  : './sign-in.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class AuthSignInComponent implements OnInit
{
    @ViewChild('signInNgForm') signInNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type   : 'success',
        message: ''
    };
    signInForm: FormGroup;
    showAlert: boolean = false;



    // public appearance = Appearance;
    // public zoom: number;
    // public latitude: number;
    // public longitude: number;
    // public selectedAddress: PlaceResult;


    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
        private _formBuilder: FormBuilder,
        private _router: Router,
        // private titleService: Title
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
        this.signInForm = this._formBuilder.group({
            username     : ['hughes.brian@company.com', [Validators.required, Validators.email]],
            password  : ['admin', Validators.required],
            rememberMe: ['']
        });

        // this.titleService.setTitle('Home | @angular-material-extensions/google-maps-autocomplete');

        // this.zoom = 10;
        // this.latitude = 52.520008;
        // this.longitude = 13.404954;

        // this.setCurrentPosition();
    }


    // private setCurrentPosition() {
    //     if ('geolocation' in navigator) {
    //         navigator.geolocation.getCurrentPosition((position) => {
    //             this.latitude = position.coords.latitude;
    //             this.longitude = position.coords.longitude;
    //             this.zoom = 12;
    //         });
    //     }
    // }

    // onAutocompleteSelected(result: PlaceResult) {
    //     console.log('onAutocompleteSelected: ', result);
    // }

    // onLocationSelected(location: Location) {
    //     console.log('onLocationSelected: ', location);
    //     this.latitude = location.latitude;
    //     this.longitude = location.longitude;
    // }

    // onGermanAddressMapped($event: GermanAddress) {
    //     console.log('onGermanAddressMapped', $event);
    // }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign in
     */
    signIn(): void
    {
        // Return if the form is invalid
        if ( this.signInForm.invalid )
        {
            return;
        }

        // Disable the form
        this.signInForm.disable();

        // Hide the alert
        this.showAlert = false;

        // Sign in
        this._authService.signIn(this.signInForm.value)
            .subscribe(
                () => {

                    // Set the redirect url.
                    // The '/signed-in-redirect' is a dummy url to catch the request and redirect the user
                    // to the correct page after a successful sign in. This way, that url can be set via
                    // routing file and we don't have to touch here.
                    const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/signed-in-redirect';

                    // Navigate to the redirect url
                    
                    this._router.navigateByUrl(redirectURL);

                },
                (response) => {

                    // Re-enable the form
                    this.signInForm.enable();

                    // Reset the form
                    this.signInNgForm.resetForm();

                    // Set the alert
                    this.alert = {
                        type   : 'error',
                        message: 'Wrong email or password'
                    };

                    // Show the alert
                    this.showAlert = true;
                }
            );
    }
}
