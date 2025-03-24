import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-landing-page',
    templateUrl: './landing-page.component.html',
    styleUrls: ['./landing-page.component.scss'],
})
export class LandingPageComponent implements OnInit {
    stats = [
        { value: '10K+', label: 'Meals Donated' },
        { value: '5K+', label: 'Volunteers' },
        { value: '500+', label: 'Communities Helped' },
    ];

    constructor(private router: Router) {}

    navigateToLogin() {
        this.router.navigate(['admin/dashboard']);
    }

    navigateToSignup() {
        this.router.navigate(['/sign-up']);
    }

    navigateToVolunteerSignup() {
        this.router.navigate(['/volunteer-signup']);
    }

    ngOnInit(): void {}
}
