export interface Volunteers
{
    id: string;
    name: string;
    contact: string;
    address: string;
    pincode: string;
    email: string;
    volunteeringDays: number[];
    volunteeringStartTime: string;
    volunteeringEndTime: string;
    active: boolean;
}

export interface VolunteersPagination
{
    length: number;
    size: number;
    page: number;
    lastPage: number;
    startIndex: number;
    endIndex: number;
}