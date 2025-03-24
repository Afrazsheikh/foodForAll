/* tslint:disable:max-line-length */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id   : 'dashboard',
        title: 'Dashboard',
        type : 'basic',
        icon : 'dashboard_customize',
        link : '/admin/dashboard'
    },
    {
        id: 'canopies',
        title: 'Canopies',
        type: 'basic',
        icon: 'countertops',
        link: '/admin/canopies'
    },
    {
        id: 'donors',
        title: 'Donors',
        type: 'basic',
        icon: 'house',
        link: '/admin/donors'
    },
    {
        id: 'volunteers',
        title: 'Volunteers',
        type: 'basic',
        icon: 'delivery_dining',
        link: '/admin/volunteers'
    },
    {
        id: 'orders',
        title: 'Orders',
        type: 'basic',
        icon: 'heroicons_outline:book-open',
        link: '/admin/orders'
    }
];
// export const compactNavigation: FuseNavigationItem[] = [
//     {
//         id   : 'example',
//         title: 'Example',
//         type : 'basic',
//         icon : 'heroicons_outline:chart-pie',
//         link : '/example'
//     }
// ];
// export const futuristicNavigation: FuseNavigationItem[] = [
//     {
//         id   : 'example',
//         title: 'Example',
//         type : 'basic',
//         icon : 'heroicons_outline:chart-pie',
//         link : '/example'
//     }
// ];
// export const horizontalNavigation: FuseNavigationItem[] = [
//     {
//         id   : 'example',
//         title: 'Example',
//         type : 'basic',
//         icon : 'heroicons_outline:chart-pie',
//         link : '/example'
//     }
// ];
