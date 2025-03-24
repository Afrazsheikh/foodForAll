import { Time } from "@angular/common";

export interface Donations
{
    id: string;
    pickupAddress: string;
    dropAddress: string;
    currentState: string;
    donor: Object;
    volunteer: Object;
    pincode: string;
    modifiedOn: Date;
    donationTime: string;
    donationDate: Date;
}

export interface DonationsPagination
{
    length: number;
    size: number;
    page: number;
    lastPage: number;
    startIndex: number;
    endIndex: number;
}