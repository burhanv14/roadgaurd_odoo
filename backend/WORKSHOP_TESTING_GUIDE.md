# Workshop APIs Testing Guide

## 🏪 Workshop Listing Feature APIs

The Workshop APIs allow users to manage and search for automotive workshops. The system supports location-based searches, filtering, pagination, and role-based access control.

### Base URL: `http://localhost:3001`

---

## 📋 **API Endpoints Overview**

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| GET | `/workshops` | Get all workshops with filters | Public |
| GET | `/workshops/:id` | Get workshop details by ID | Public |
| POST | `/workshops` | Create new workshop | Protected (MECHANIC_OWNER) |
| PUT | `/workshops/:id` | Update workshop | Protected (Owner/Admin) |
| DELETE | `/workshops/:id` | Delete workshop | Protected (Owner/Admin) |

---

## 🧪 **API Testing Sequence**

### **Prerequisites**
1. Server running on `http://localhost:3001`
2. At least one user with `MECHANIC_OWNER` role registered
3. JWT token for authenticated requests

---

## **1. Create a MECHANIC_OWNER User (If not exists)**

First, let's register a mechanic owner who can create workshops:

**POST** `/auth/request-email-verification`
```json
{
  "email": "mechanic@example.com",
  "name": "John's Auto Repair"
}
```

**POST** `/auth/verify-email`
```json
{
  "email": "mechanic@example.com",
  "otpCode": "123456"
}
```

**POST** `/auth/signup`
```json
{
  "name": "John's Auto Repair",
  "email": "mechanic@example.com",
  "phone": "+1234567890",
  "password": "SecurePassword123!",
  "role": "MECHANIC_OWNER"
}
```

**Save the JWT token from the response for protected routes!**

---

## **2. Create Workshop (Protected Route)**

**Method:** `POST`  
**URL:** `http://localhost:3001/workshops`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer your_jwt_token_here
```

**Body:**
```json
{
  "name": "John's Auto Repair Shop",
  "address": "123 Main Street, Downtown, City",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "image_url": "https://example.com/workshop.jpg",
  "status": "OPEN"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Workshop created successfully.",
  "data": {
    "workshop": {
      "id": "uuid-here",
      "name": "John's Auto Repair Shop",
      "address": "123 Main Street, Downtown, City",
      "latitude": 40.7128,
      "longitude": -74.0060,
      "image_url": "https://example.com/workshop.jpg",
      "status": "OPEN",
      "rating": 0,
      "ownerId": "owner-uuid",
      "createdAt": "2025-08-30T...",
      "updatedAt": "2025-08-30T...",
      "owner": {
        "id": "owner-uuid",
        "name": "John's Auto Repair",
        "email": "mechanic@example.com",
        "phone": "+1234567890"
      }
    }
  }
}
```

---

## **3. Get All Workshops (Public Route)**

**Method:** `GET`  
**URL:** `http://localhost:3001/workshops`

**Basic Request:**
```
GET http://localhost:3001/workshops
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Workshops retrieved successfully.",
  "data": {
    "workshops": [
      {
        "id": "uuid-here",
        "name": "John's Auto Repair Shop",
        "address": "123 Main Street, Downtown, City",
        "latitude": 40.7128,
        "longitude": -74.0060,
        "image_url": "https://example.com/workshop.jpg",
        "status": "OPEN",
        "rating": 0,
        "ownerId": "owner-uuid",
        "createdAt": "2025-08-30T...",
        "updatedAt": "2025-08-30T...",
        "owner": {
          "id": "owner-uuid",
          "name": "John's Auto Repair",
          "email": "mechanic@example.com",
          "phone": "+1234567890"
        }
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalCount": 1,
      "limit": 20,
      "hasNextPage": false,
      "hasPreviousPage": false
    },
    "filters": {
      "status": null,
      "search": null,
      "radius": null,
      "location": null
    }
  }
}
```

---

## **4. Advanced Workshop Queries**

### **A. Filter by Status**
```
GET http://localhost:3001/workshops?status=OPEN
```

### **B. Search by Name/Address**
```
GET http://localhost:3001/workshops?search=auto
```

### **C. Location-based Search (Distance)**
```
GET http://localhost:3001/workshops?latitude=40.7128&longitude=-74.0060&radius=10&sort=nearest
```

### **D. Sort by Rating**
```
GET http://localhost:3001/workshops?sort=mostRated
```

### **E. Pagination**
```
GET http://localhost:3001/workshops?page=1&limit=10
```

### **F. Combined Filters**
```
GET http://localhost:3001/workshops?status=OPEN&latitude=40.7128&longitude=-74.0060&radius=25&search=repair&sort=nearest&page=1&limit=5
```

---

## **5. Get Workshop by ID**

**Method:** `GET`  
**URL:** `http://localhost:3001/workshops/:id`

Replace `:id` with actual workshop ID from previous responses.

**Example:**
```
GET http://localhost:3001/workshops/uuid-here
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Workshop retrieved successfully.",
  "data": {
    "workshop": {
      "id": "uuid-here",
      "name": "John's Auto Repair Shop",
      "address": "123 Main Street, Downtown, City",
      "latitude": 40.7128,
      "longitude": -74.0060,
      "image_url": "https://example.com/workshop.jpg",
      "status": "OPEN",
      "rating": 0,
      "ownerId": "owner-uuid",
      "createdAt": "2025-08-30T...",
      "updatedAt": "2025-08-30T...",
      "owner": {
        "id": "owner-uuid",
        "name": "John's Auto Repair",
        "email": "mechanic@example.com",
        "phone": "+1234567890",
        "role": "MECHANIC_OWNER"
      }
    }
  }
}
```

---

## **6. Update Workshop (Protected Route)**

**Method:** `PUT`  
**URL:** `http://localhost:3001/workshops/:id`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer your_jwt_token_here
```

**Body (Update fields as needed):**
```json
{
  "name": "John's Premium Auto Repair",
  "status": "CLOSED",
  "rating": 4.5
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Workshop updated successfully.",
  "data": {
    "workshop": {
      // Updated workshop data with owner info
    }
  }
}
```

---

## **7. Delete Workshop (Protected Route)**

**Method:** `DELETE`  
**URL:** `http://localhost:3001/workshops/:id`

**Headers:**
```
Authorization: Bearer your_jwt_token_here
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Workshop deleted successfully."
}
```

---

## **🚨 Error Scenarios to Test**

### **1. Create Workshop without Authentication**
```
POST /workshops (without Authorization header)
Expected: 401 Unauthorized
```

### **2. Create Workshop with USER role**
```
POST /workshops (with USER role token)
Expected: 403 Forbidden - "Only mechanic owners can create workshops."
```

### **3. Missing Required Fields**
```json
{
  "name": "Test Workshop"
  // Missing address, latitude, longitude
}
Expected: 400 Bad Request - "Name, address, latitude, and longitude are required."
```

### **4. Invalid Coordinates**
```json
{
  "name": "Test Workshop",
  "address": "Test Address",
  "latitude": 91,  // Invalid latitude
  "longitude": -74.0060
}
Expected: 400 Bad Request - Validation error
```

### **5. Workshop Not Found**
```
GET /workshops/invalid-uuid
Expected: 404 Not Found - "Workshop not found."
```

### **6. Update Workshop (Not Owner)**
```
PUT /workshops/some-id (with different user's token)
Expected: 403 Forbidden - "You can only update your own workshops."
```

---

## **🎯 Key Features Demonstrated**

### **✅ Security Features:**
- JWT authentication for protected routes
- Role-based access control (MECHANIC_OWNER only for creation)
- Owner/Admin authorization for updates/deletions

### **✅ Search & Filter Features:**
- Status filtering (OPEN/CLOSED)
- Text search (name/address)
- Geospatial distance search with Haversine formula
- Multiple sorting options (nearest, mostRated, newest, oldest)
- Pagination support

### **✅ Database Features:**
- Proper foreign key relationships
- Data validation (coordinates, URLs, ratings)
- Optimized indexes for performance
- Enum types for status field

### **✅ API Features:**
- RESTful design
- Consistent JSON responses
- Comprehensive error handling
- Detailed pagination information

---

## **📊 Sample Test Data**

Create multiple workshops for better testing:

```json
[
  {
    "name": "Quick Fix Auto",
    "address": "456 Oak Avenue, Suburb",
    "latitude": 40.7589,
    "longitude": -73.9851,
    "status": "OPEN"
  },
  {
    "name": "Downtown Motors",
    "address": "789 Broadway, City Center",
    "latitude": 40.7505,
    "longitude": -73.9934,
    "status": "CLOSED"
  },
  {
    "name": "Highway Auto Care",
    "address": "321 Route 66, Highway",
    "latitude": 40.6782,
    "longitude": -73.9442,
    "status": "OPEN"
  }
]
```

**🚀 All Workshop APIs are ready for testing in Postman!**
