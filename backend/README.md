# RoadGuard Backend API

A robust authentication system built with Express.js, Sequelize ORM, and PostgreSQL.

## Features

- 🔐 **Complete Authentication System**
  - User registration with email verification
  - Secure login with JWT tokens
  - Password reset with OTP verification
  - Email-based OTP verification

- 🛡️ **Security Features**
  - Password hashing with bcrypt
  - JWT token authentication
  - Rate limiting on auth endpoints
  - Input validation and sanitization
  - CORS and Helmet security middleware

- 📧 **Email Integration**
  - OTP delivery via email
  - Welcome emails
  - Password reset notifications
  - Configurable email service

- 🗄️ **Database**
  - PostgreSQL with Sequelize ORM
  - User and OTP models
  - Automatic table creation
  - Database migrations support

## Tech Stack

- **Server**: Node.js, Express.js
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Authentication**: JWT, bcrypt
- **Validation**: Custom middleware
- **Security**: Helmet, CORS, Rate limiting

## API Endpoints

### Authentication Routes

#### POST `/api/auth/signup`
Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**
```json
{
  "message": "User created successfully. Please check your email for verification OTP.",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "isVerified": false
  }
}
```

#### POST `/api/auth/verify-email`
Verify email with OTP.

**Request Body:**
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Response:**
```json
{
  "message": "Email verified successfully",
  "user": { /* user data */ },
  "token": "jwt_token_here"
}
```

#### POST `/api/auth/login`
Login with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": { /* user data */ },
  "token": "jwt_token_here"
}
```

#### POST `/api/auth/resend-otp`
Resend verification OTP.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

#### POST `/api/auth/forgot-password`
Request password reset OTP.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

#### POST `/api/auth/reset-password`
Reset password with OTP.

**Request Body:**
```json
{
  "email": "user@example.com",
  "otp": "123456",
  "newPassword": "NewSecurePass123"
}
```

#### GET `/api/auth/profile` (Protected)
Get user profile. Requires Authorization header.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### 1. Clone and Install
```bash
cd backend
npm install
```

### 2. Database Setup
Follow the instructions in `DATABASE_SETUP.md` to:
- Install PostgreSQL
- Create the database
- Configure connection

### 3. Environment Configuration
Copy `.env.example` to `.env` and update values:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=roadguard_db
DB_USER=postgres
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
```

### 4. Start the Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The server will start on http://localhost:5000

## Testing the API

### Health Check
```bash
curl http://localhost:5000/health
curl http://localhost:5000/api/auth/health
```

### Example: Complete Registration Flow

1. **Sign up a user:**
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

2. **Check console for OTP** (in development mode)

3. **Verify email:**
```bash
curl -X POST http://localhost:5000/api/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "otp": "123456"
  }'
```

4. **Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123"
  }'
```

5. **Access protected route:**
```bash
curl http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # Database configuration
│   ├── controllers/
│   │   └── auth.controller.js   # Authentication logic
│   ├── middleware/
│   │   ├── auth.js             # JWT authentication
│   │   └── validation.js       # Input validation
│   ├── models/
│   │   ├── User.js             # User model
│   │   ├── OTP.js              # OTP model
│   │   └── index.js            # Model associations
│   ├── routes/
│   │   └── auth.js             # Authentication routes
│   ├── services/
│   │   └── email.service.js    # Email service
│   └── server.js               # Application entry point
├── .env                        # Environment variables
├── .env.example               # Environment template
├── package.json               # Dependencies
├── DATABASE_SETUP.md          # Database setup guide
└── README.md                  # This file
```

## Security Features

### Password Requirements
- Minimum 6 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

### Rate Limiting
- Auth endpoints: 5 requests per 15 minutes per IP
- OTP endpoints: 3 requests per minute per IP
- General API: 100 requests per 15 minutes per IP

### OTP Security
- Email verification OTP: 10 minutes expiry
- Password reset OTP: 15 minutes expiry
- Maximum 3 attempts per OTP
- Automatic cleanup of expired OTPs

## Email Configuration

Currently using console logging for development. For production, update `src/services/email.service.js` with your email provider:

### Gmail Configuration
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### Other Providers
- **SendGrid**: Use SendGrid API
- **AWS SES**: Use AWS SDK
- **Mailgun**: Use Mailgun API

## Development Notes

### Database Models

**User Model:**
- UUID primary key
- Email (unique, validated)
- Password (hashed with bcrypt)
- First name, last name
- Email verification status
- Role (user/admin)
- Timestamps

**OTP Model:**
- UUID primary key
- Email (foreign key reference)
- OTP code (6 digits)
- Type (email_verification, password_reset)
- Expiry timestamp
- Usage status
- Attempt counter

### Error Handling
- Comprehensive error responses
- Development vs production error details
- Proper HTTP status codes
- Input validation errors

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
