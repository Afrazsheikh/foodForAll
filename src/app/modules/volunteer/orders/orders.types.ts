import { Time } from "@angular/common";

export interface Donations
{
    id: string;
    pickupAddress: string;
    dropAddress: string;
    currentState: string;
    donorName: string;
    pincode: string;
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