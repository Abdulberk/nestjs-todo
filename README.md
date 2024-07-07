<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

```bash
# specific unit test (controllers)
$ npm run test:todo
$ npm run test:auth
```


## Configuration

1. Copy the example environment file and edit it with your configuration:
```bash
$ cp .env.example .env
```
2. Open the .env file and update the database connection settings and JWT secret:

```bash
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password
DB_DATABASE=your_db_name
JWT_SECRET=your_jwt_secret
JWT_EXPIRES=3600
JWT_REFRESH_SECRET=your_jwt_refresh_secret
JWT_REFRESH_EXPIRES=86400
```


## API Endpoints

 - Register a new user:

```bash 
POST /auth/register
BODY {
   "name": "tester",
   "email": "tester@gmail.com",
   "password": "test123123"
}
```

- Log in with the registered user:
```bash 
POST /auth/login
BODY {
   "email": "tester@gmail.com",
   "password": "test123123"
}
```

- Use the obtained JWT token for authorized requests by adding it to the Authorization header:
```bash
Authorization: Bearer <your_jwt_token>
```

- Create a new Todo (requires authentication)

```bash
POST /todos/create 
BODY {
  "title": "Sample Todo",
  "description": "This is a sample todo."
}
```

- Get all Todos for the authenticated user (requires authentication)
```bash
GET /todos/all
```

- Get a specific Todo by ID (requires authentication)
```bash
GET /todos/:id
```

- Update a Todo by ID (requires authentication)
```bash
PATCH /todos/:id
BODY {
  "title": "Updated Todo Title",
  "description": "Updated description.",
  "status": "COMPLETED"
}
```

- Delete a Todo by ID (requires authentication)

```bash
 DELETE /todos/:id
```


