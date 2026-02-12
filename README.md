# Cimet Juku Backend

Backend API for Cimet Juku Tutorial Center.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Set up environment variables in `.env` file.

3. Start MongoDB.

4. Run the server:
   ```
   npm start
   ```

   For development:
   ```
   npm run dev
   ```

## API Endpoints

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user
- GET /api/auth/me - Get current user (protected)

### Users
- GET /api/users - Get all users (admin)
- GET /api/users/:id - Get user by ID
- PUT /api/users/:id - Update user
- DELETE /api/users/:id - Delete user

### Subjects
- GET /api/subjects - Get all subjects
- POST /api/subjects - Create subject (admin)
- PUT /api/subjects/:id - Update subject
- DELETE /api/subjects/:id - Delete subject

### Exams
- GET /api/exams - Get all exams
- POST /api/exams - Create exam (admin)
- PUT /api/exams/:id - Update exam
- DELETE /api/exams/:id - Delete exam

### Contacts
- GET /api/contacts - Get all contacts (admin)
- POST /api/contacts - Create contact
- DELETE /api/contacts/:id - Delete contact
