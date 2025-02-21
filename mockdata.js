
//Venues:
[
    {
        "venue_name": "Beach Resort",
        "venue_description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec aliquam nibh, at lobortis risus. Aliquam accumsan felis in orci consequat imperdiet. Proin ut sapien orci. Praesent aliquam pulvinar purus, in maximus felis iaculis vitae. Nam et fringilla purus. Proin ornare ipsum interdum maximus imperdiet. Donec vel quam at ex.",
        "host_id": "user_2", 
        "location": "Miami, FL",
        "price": 2500,
        "availability_start_date": new Date("2025, 3, 1"),
        "availability_end_date": new Date("2025, 10, 15"),
        "capacity": 300,
        "image": ["/images/resort.jpeg", "/images/resort_1.jpeg"],
        "rating": 4.8
    },
    {
        "venue_name": "Mountain Lodge",
        "venue_description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec aliquam nibh, at lobortis risus. Aliquam accumsan felis in orci consequat imperdiet. Proin ut sapien orci. Praesent aliquam pulvinar purus, in maximus felis iaculis vitae. Nam et fringilla purus. Proin ornare ipsum interdum maximus imperdiet. Donec vel quam at ex.",
        "host_id": "user_3", 
        "location": "Asheville, NC",
        "price": 1800,
        "availability_start_date": new Date("2025, 4, 5"),
        "availability_end_date": new Date("2025, 11, 20"),
        "capacity": 150,
        "image": ["/images/Mountain_Lodge.jpeg", "/images/Mountain_Lodge_1.jpeg"],
        "rating": 4.6
    },
    {
        "venue_name": "City Conference Center",
        "venue_description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec aliquam nibh, at lobortis risus. Aliquam accumsan felis in orci consequat imperdiet. Proin ut sapien orci. Praesent aliquam pulvinar purus, in maximus felis iaculis vitae. Nam et fringilla purus. Proin ornare ipsum interdum maximus imperdiet. Donec vel quam at ex.",
        "host_id": "user_4", 
        "location": "New York, NY",
        "price": 4500,
        "availability_start_date": new Date("2025, 2, 15"),
        "availability_end_date": new Date("2025, 8, 30"),
        "capacity": 500,
        "image": ["/images/Conference_Center.jpeg", "/images/Conference_Center_1.jpeg"],
        "rating": 4.7
    },
    {
        "venue_name": "Urban Loft",
        "venue_description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec aliquam nibh, at lobortis risus. Aliquam accumsan felis in orci consequat imperdiet. Proin ut sapien orci. Praesent aliquam pulvinar purus, in maximus felis iaculis vitae. Nam et fringilla purus. Proin ornare ipsum interdum maximus imperdiet. Donec vel quam at ex.",
        "host_id": "user_5", 
        "location": "San Francisco, CA",
        "price": 2200,
        "availability_start_date": new Date("2025, 6, 1"),
        "availability_end_date": new Date("2025, 12, 31"),
        "capacity": 10,
        "image": ["/images/Urban_Loft.jpeg","/images/Urban_Loft_1.jpeg"],
        "rating": 4.5
    },
    {
        "venue_name": "Luxury Vineyard",
        "venue_description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec aliquam nibh, at lobortis risus. Aliquam accumsan felis in orci consequat imperdiet. Proin ut sapien orci. Praesent aliquam pulvinar purus, in maximus felis iaculis vitae. Nam et fringilla purus. Proin ornare ipsum interdum maximus imperdiet. Donec vel quam at ex.",
        "host_id": "user_6", 
        "location": "Napa Valley, CA",
        "price": 3500,
        "availability_start_date": new Date("2025, 5, 10"),
        "availability_end_date": new Date("2025, 9, 30"),
        "capacity": 200,
        "image": ["/images/Vineyard.jpeg", "/images/Vineyard_1.jpeg"],
        "rating": 4.9
    }
]


//Bookings:
//Not including price/venue name as I think its redundant
[
    {
        "booking_start_date": new Date("2025, 1, 10"),
        "booking_end_date": new Date("2025, 1, 12"),
        "attendees": 100
    },
    {
        "booking_start_date": new Date("2025, 2, 5"),
        "booking_end_date": new Date("2025, 2, 8"),
        "attendees": 150
    },
    {
        "booking_start_date": new Date("2025, 3, 20"),
        "booking_end_date": new Date("2025, 3, 22"),
        "attendees": 200
    },
    {
        "booking_start_date": new Date("2025, 4, 15"),
        "booking_end_date": new Date("2025, 4, 17"),
        "attendees": 250
    },
    {
        "booking_start_date": new Date("2025, 5, 25"),
        "booking_end_date": new Date("2025, 5, 27"),
        "attendees": 300
    }
]

//User:
[
    {
        "first_name": "Lorem",
        "last_name": "Ipsum",
        "email": "test@example.com",
        "password": "1234",
        "image": "/images/profile_1.jpeg"
    },
    {
        "first_name": "Dolor",
        "last_name": "Sit",
        "email": "test2@example.com",
        "password": "abcd",
        "image": "/images/profile_2.jpeg"
    },
    {
        "first_name": "Amet",
        "last_name": "Consectetur",
        "email": "test3@example.com",
        "password": "efgh",
        "image": "/images/profile_3.jpeg"
    },
    {
        "first_name": "Adipiscing",
        "last_name": "Elit",
        "email": "test4@example.com",
        "password": "ijkl",
        "image": "/images/profile_4.jpeg"
    },
    {
        "first_name": "Vivamus",
        "last_name": "Nibh",
        "email": "test5@example.com",
        "password": "mnop",
        "image": "/images/profile_5.jpeg"
    }
]

//Messages:
[
    {
        "message": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        "timestamp": new Date("October 13, 2024 11:13:00")
    },
    {
        "message": "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        "timestamp": new Date("November 5, 2024 14:23:00")
    },
    {
        "message": "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        "timestamp": new Date("December 1, 2024 09:05:00")
    },
    {
        "message": "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
        "timestamp": new Date("January 15, 2025 16:40:00")
    },
    {
        "message": "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        "timestamp": new Date("February 3, 2025 10:17:00")
    }
]

//Notifications
[
    {
        "notification": "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
    },
    {
        "notification": "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    },
    {
        "notification": "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
    },
    {
        "notification": "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
    },
    {
        "notification": "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    }
]
