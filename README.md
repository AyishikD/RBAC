# RBAC Todo App (Role-Based Access Control)

This is a **Role-Based Access Control (RBAC) Todo App** built using **Node.js**, **Express.js**, and an in-memory database. The app includes authentication, authorization, and role-based access control, allowing different levels of permissions for **Admins** and **Users**. Admins can manage users and tasks, while users can manage their own tasks and view tasks shared with them based on permissions.

---
## API TESTING RESULTS
You can view the complete Postman documentation for testing the API at the link below:

[Postman API Documentation](https://www.postman.com/mission-geologist-4118891/api-tests/overview)

## Features

### Authentication
- Users can register and log in.
- Admins must use a password starting with `admin` to register.

### Role-Based Access Control (RBAC)
- **Admin**:
  - Delete users.
  - Promote a user to Admin or demote back to User.
  - Create public tasks, delete and view them.
  - View all other users.
- **User**:
  - Create tasks.
  - View their tasks
  - Delete their tasks.

### Logout
- Users can securely log out, and their tokens are invalidated.

---

## Installation and Setup

### Prerequisites
- **Node.js** (v14 or later)
- **Postman** (for API testing)

### Steps to Run the Application

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/rbac-todo-app.git
   cd rbac-todo-app
   cd backend
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Create Environment Variables**:
   Create a `.env` file in the project root:
   ```plaintext
   JWT_SECRET=your_secret_key
   ```

4. **Start the Server**:
   ```bash
   node app.js
   ```

5. **Test the APIs**:
   Use Postman to interact with the application.

---

## API Endpoints

### Authentication Routes
| Method | Endpoint             | Description                          | Permissions  |
|--------|-----------------------|--------------------------------------|--------------|
| POST   | `/api/auth/register` | Register as a new user (Admin/User)  | Public       |
| POST   | `/api/auth/login`    | Log in and receive a JWT token       | Public       |
| POST   | `/api/auth/logout`   | Log out and invalidate the token     | Authenticated|

### User Management Routes (Admin Only)
| Method | Endpoint             | Description                          | Permissions |
|--------|-----------------------|--------------------------------------|-------------|
| GET    | `/api/users`         | View all registered users            | Admin       |
| POST   | `/api/users/promote/:id` | Promote a user to Admin              | Admin       |
| POST   | `/api/users/demote/:id`  | Demote an Admin to User              | Admin       |
| DELETE | `/api/users/delete:id`     | Delete a user                        | Admin       |
| DELETE | `/api/users/delete`     | Delete own account                        | Authenticated       |
| POST | `/api/users/LOGOUT`     | Logout from website                       | Authenticated       |


### Task Management Routes
| Method | Endpoint                    | Description                                      | Permissions  |
|--------|-----------------------------|--------------------------------------------------|--------------|
| POST   | `/api/tasks/create`         | Create a task (Admin/User)                       | Authenticated|
| GET    | `/api/tasks`                | View tasks                                       | Authenticated|
| DELETE | `/api/tasks/delete/:id`     | Delete a task                                    | Authenticated|

---

## Usage Workflow

1. **Register Users**:
   - Admin: Password must start with `admin` (e.g., `admin123`).
   - User: Use any password.

2. **Log In**:
   - Get a JWT token after login.
   - Use the token in the `Authorization` header (`Bearer <token>`) for all protected routes.

3. **Create Tasks**:
   - Admin can create public or shared tasks.
   - Users can create private tasks.

4. **View Tasks**:
   - Users see their own tasks.
   - Admins see all tasks.

5. **Manage Users** (Admin Only):
   - Promote or demote users.
   - Delete any user.

6. **Log Out**:
   - Use the `/api/auth/logout` endpoint to invalidate the token.

---

## Testing with Postman

### Authorization
- Use the `Authorization` tab in Postman.
- Select "Bearer Token" and paste the JWT token received after login.


## Future Improvements
- Add persistent storage using a database (e.g., MongoDB, MySQL).
- Implement email verification for registration.
- Enhance UI for better user experience.

---

## License
This project is licensed under the MIT License. Feel free to modify and use it for personal or commercial purposes.

---

Let me know if you need help deploying this app or improving the readme! 😊
