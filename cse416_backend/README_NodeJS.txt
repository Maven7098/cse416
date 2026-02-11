// We need the following to be implemented in MySQL:

/*
FACILITY, consisting of:
GET /facilities - List all facilities
POST /facilities - Add a facility
PUT /facilities/:id - Modify facility with given id
DELETE /facilities/:id - Delete facility with given id

DISCARDED OPERATIONS
GET /facilities/:id - There is no requirement to view individual facilities.
*/
/*
RESERVE, consisting of:
GET /reserves - List all reservations
POST /reserves - Add a reservation
DELETE /reserves/:id - Delete reservation with given id

DISCARDED OPERATIONS
GET /facilities/:id - There is no requirement to view individual reservations.
PUT /facilities/:id - There is no requirement to edit reservations,
nor was it possible with the front end available in Assignment 2
*/
/*
USER, consisting of:
GET /users/:id - Get individual user.
PUT /users/:id - Modify user with given id

UNCLEAR OPERATIONS
GET /users - There is no requirement to list all users,
nor was it possible with the front end available in Assignment 2.
POST /users - This feature is not possible to implement with the current front end.
DELETE /users/:id - Delete user with given id
This one is optional for Assignment 3
This one is required for Assignment 4
*/