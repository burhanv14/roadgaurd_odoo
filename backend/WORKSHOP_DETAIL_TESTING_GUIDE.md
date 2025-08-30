# Workshop Detail Page APIs - Testing Guide

## 🏪 **Workshop Detail Page Feature**

Complete workshop management system with detailed workshop information, services, and customer reviews. Supports full CRUD operations with proper authentication and role-based access control.

### **Base URL:** `http://localhost:3001`

---

## 📊 **Database Schema Overview**

### **Updated Tables:**
1. **Users** - User management with roles
2. **Workshops** - Workshop information (now includes `description`)
3. **Services** - Workshop services/offerings
4. **Reviews** - Customer reviews and ratings

### **Key Relationships:**
- User (MECHANIC_OWNER) → Workshop (1:Many)
- Workshop → Services (1:Many)
- Workshop → Reviews (1:Many)
- User (Customer) → Reviews (1:Many)

---

## 🧪 **API Endpoints Testing Sequence**

### **New Endpoints Added:**
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/workshops/:id/details` | Get complete workshop details | No |
| GET | `/workshops/:id/services` | Get workshop services | No |
| GET | `/workshops/:id/reviews` | Get workshop reviews | No |
| POST | `/workshops/:id/services` | Add service to workshop | Yes (Owner/Admin) |
| POST | `/workshops/:id/reviews` | Add review to workshop | Yes (Customer) |

---

## **Step-by-Step Testing**

### **Prerequisites: Create Test Data**

#### **1. Create a MECHANIC_OWNER**
```json
POST /auth/signup
{
  "name": "Auto Care Center",
  "email": "autocare@example.com",
  "phone": "+1234567890",
  "password": "SecurePass123!",
  "role": "MECHANIC_OWNER"
}
```
**Save the JWT token for workshop operations!**

#### **2. Create a CUSTOMER**
```json
POST /auth/signup
{
  "name": "John Customer",
  "email": "customer@example.com",
  "phone": "+1234567891",
  "password": "CustomerPass123!",
  "role": "USER"
}
```
**Save the JWT token for review operations!**

#### **3. Create a Workshop (with description)**
```json
POST /workshops
Headers: Authorization: Bearer <mechanic_owner_token>
{
  "name": "Elite Auto Repair",
  "description": "Professional automotive repair service with over 20 years of experience. We specialize in engine diagnostics, brake repair, transmission service, and routine maintenance. Our certified technicians use state-of-the-art equipment to ensure your vehicle runs smoothly and safely.",
  "address": "123 Main Street, Downtown, City, State 12345",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "image_url": "https://example.com/workshop.jpg",
  "status": "OPEN"
}
```
**Save the workshop ID from the response!**

---

## **Testing Workshop Detail APIs**

### **1. Get Complete Workshop Details**

**Method:** `GET`  
**URL:** `http://localhost:3001/workshops/:id/details`

**Example:**
```
GET http://localhost:3001/workshops/your-workshop-id/details
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Workshop details retrieved successfully.",
  "data": {
    "workshop": {
      "id": "workshop-uuid",
      "name": "Elite Auto Repair",
      "description": "Professional automotive repair service...",
      "address": "123 Main Street, Downtown, City, State 12345",
      "latitude": 40.7128,
      "longitude": -74.006,
      "image_url": "https://example.com/workshop.jpg",
      "status": "OPEN",
      "rating": 0,
      "ownerId": "owner-uuid",
      "createdAt": "2025-08-30T...",
      "updatedAt": "2025-08-30T...",
      "owner": {
        "id": "owner-uuid",
        "name": "Auto Care Center",
        "email": "autocare@example.com",
        "phone": "+1234567890",
        "role": "MECHANIC_OWNER"
      },
      "services": [],
      "reviews": [],
      "averageRating": 0,
      "totalReviews": 0
    }
  }
}
```

---

### **2. Add Services to Workshop**

**Method:** `POST`  
**URL:** `http://localhost:3001/workshops/:id/services`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <mechanic_owner_token>
```

**Add Multiple Services:**

**Service 1 - Oil Change:**
```json
{
  "name": "Oil Change & Filter Replacement",
  "description": "Complete oil change service with high-quality motor oil and filter replacement. Includes 21-point inspection and fluid top-off."
}
```

**Service 2 - Brake Repair:**
```json
{
  "name": "Brake System Repair",
  "description": "Comprehensive brake repair including brake pad replacement, rotor resurfacing, brake fluid flush, and complete brake system inspection."
}
```

**Service 3 - Engine Diagnostics:**
```json
{
  "name": "Engine Diagnostics & Tune-Up",
  "description": "Advanced computer diagnostics to identify engine issues, followed by complete tune-up including spark plugs, air filter, and fuel system cleaning."
}
```

---

### **3. Get Workshop Services**

**Method:** `GET`  
**URL:** `http://localhost:3001/workshops/:id/services`

**Expected Response:**
```json
{
  "success": true,
  "message": "Workshop services retrieved successfully.",
  "data": {
    "services": [
      {
        "id": "service-uuid-1",
        "workshop_id": "workshop-uuid",
        "name": "Oil Change & Filter Replacement",
        "description": "Complete oil change service...",
        "createdAt": "2025-08-30T...",
        "updatedAt": "2025-08-30T..."
      },
      {
        "id": "service-uuid-2",
        "workshop_id": "workshop-uuid",
        "name": "Brake System Repair",
        "description": "Comprehensive brake repair...",
        "createdAt": "2025-08-30T...",
        "updatedAt": "2025-08-30T..."
      }
    ],
    "workshop": {
      "id": "workshop-uuid",
      "name": "Elite Auto Repair"
    }
  }
}
```

---

### **4. Add Customer Reviews**

**Method:** `POST`  
**URL:** `http://localhost:3001/workshops/:id/reviews`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <customer_token>
```

**Add Multiple Reviews (different customers):**

**Review 1:**
```json
{
  "rating": 5,
  "comment": "Excellent service! The team was professional, fast, and the pricing was fair. My car runs like new after the brake repair. Highly recommended!"
}
```

**Review 2 (need different customer):**
```json
{
  "rating": 4,
  "comment": "Good experience overall. The oil change was quick and the staff explained everything they were doing. Waiting area could be more comfortable, but the service quality was great."
}
```

**Review 3:**
```json
{
  "rating": 5,
  "comment": "Outstanding engine diagnostics! They found the issue that two other shops missed. Fixed it at a reasonable price and provided detailed explanation. Will definitely return!"
}
```

---

### **5. Get Workshop Reviews**

**Method:** `GET`  
**URL:** `http://localhost:3001/workshops/:id/reviews`

**With Pagination:**
```
GET http://localhost:3001/workshops/:id/reviews?page=1&limit=5
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Workshop reviews retrieved successfully.",
  "data": {
    "reviews": [
      {
        "id": "review-uuid-1",
        "workshop_id": "workshop-uuid",
        "user_id": "customer-uuid",
        "rating": 5,
        "comment": "Excellent service! The team was professional...",
        "createdAt": "2025-08-30T...",
        "updatedAt": "2025-08-30T...",
        "user": {
          "id": "customer-uuid",
          "name": "John Customer"
        }
      }
    ],
    "workshop": {
      "id": "workshop-uuid",
      "name": "Elite Auto Repair"
    },
    "statistics": {
      "averageRating": 4.7,
      "totalReviews": 3
    },
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalCount": 3,
      "limit": 5,
      "hasNextPage": false,
      "hasPreviousPage": false
    }
  }
}
```

---

### **6. Get Updated Workshop Details**

**Method:** `GET`  
**URL:** `http://localhost:3001/workshops/:id/details`

After adding services and reviews, the response will include:
```json
{
  "success": true,
  "message": "Workshop details retrieved successfully.",
  "data": {
    "workshop": {
      // ... workshop info
      "rating": 4.7,  // Updated based on reviews
      "services": [
        // All services
      ],
      "reviews": [
        // All reviews with user info
      ],
      "averageRating": 4.7,
      "totalReviews": 3
    }
  }
}
```

---

## **🚨 Error Scenarios to Test**

### **1. Add Service (Unauthorized)**
```
POST /workshops/:id/services (without token)
Expected: 401 Unauthorized
```

### **2. Add Service (Wrong Owner)**
```
POST /workshops/:id/services (with different owner's token)
Expected: 403 Forbidden - "You can only add services to your own workshop."
```

### **3. Add Review (Own Workshop)**
```
POST /workshops/:id/reviews (workshop owner trying to review own workshop)
Expected: 403 Forbidden - "You cannot review your own workshop."
```

### **4. Add Duplicate Review**
```
POST /workshops/:id/reviews (same user, same workshop)
Expected: 409 Conflict - "You have already reviewed this workshop."
```

### **5. Invalid Rating**
```json
{
  "rating": 6,  // Invalid rating > 5
  "comment": "Great service"
}
Expected: 400 Bad Request - "Rating must be between 1 and 5."
```

### **6. Workshop Not Found**
```
GET /workshops/invalid-uuid/details
Expected: 404 Not Found - "Workshop not found."
```

---

## **🎯 Key Features Demonstrated**

### **✅ Workshop Details:**
- Complete workshop information with description
- Owner details and contact information
- Workshop services listing
- Customer reviews with ratings
- Calculated average ratings and statistics

### **✅ Service Management:**
- Add services to workshops (owner-only)
- Detailed service descriptions
- Service listing with workshop context

### **✅ Review System:**
- Customer reviews with 1-5 star ratings
- Review comments and user attribution
- Automatic average rating calculation
- Duplicate review prevention
- Owner self-review prevention
- Pagination for reviews

### **✅ Security Features:**
- JWT authentication for protected operations
- Role-based access control
- Owner authorization for service management
- Customer authorization for reviews
- Input validation and sanitization

### **✅ Database Integrity:**
- Proper foreign key relationships
- Unique constraints for reviews
- Cascade deletion support
- Optimized indexes for performance

---

## **📊 Complete API Summary**

| Endpoint | Method | Description | Auth | Role |
|----------|--------|-------------|------|------|
| `/workshops` | GET | List workshops | No | - |
| `/workshops/:id` | GET | Get workshop basic info | No | - |
| `/workshops/:id/details` | GET | Get complete workshop details | No | - |
| `/workshops/:id/services` | GET | Get workshop services | No | - |
| `/workshops/:id/reviews` | GET | Get workshop reviews | No | - |
| `/workshops` | POST | Create workshop | Yes | MECHANIC_OWNER |
| `/workshops/:id` | PUT | Update workshop | Yes | Owner/Admin |
| `/workshops/:id` | DELETE | Delete workshop | Yes | Owner/Admin |
| `/workshops/:id/services` | POST | Add service | Yes | Owner/Admin |
| `/workshops/:id/reviews` | POST | Add review | Yes | Customer |

**🚀 The complete Workshop Detail Page API system is ready for comprehensive testing!**
