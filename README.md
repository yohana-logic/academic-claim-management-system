# CLAIM Backend API

The backend service for **CLAIM**, an academic claim management system. It provides REST API endpoints for authentication, students, HODs, claims, courses, and departments.

## Requirements

- Node.js and npm
- A MongoDB database

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file in the project root:

   ```env
   PORT=3000
   DB_ONLINE_URL=mongodb://localhost:27017/claim
   ```

3. Start the server:

   ```bash
   npm run dev
   ```

   For a production-style start, use `npm start`.

The API is available at `http://localhost:3000` by default. The server connects to MongoDB before it begins accepting requests.

## Available Scripts

| Command       | Description                   |
| ------------- | ----------------------------- |
| `npm run dev` | Start the server with Nodemon |
| `npm start`   | Start the server with Node.js |

## API Routes

All endpoints use the `/api/v1` prefix.

| Resource                | Base path         | Supported operations                                     |
| ----------------------- | ----------------- | -------------------------------------------------------- |
| Authentication          | `/api/v1/auth`    | Login, logout, change password, reset password           |
| Students                | `/api/v1/student` | List, view, create, update, reset password, delete       |
| HODs                    | `/api/v1/hod`     | List, view, create, update, reset password, delete       |
| Claims                  | `/api/v1/claim`   | List, view, create, review, delete, filter by student    |
| Courses and departments | `/api/v1/course`  | Create, list, update, and delete courses and departments |

### Common Endpoints

```text
POST   /api/v1/auth/login
POST   /api/v1/auth/logout

GET    /api/v1/student
GET    /api/v1/student/:id
POST   /api/v1/student
PUT    /api/v1/student/:id
DELETE /api/v1/student/:id

GET    /api/v1/claim
GET    /api/v1/claim/student/:studentId
POST   /api/v1/claim
PATCH  /api/v1/claim/:id/review

GET    /api/v1/course
POST   /api/v1/course
GET    /api/v1/course/departments
POST   /api/v1/course/departments
```

Send JSON request bodies with `Content-Type: application/json`.

## Project Structure

```text
src/
├── server.js              # Application entry point
├── controllers/           # Request handlers and business logic
├── routes/                # API route definitions
└── Schema/                # Mongoose schemas
```

## Technology

- Express.js
- MongoDB with Mongoose
- JSON Web Tokens
- bcryptjs
- CORS
- dotenv
