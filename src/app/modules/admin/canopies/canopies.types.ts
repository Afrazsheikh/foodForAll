export interface Canopies
{
    id: string;
    name: string;
    pincode: string;
    address: string;
    active: boolean;
}

export interface CanopiesPagination
{
    length: number;
    size: number;
    page: number;
    lastPage: number;
    startIndex: number;
    endIndex: number;
}