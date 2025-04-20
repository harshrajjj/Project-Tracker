# Project & Task Management System

A MERN stack application for managing projects and tasks with role-based access control.

## Features

- **User Authentication & Authorization (JWT)**
  - Admin can create projects and assign tasks to team members
  - Team members can view projects and update task status

- **Project Management**
  - Admin can create and manage projects
  - All users can view projects

- **Task Management**
  - Tasks with title, description, assigned user, status, and priority
  - Filter tasks by user, priority, status, etc.
  - Sort tasks by various criteria

- **Comments System**
  - All team members can comment on tasks
  - Comment history with timestamps

- **Security**
  - JWT-based authentication with HTTP-only cookies
  - Role-based authorization
  - API rate limiting

## Tech Stack

### Frontend
- React with Context API for state management
- React Router for navigation
- Axios for API requests
- TailwindCSS for UI design

### Backend
- Express.js for API handling
- JWT for authentication
- Express-validator for input validation
- Rate-limiting middleware

### Database
- MongoDB with Mongoose ORM

## Getting Started

### Prerequisites
- Node.js
- MongoDB

### Installation

1. Clone the repository
```
git clone <repository-url>
```

2. Install server dependencies
```
cd Server
npm install
```

3. Install client dependencies
```
cd ../Client
npm install
```

4. Create a .env file in the Server directory with the following variables:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/project-management
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### Running the Application

1. Start the server
```
cd Server
npm run dev
```

2. Start the client
```
cd Client
npm run dev
```

3. Access the application at http://localhost:5173

### Admin Account Setup

The application requires an admin user to create projects and assign tasks. You can create an admin account using the provided seeder script:

```
cd Server
npm run seed:admin
```

This will create an admin user with the following credentials:
- Email: admin@example.com
- Password: password123

You can also create a regular team member account using:

```
npm run seed:team
```

Or register a new account through the application's registration page (all new registrations are assigned the 'team-member' role by default).

## API Documentation

### Authentication Routes
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Project Routes
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create new project (Admin only)
- `PUT /api/projects/:id` - Update project (Admin only)
- `DELETE /api/projects/:id` - Delete project (Admin only)
- `GET /api/projects/:projectId/tasks` - Get tasks for a project

### Task Routes
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get single task
- `POST /api/tasks` - Create new task (Admin only)
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task (Admin only)
- `GET /api/tasks/:taskId/comments` - Get comments for a task

### Comment Routes
- `POST /api/comments` - Add comment to task
- `PUT /api/comments/:id` - Update comment
- `DELETE /api/comments/:id` - Delete comment
