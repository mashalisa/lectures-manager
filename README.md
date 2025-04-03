# Lectures Manager

## Project Overview

Lectures Manager is a Node.js application for managing lecture data. It allows you to register, update, and manage lecture information stored in a MongoDB database. The app is intended for use by educators and administrators to efficiently manage educational resources.


## Requirements

-Node.js installed

-MongoDB database (local or cloud)



## Installation
1. Clone the repository:
    ```bash
    git clone git@github.com:mashalisa/lectures-manager.git
    cd lectures-manager
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

## Configuration
- **.env file**:
    ```
    MONGO_URI=your-mongodb-connection-string
    PORT=3000
    ```
    Replace `your-mongodb-connection-string` with your actual MongoDB URI.

## Running the Application
To start the application, use the following command:
```bash
npm start
```

## Seeding the Database
```bash
 npm run seed
```

 ## API Endpoints

- **POST /auth/register** - Register a new user (accessible only to teacher or admin).
- **POST /auth/register-admin** -  Register a new admin user. (accessible only admin)
- **GET /auth/login** - Login to the application.

- **GET /users/** - - Retrieve all users.
- **GET /users/{id}** - Retrieve a specific user by ID.
- **PUT /users/{id}** - Update a specific user by ID (accessible only to admin).
- **DELETE /users/{id}** -  Delete a specific user by ID (accessible only to admin).


- **GET /lectures** - Retrieve all lectures.
- **POST /lectures** - Create a new lecture (accessible only for teacher or admin).
- **PUT /lectures/{id}** - Update a specific lecture by ID (accessible only for teacher or admin).
- **DELETE /lectures/{id}** - Delete a lecture by ID (accessible only for teacher or admin).


 ## Swagger  Endpoints
 You can access the Swagger documentation for API endpoints at: http://localhost:3000/api-docs/

## Usage

Once the app is running, you can interact with the API to manage lectures.


- Register a new user by making a **POST** request to `/auth/register`.
- Create a new lecture using a **POST** request to `/lectures`.
- View all lectures using a **GET** request to `/lectures`.


## Running Tests

To run tests for the application, use the following command:
```bash
npm test
```


### Summary of Changes:
1. Ensured consistent formatting for code blocks and bullet points.
2. Fixed a few typos (e.g., "coorect" to "correct").
3. Added some heading levels to improve readability.
4. Clarified access control for certain API endpoints (e.g., accessible only to teacher or admin).

This version of the `README.md` should be clearer and more professional. Feel free to adjust further based on your needs!



 





