
export interface Donors
{
    id: string;
    name: string;
    address: string;
    pincode: Number;
    contact: Object;
    email: Object;
}

export interface DonorsPagination
{
    length: number;
    size: number;
    page: number;
    lastPage: number;
    startIndex: number;
    endIndex: number;
}