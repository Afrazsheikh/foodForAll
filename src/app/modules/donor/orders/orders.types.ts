import { Time } from '@angular/common';

export interface Donations {
    id: string;
    pickupAddress: string;
    dropAddress: string;
    currentState: string;
    volunteerName: Object;
    pincode: string;
    donationTime: string;
    donationDate: Date;
    selectedItems: any;
}

export interface DonationsPagination {
    length: number;
    size: number;
    page: number;
    lastPage: number;
    startIndex: number;
    endIndex: number;
}
