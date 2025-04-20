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

- **Deployment Optimizations**
  - Handling of Render free tier cold starts
  - Dynamic CORS configuration for Vercel preview deployments
  - Extended timeout settings for API requests

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

## Deployment

### Deployment Options

#### Backend Deployment on Render

1. Create a new Web Service on Render
   - Connect your GitHub repository
   - Select the repository and branch
   - Set the Root Directory to `Server`
   - Set the Build Command to `npm install`
   - Set the Start Command to `node server.js`

2. Add the following environment variables in the Render dashboard:
   ```
   PORT=10000 (or any port Render assigns)
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=30d
   CLIENT_URL=https://your-frontend-url.vercel.app
   NODE_ENV=production
   ```

3. Deploy the service

#### Frontend Deployment on Vercel

1. Create a `.env.production` file in the Client directory with:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   ```

2. Update the `vercel.json` file in the Client directory with your actual backend URL:
   ```json
   {
     "rewrites": [
       { "source": "/api/:path*", "destination": "https://your-backend-url.onrender.com/api/:path*" }
     ],
     "env": {
       "VITE_API_URL": "https://your-backend-url.onrender.com/api"
     },
     "buildCommand": "npm run build",
     "outputDirectory": "dist"
   }
   ```

3. Deploy to Vercel:
   - Connect your GitHub repository to Vercel
   - Set the framework preset to Vite
   - Set the root directory to `Client`
   - Set the build command to `npm run build:vercel`
   - Set the output directory to `dist`

4. Add the following environment variables in the Vercel dashboard:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   ```

   Note: The frontend is configured to handle Render's cold starts with extended timeouts (60 seconds). This ensures that login and other API requests will wait long enough for the server to wake up from sleep mode.

5. Deploy the site

### Handling Render Free Tier Cold Starts

When using Render's free tier for backend hosting, the server will go to sleep after 15 minutes of inactivity. This can cause delays when users try to log in or use the application after a period of inactivity.

#### How Cold Starts Are Handled in This Application

1. **Extended Timeout Settings**:
   - The application is configured with a 60-second timeout for API requests (instead of the default 15 seconds)
   - This gives the Render server enough time to wake up and respond to requests

2. **Server Wake-up Mechanism**:
   - The frontend automatically pings the backend when the application loads
   - This helps wake up the server before the user tries to log in
   - Users are shown appropriate loading indicators and notifications

3. **User Feedback**:
   - Loading indicators inform users that the server might take up to a minute to start
   - Toast notifications provide context about the potential delay

#### Upgrading to Paid Tier

For production use, consider upgrading to Render's paid tier to eliminate cold starts. The paid tier keeps your server running continuously, providing a much better user experience.

### Troubleshooting Deployment Issues

#### 401 Unauthorized Errors
- Check that the JWT_SECRET is correctly set in your backend environment variables
- Ensure the frontend is sending the token correctly in the Authorization header
- Verify CORS settings allow requests from your frontend domain

#### 404 Not Found Errors
- Confirm API endpoints are correctly formatted in the frontend code
- Check that the VITE_API_URL environment variable is set correctly
- Verify the backend server is running and accessible

#### CORS Issues
- Ensure your backend CORS configuration includes all necessary frontend domains
- For Vercel deployments, remember that preview deployments get unique URLs
- The application is configured to allow all domains containing 'project-tracker'

#### Connection Issues
- Ensure your MongoDB connection string is correct and the database is accessible
- Check that your backend service is running without errors
- Verify network rules allow connections between your frontend and backend
- For cold start issues, wait up to a minute for the server to wake up
