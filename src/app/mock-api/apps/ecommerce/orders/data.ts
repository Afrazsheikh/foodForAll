export const donations = [
    {
        id: '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
        pickupAddress: '123 Green Valley, Bangalore',
        dropAddress: '456 Sunrise Road, Delhi',
        currentState: 'Pending',
        donor: {
            id: '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
            name: 'John Doe',
            phone: '1234567890',
            email: 'john.doe@example.com',
            address: '123 Green Valley, Bangalore',
            pincode: 201012
        },
        volunteer: {
            id: '2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q',
            name: 'Jane Smith',
            phone: '9876543210',
            email: 'jane.smith@example.com',
            address: '456 Sunrise Road, Delhi',
            pincode: 201012
        },
        pincode: 201012,
        modifiedOn: new Date('2023-01-01'),
        donationTime: '10:00',
        donationDate: new Date('2023-01-01')
    },
    {
        id: '2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q',
        pickupAddress: '789 Ocean Drive, Mumbai',
        dropAddress: '101 Mountain View, Chennai',
        currentState: 'In Transit',
        donor: {
            id: '3c4d5e6f-7g8h-9i0j-1k2l-3m4n5o6p7q8r',
            name: 'Bob Johnson',
            phone: '5555555555',
            email: 'bob.johnson@example.com',
            address: '789 Ocean Drive, Mumbai',
            pincode: 201012
        },
        volunteer: {
            id: '4d5e6f7g-8h9i-0j1k-2l3m-4n5o6p7q8r9s',
            name: 'Alice Brown',
            phone: '1111111111',
            email: 'alice.brown@example.com',
            address: '101 Mountain View, Chennai',
            pincode: 201012
        },
        pincode: 201012,
        modifiedOn: new Date('2023-01-02'),
        donationTime: '11:00',
        donationDate: new Date('2023-01-02')
    },
    {
        id: '3c4d5e6f-7g8h-9i0j-1k2l-3m4n5o6p7q8r',
        pickupAddress: '202 Golden Beach, Kolkata',
        dropAddress: '303 Forest Lane, Hyderabad',
        currentState: 'Delivered',
        donor: {
            id: '5e6f7g8h-9i0j-1k2l-3m4n-5o6p7q8r9s0t',
            name: 'Mike Davis',
            phone: '2222222222',
            email: 'mike.davis@example.com',
            address: '202 Golden Beach, Kolkata',
            pincode: 201012
        },
        volunteer: {
            id: '6f7g8h9i-0j1k-2l3m-4n5o-6p7q8r9s0t1u',
            name: 'Emily Taylor',
            phone: '3333333333',
            email: 'emily.taylor@example.com',
            address: '303 Forest Lane, Hyderabad',
            pincode: 201012
        },
        pincode: 201012,
        modifiedOn: new Date('2023-01-03'),
        donationTime: '12:00',
        donationDate: new Date('2023-01-03')
    },
    {
        id: '4d5e6f7g-8h9i-0j1k-2l3m-4n5o6p7q8r9s',
        pickupAddress: '404 Silver Street, Ahmedabad',
        dropAddress: '505 Crystal Road, Pune',
        currentState: 'Pending',
        donor: {
            id: '7g8h9i0j-1k2l-3m4n-5o6p-7q8r9s0t1u2v',
            name: 'David Lee',
            phone: '4444444444',
            email: 'david.lee@example.com',
            address: '404 Silver Street, Ahmedabad',
            pincode: 201012
        },
        volunteer: {
            id: '8h9i0j1k-2l3m-4n5o-6p7q-8r9s0t1u2v3w',
            name: 'Sarah Kim',
            phone: '6666666666',
            email: 'sarah.kim@example.com',
            address: '505 Crystal Road, Pune',
            pincode: 201012
        },
        pincode: 201012,
        modifiedOn: new Date('2023-01-04'),
        donationTime: '13:00',
        donationDate: new Date('2023-01-04')
    },
    {
        id: '5e6f7g8h-9i0j-1k2l-3m4n-5o6p7q8r9s0t',
        pickupAddress: '606 Emerald Lane, Jaipur',
        dropAddress: '707 Royal Avenue, Patna',
        currentState: 'In Transit',
        donor: {
            id: '9i0j1k2l-3m4n-5o6p-7q8r-9s0t1u2v3w4x',
            name: 'Kevin White',
            phone: '7777777777',
            email: 'kevin.white@example.com',
            address: '606 Emerald Lane, Jaipur',
            pincode: 201012
        },
        volunteer: {
            id: '0j1k2l3m-4n5o-6p7q-8r9s-0t1u2v3w4x5y',
            name: 'Lisa Nguyen',
            phone: '8888888888',
            email: 'lisa.nguyen@example.com',
            address: '707 Royal Avenue, Patna',
            pincode: 201012
        },
        pincode: 201012,
        modifiedOn: new Date('2023-01-05'),
        donationTime: '14:00',
        donationDate: new Date('2023-01-05')
    },
    {
        id: '6f7g8h9i-0j1k-2l3m-4n5o-6p7q8r9s0t1u',
        pickupAddress: '808 Blue Street, Gurgaon',
        dropAddress: '909 Sunset Road, Ludhiana',
        currentState: 'Delivered',
        donor: {
            id: '1k2l3m4n-5o6p-7q8r-9s0t-1u2v3w4x5y6z',
            name: 'Peter Hall',
            phone: '9999999999',
            email: 'peter.hall@example.com',
            address: '808 Blue Street, Gurgaon',
            pincode: 201012
        },
        volunteer: {
            id: '2l3m4n5o-6p7q-8r9s-0t1u-2v3w4x5y6z7a',
            name: 'Olivia Martin',
            phone: '1234567890',
            email: 'olivia.martin@example.com',
            address: '909 Sunset Road, Ludhiana',
            pincode: 201012
        },
        pincode: 201012,
        modifiedOn: new Date('2023-01-06'),
        donationTime: '15:00',
        donationDate: new Date('2023-01-06')
    },
    {
        id: '7g8h9i0j-1k2l-3m4n-5o6p-7q8r9s0t1u2v',
        pickupAddress: '1010 Golden Lane, Meerut',
        dropAddress: '1111 Silver Road, New Delhi',
        currentState: 'Pending',
        donor: {
            id: '3m4n5o6p-7q8r-9s0t-1u2v-3w4x5y6z7a8b',
            name: 'William Thompson',
            phone: '9876543210',
            email: 'william.thompson@example.com',
            address: '1010 Golden Lane, Meerut',
            pincode: 201012
        },
        volunteer: {
            id: '4n5o6p7q-8r9s-0t1u-2v3w-4x5y6z7a8b9c',
            name: 'Ava Garcia',
            phone: '5555555555',
            email: 'ava.garcia@example.com',
            address: '1111 Silver Road, New Delhi',
            pincode: 201012
        },
        pincode: 201012,
        modifiedOn: new Date('2023-01-07'),
        donationTime: '16:00',
        donationDate: new Date('2023-01-07')
    },
    {
        id: '8h9i0j1k-2l3m-4n5o-6p7q-8r9s0t1u2v3w',
        pickupAddress: '1212 Pine Street, Bangalore',
        dropAddress: '1313 Maple Road, Mumbai',
        currentState: 'In Transit',
        donor: {
            id: '5o6p7q8r-9s0t-1u2v-3w4x-5y6z7a8b9c0d',
            name: 'Ethan Patel',
            phone: '1111111111',
            email: 'ethan.patel@example.com',
            address: '1212 Pine Street, Bangalore',
            pincode: 201012
        },
        volunteer: {
            id: '6p7q8r9s-0t1u-2v3w-4x5y-6z7a8b9c0d1e',
            name: 'Liam Chen',
            phone: '2222222222',
            email: 'liam.chen@example.com',
            address: '1313 Maple Road, Mumbai',
            pincode: 201012
        },
        pincode: 201012,
        modifiedOn: new Date('2023-01-08'),
        donationTime: '17:00',
        donationDate: new Date('2023-01-08')
    }
]