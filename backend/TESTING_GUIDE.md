# Pre-Verification Authentication Flow - Testing Guide

## 🔄 New Authentication Flow Overview

The authentication system has been updated to require **email verification BEFORE** user registration. Here's the new flow:

### Authentication Flow Steps:
1. **Request Email Verification** - User provides email and name, receives OTP
2. **Verify Email** - User submits OTP to verify email address
3. **Register User** - User registers with verified email (automatically verified)
4. **Login** - User logs in with credentials

---

## 🧪 API Testing with Postman

### Base URL: `http://localhost:3001`

### 1. Test Email Configuration
**GET** `/auth/test-email`

```json
Response:
{
  "success": true,
  "message": "Email configuration is valid and ready to use."
}
```

---

### 2. Request Email Verification (Step 1)
**POST** `/auth/request-email-verification`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "email": "test@example.com",
  "name": "Test User"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Email verification OTP sent successfully. Please check your email and verify your email address.",
  "data": {
    "email": "test@example.com",
    "name": "Test User"
  }
}
```

**What happens:**
- ✅ Validates email format
- ✅ Checks if user already exists
- ✅ Generates 6-digit OTP
- ✅ Stores OTP in database (without user_id)
- ✅ Sends beautiful HTML email with OTP

---

### 3. Verify Email (Step 2)
**POST** `/auth/verify-email`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "email": "test@example.com",
  "otpCode": "123456"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Email verified successfully. You can now proceed with registration.",
  "data": {
    "email": "test@example.com",
    "is_email_verified": true
  }
}
```

**What happens:**
- ✅ Validates OTP code
- ✅ Checks OTP expiry (5 minutes)
- ✅ Marks OTP as used
- ✅ Email is now verified for registration

---

### 4. Register User (Step 3)
**POST** `/auth/signup`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Test User",
  "email": "test@example.com",
  "phone": "+1234567890",
  "password": "SecurePassword123!",
  "role": "USER"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "User registered successfully.",
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": "user-uuid",
      "name": "Test User",
      "email": "test@example.com",
      "phone": "+1234567890",
      "role": "USER",
      "is_verified": true
    }
  }
}
```

**What happens:**
- ✅ Validates required fields
- ✅ **CRITICAL:** Checks if email was verified in previous step
- ✅ Creates user with `is_verified: true`
- ✅ Cleans up verification OTP
- ✅ Returns JWT token immediately

---

### 5. Login
**POST** `/auth/login`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "identifier": "test@example.com",
  "password": "SecurePassword123!"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": "user-uuid",
      "name": "Test User",
      "email": "test@example.com",
      "phone": "+1234567890",
      "role": "USER",
      "is_verified": true
    }
  }
}
```

---

## 🔧 Additional Endpoints

### Resend Email Verification
**POST** `/auth/resend-email-verification`

**Body:**
```json
{
  "email": "test@example.com",
  "name": "Test User"
}
```

### Get User Profile (Protected)
**GET** `/auth/me`

**Headers:**
```
Authorization: Bearer your_jwt_token_here
```

---

## ❌ Error Scenarios to Test

### 1. Try to register without email verification:
```json
{
  "success": false,
  "message": "Please verify your email address before registering. Use /auth/request-email-verification first."
}
```

### 2. Invalid OTP code:
```json
{
  "success": false,
  "message": "Invalid OTP code."
}
```

### 3. Expired OTP:
```json
{
  "success": false,
  "message": "OTP has expired. Please request a new one."
}
```

### 4. User already exists:
```json
{
  "success": false,
  "message": "User with this email already exists."
}
```

---

## 🎯 Key Features

### Security Features:
- ✅ Email verification required before registration
- ✅ OTP expires in 5 minutes
- ✅ OTPs are single-use only
- ✅ Password hashing with bcrypt
- ✅ JWT tokens for authentication

### Database Features:
- ✅ User model with email/phone uniqueness
- ✅ OTP model supports pre-registration verification
- ✅ Email field added to OTP model
- ✅ Nullable user_id for pre-registration OTPs
- ✅ EMAIL_VERIFICATION purpose type

### Email Features:
- ✅ Beautiful HTML email templates
- ✅ Gmail SMTP configuration
- ✅ Professional email styling
- ✅ Error handling and logging

---

## 🔍 Testing Tips

1. **Test the complete flow in sequence** - don't skip email verification
2. **Check your email** - OTPs are sent to the provided email address
3. **Use valid email format** - validation is enforced
4. **Note the 5-minute expiry** - OTPs expire quickly for security
5. **Try error scenarios** - test validation and error handling

---

## 🚀 Server Status

✅ **Server running:** http://localhost:3001  
✅ **Database:** PostgreSQL on localhost:5433  
✅ **Email service:** Gmail SMTP configured  
✅ **Environment:** Development mode  

**All endpoints are ready for testing!**
