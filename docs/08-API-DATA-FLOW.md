# 🌐 API ROUTES & DATA FLOW - DOKUMENTASI LENGKAP

**Dokumentasi API Endpoints, Request/Response Format, dan Alur Data**

---

## 📑 Daftar Isi

1. [Overview API Architecture](#1-overview-api-architecture)
2. [API Endpoints List](#2-api-endpoints-list)
3. [Authentication API](#3-authentication-api)
4. [Register API](#4-register-api)
5. [Feedback API](#5-feedback-api)
6. [Data Flow Diagram](#6-data-flow-diagram)
7. [Request/Response Patterns](#7-requestresponse-patterns)
8. [Error Handling](#8-error-handling)
9. [Security & Rate Limiting](#9-security--rate-limiting)
10. [Testing API](#10-testing-api)
11. [Best Practices](#11-best-practices)

---

## 1. Overview API Architecture

### 1.1 Next.js App Router API

Project ini menggunakan **Next.js 15 App Router** dengan API Routes di folder `app/api/`.

```
app/api/
├── auth/
│   └── [...nextauth]/
│       └── route.ts         # NextAuth endpoints
├── register/
│   └── route.ts            # User registration
└── feedback/
    ├── route.ts            # GET, POST feedback
    └── [id]/
        └── route.ts        # PUT, DELETE feedback by ID
```

### 1.2 HTTP Methods Support

| Method | Purpose | Auth Required | Example |
|--------|---------|---------------|---------|
| `GET` | Read data | Optional | Get products list |
| `POST` | Create new data | Yes | Create feedback |
| `PUT` | Update existing data | Yes | Update feedback |
| `DELETE` | Delete data | Yes | Delete feedback |
| `PATCH` | Partial update | Yes | Update user profile |

### 1.3 Base URL

```
Development:  http://localhost:3000/api
Production:   https://yourdomain.com/api
```

---

## 2. API Endpoints List

### 2.1 Complete Endpoints

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/auth/[...nextauth]` | GET/POST | No | NextAuth authentication |
| `/api/register` | POST | No | User registration |
| `/api/feedback` | GET | Optional | Get feedback (by productId or all for admin) |
| `/api/feedback` | POST | Yes | Create feedback |
| `/api/feedback/[id]` | PUT | Yes | Update feedback |
| `/api/feedback/[id]` | DELETE | Yes | Delete feedback |

### 2.2 Planned/Future Endpoints

```
/api/products              GET, POST
/api/products/[id]         GET, PUT, DELETE
/api/categories            GET, POST
/api/categories/[id]       GET, PUT, DELETE
/api/orders                GET, POST
/api/orders/[id]           GET, PUT
/api/wishlist              GET, POST
/api/wishlist/[id]         DELETE
/api/users                 GET (admin only)
/api/users/[id]            GET, PUT, DELETE
```

---

## 3. Authentication API

### 3.1 Endpoint: POST /api/auth/signin

**Purpose:** Login dengan credentials (email + password)

**📁 File:** `app/api/auth/[...nextauth]/route.ts`

#### Request

```http
POST /api/auth/signin
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123!"
}
```

#### Response (Success)

```json
{
  "user": {
    "id": "uuid-here",
    "email": "user@example.com",
    "role": "user"
  },
  "expires": "2024-03-15T12:30:00.000Z"
}
```

#### Response (Error)

```json
{
  "error": "Invalid credentials"
}
```

#### Status Codes

- `200 OK` - Login berhasil
- `401 Unauthorized` - Email/password salah
- `500 Internal Server Error` - Server error

### 3.2 Endpoint: POST /api/auth/signout

**Purpose:** Logout user

#### Request

```http
POST /api/auth/signout
```

#### Response

```json
{
  "url": "/"
}
```

### 3.3 Endpoint: GET /api/auth/session

**Purpose:** Get current session

#### Request

```http
GET /api/auth/session
Cookie: next-auth.session-token=...
```

#### Response (Logged In)

```json
{
  "user": {
    "id": "uuid-here",
    "email": "user@example.com",
    "role": "user"
  },
  "expires": "2024-03-15T12:30:00.000Z"
}
```

#### Response (Not Logged In)

```json
{}
```

---

## 4. Register API

### 4.1 Endpoint: POST /api/register

**Purpose:** Register user baru

**📁 File:** `app/api/register/route.ts`

#### Request

```http
POST /api/register
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "SecurePass123!"
}
```

#### Request Body Schema

```typescript
{
  email: string,      // Required, valid email format
  password: string    // Required, min 8 chars, must contain uppercase, lowercase, number
}
```

#### Response (Success - 201)

```json
{
  "message": "User created successfully",
  "user": {
    "id": "uuid-generated",
    "email": "newuser@example.com",
    "role": "user"
  }
}
```

#### Response (Error - 400)

```json
{
  "error": "Email already exists"
}
```

```json
{
  "error": "Password must be at least 8 characters"
}
```

#### Response (Error - 500)

```json
{
  "error": "Internal server error"
}
```

#### Status Codes

- `201 Created` - User berhasil dibuat
- `400 Bad Request` - Validation error
- `409 Conflict` - Email sudah terdaftar
- `500 Internal Server Error` - Server error

#### Implementation Example

```typescript
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import { z } from "zod";

// Validation schema
const registerSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string()
    .min(8, "Password min 8 characters")
    .regex(/[A-Z]/, "Password harus ada huruf besar")
    .regex(/[a-z]/, "Password harus ada huruf kecil")
    .regex(/[0-9]/, "Password harus ada angka")
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validasi input
    const validated = registerSchema.parse(body);
    
    // Check existing user
    const existingUser = await prisma.user.findUnique({
      where: { email: validated.email }
    });
    
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 409 }
      );
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(validated.password, 10);
    
    // Create user
    const user = await prisma.user.create({
      data: {
        id: nanoid(),
        email: validated.email,
        password: hashedPassword,
        role: "user"
      }
    });
    
    return NextResponse.json(
      {
        message: "User created successfully",
        user: {
          id: user.id,
          email: user.email,
          role: user.role
        }
      },
      { status: 201 }
    );
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

---

## 5. Feedback API

### 5.1 Endpoint: GET /api/feedback

**Purpose:** Get feedback list

**📁 File:** `app/api/feedback/route.ts`

#### Scenario 1: Get Feedback by Product ID

**Request:**

```http
GET /api/feedback?productId=uuid-product-123
```

**Response (200):**

```json
{
  "feedbacks": [
    {
      "id": "feedback-uuid-1",
      "productId": "uuid-product-123",
      "userId": "user-uuid-1",
      "comment": "Great product!",
      "rating": 5,
      "createdAt": "2024-03-15T10:00:00.000Z",
      "updatedAt": "2024-03-15T10:00:00.000Z",
      "user": {
        "id": "user-uuid-1",
        "email": "customer@example.com"
      },
      "product": {
        "id": "uuid-product-123",
        "title": "Laptop ASUS ROG"
      }
    },
    {
      "id": "feedback-uuid-2",
      "productId": "uuid-product-123",
      "userId": "user-uuid-2",
      "comment": "Good quality, fast delivery",
      "rating": 4,
      "createdAt": "2024-03-14T15:30:00.000Z",
      "updatedAt": "2024-03-14T15:30:00.000Z",
      "user": {
        "id": "user-uuid-2",
        "email": "buyer@example.com"
      },
      "product": {
        "id": "uuid-product-123",
        "title": "Laptop ASUS ROG"
      }
    }
  ]
}
```

#### Scenario 2: Get All Feedback (Admin Only)

**Request:**

```http
GET /api/feedback
Authorization: Bearer <session-token>
```

**Headers:**

```
Cookie: next-auth.session-token=...
```

**Response (200):**

```json
{
  "feedbacks": [
    {
      "id": "feedback-uuid-1",
      "productId": "product-1",
      "userId": "user-1",
      "comment": "Excellent!",
      "rating": 5,
      "createdAt": "2024-03-15T10:00:00.000Z",
      "user": { "id": "user-1", "email": "user1@example.com" },
      "product": { "id": "product-1", "title": "Product A" }
    },
    {
      "id": "feedback-uuid-2",
      "productId": "product-2",
      "userId": "user-2",
      "comment": "Good value",
      "rating": 4,
      "createdAt": "2024-03-14T12:00:00.000Z",
      "user": { "id": "user-2", "email": "user2@example.com" },
      "product": { "id": "product-2", "title": "Product B" }
    }
  ]
}
```

**Response (401 - Unauthorized):**

```json
{
  "error": "Unauthorized or missing productId parameter"
}
```

### 5.2 Endpoint: POST /api/feedback

**Purpose:** Create new feedback (user only, not admin)

#### Request

```http
POST /api/feedback
Content-Type: application/json
Cookie: next-auth.session-token=...

{
  "productId": "uuid-product-123",
  "comment": "Amazing product, highly recommended!",
  "rating": 5
}
```

#### Request Body Schema

```typescript
{
  productId: string,  // Required, UUID
  comment: string,    // Required, min 10 chars
  rating: number      // Required, 1-5
}
```

#### Response (201 - Created)

```json
{
  "message": "Feedback created successfully",
  "feedback": {
    "id": "feedback-uuid-new",
    "productId": "uuid-product-123",
    "userId": "user-uuid-current",
    "comment": "Amazing product, highly recommended!",
    "rating": 5,
    "createdAt": "2024-03-15T14:30:00.000Z",
    "updatedAt": "2024-03-15T14:30:00.000Z"
  }
}
```

#### Response (400 - Validation Error)

```json
{
  "error": "Rating must be between 1 and 5"
}
```

#### Response (401 - Unauthorized)

```json
{
  "error": "Unauthorized"
}
```

#### Response (403 - Admin Cannot Create Feedback)

```json
{
  "error": "Admin cannot create feedback"
}
```

#### Response (409 - Duplicate Feedback)

```json
{
  "error": "You have already given feedback for this product"
}
```

#### Implementation

```typescript
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check authentication
    if (!session || !(session as any)?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const user = (session as any).user;
    
    // Admin tidak boleh buat feedback
    if (user.role === "admin") {
      return NextResponse.json(
        { error: "Admin cannot create feedback" },
        { status: 403 }
      );
    }
    
    const body = await request.json();
    
    // Validasi
    const feedbackSchema = z.object({
      productId: z.string().uuid(),
      comment: z.string().min(10, "Comment min 10 characters"),
      rating: z.number().int().min(1).max(5)
    });
    
    const validated = feedbackSchema.parse(body);
    
    // Check duplicate feedback
    const existingFeedback = await prisma.feedback.findUnique({
      where: {
        productId_userId: {
          productId: validated.productId,
          userId: user.id
        }
      }
    });
    
    if (existingFeedback) {
      return NextResponse.json(
        { error: "You have already given feedback for this product" },
        { status: 409 }
      );
    }
    
    // Create feedback
    const feedback = await prisma.feedback.create({
      data: {
        id: nanoid(),
        productId: validated.productId,
        userId: user.id,
        comment: validated.comment,
        rating: validated.rating
      }
    });
    
    return NextResponse.json(
      {
        message: "Feedback created successfully",
        feedback
      },
      { status: 201 }
    );
    
  } catch (error) {
    // Error handling...
  }
}
```

### 5.3 Endpoint: PUT /api/feedback/[id]

**Purpose:** Update existing feedback (owner or admin)

#### Request

```http
PUT /api/feedback/feedback-uuid-123
Content-Type: application/json
Cookie: next-auth.session-token=...

{
  "comment": "Updated comment text",
  "rating": 4
}
```

#### Response (200 - Success)

```json
{
  "message": "Feedback updated successfully",
  "feedback": {
    "id": "feedback-uuid-123",
    "productId": "product-uuid",
    "userId": "user-uuid",
    "comment": "Updated comment text",
    "rating": 4,
    "createdAt": "2024-03-15T10:00:00.000Z",
    "updatedAt": "2024-03-15T14:45:00.000Z"
  }
}
```

#### Response (403 - Forbidden)

```json
{
  "error": "You can only edit your own feedback"
}
```

#### Response (404 - Not Found)

```json
{
  "error": "Feedback not found"
}
```

### 5.4 Endpoint: DELETE /api/feedback/[id]

**Purpose:** Delete feedback (owner or admin)

#### Request

```http
DELETE /api/feedback/feedback-uuid-123
Cookie: next-auth.session-token=...
```

#### Response (200 - Success)

```json
{
  "message": "Feedback deleted successfully"
}
```

#### Response (403 - Forbidden)

```json
{
  "error": "You can only delete your own feedback"
}
```

#### Response (404 - Not Found)

```json
{
  "error": "Feedback not found"
}
```

---

## 6. Data Flow Diagram

### 6.1 Authentication Flow

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │ 1. POST /api/auth/signin
       │    { email, password }
       ▼
┌─────────────────────────────┐
│   API Route                 │
│   /api/auth/[...nextauth]   │
└──────┬──────────────────────┘
       │ 2. Validate credentials
       ▼
┌─────────────────┐
│  Prisma Client  │
└──────┬──────────┘
       │ 3. Query user
       ▼
┌─────────────────┐
│  MySQL Database │
└──────┬──────────┘
       │ 4. Return user data
       ▼
┌─────────────────────────────┐
│   NextAuth                  │
│   - Generate JWT            │
│   - Create session          │
└──────┬──────────────────────┘
       │ 5. Set cookie + return session
       ▼
┌─────────────┐
│   Browser   │
│   (Logged)  │
└─────────────┘
```

### 6.2 Create Feedback Flow

```
┌─────────────┐
│   Browser   │
│  (Customer) │
└──────┬──────┘
       │ 1. POST /api/feedback
       │    { productId, comment, rating }
       │    Cookie: session-token
       ▼
┌─────────────────────────────┐
│   Middleware                │
│   - Check authentication    │
│   - Get session             │
└──────┬──────────────────────┘
       │ 2. Session valid?
       ▼
┌─────────────────────────────┐
│   API Route Handler         │
│   /api/feedback/route.ts    │
└──────┬──────────────────────┘
       │ 3. Validate with Zod
       │    - productId (UUID)
       │    - comment (min 10 chars)
       │    - rating (1-5)
       ▼
┌─────────────────────────────┐
│   Business Logic            │
│   - Check if admin (reject) │
│   - Check duplicate         │
└──────┬──────────────────────┘
       │ 4. Check duplicate feedback
       ▼
┌─────────────────┐
│  Prisma Client  │
│  findUnique()   │
└──────┬──────────┘
       │ 5. Query existing feedback
       ▼
┌─────────────────┐
│  MySQL Database │
└──────┬──────────┘
       │ 6. No duplicate? Create!
       ▼
┌─────────────────┐
│  Prisma Client  │
│  create()       │
└──────┬──────────┘
       │ 7. INSERT feedback
       ▼
┌─────────────────┐
│  MySQL Database │
└──────┬──────────┘
       │ 8. Return created feedback
       ▼
┌─────────────────────────────┐
│   API Response              │
│   201 Created               │
│   { feedback }              │
└──────┬──────────────────────┘
       │ 9. JSON response
       ▼
┌─────────────┐
│   Browser   │
│   (Success) │
└─────────────┘
```

### 6.3 Full Stack Data Flow

```
┌──────────────────────────────────────────────────────────────┐
│                       FRONTEND (Client)                       │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐             │
│  │ Components │  │   Zustand  │  │  useEffect │             │
│  │   (UI)     │  │   Store    │  │   Hooks    │             │
│  └─────┬──────┘  └──────┬─────┘  └──────┬─────┘             │
│        │                │                │                    │
└────────┼────────────────┼────────────────┼────────────────────┘
         │                │                │
         │ fetch()        │ setState()     │ fetch()
         ▼                ▼                ▼
┌──────────────────────────────────────────────────────────────┐
│                     BACKEND (Next.js API)                     │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                API Route Handlers                     │   │
│  │  /api/feedback/route.ts                              │   │
│  │  /api/register/route.ts                              │   │
│  │  /api/auth/[...nextauth]/route.ts                    │   │
│  └─────┬────────────────────────────────────────────────┘   │
│        │                                                      │
│        │ NextAuth Session Check                              │
│        ▼                                                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Middleware & Validation                  │   │
│  │  - Authentication (NextAuth)                         │   │
│  │  - Authorization (role check)                        │   │
│  │  - Zod Schema Validation                             │   │
│  │  - DOMPurify Sanitization                            │   │
│  └─────┬────────────────────────────────────────────────┘   │
│        │                                                      │
└────────┼──────────────────────────────────────────────────────┘
         │
         │ Prisma Query
         ▼
┌──────────────────────────────────────────────────────────────┐
│                      ORM LAYER (Prisma)                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │               Prisma Client                           │   │
│  │  prisma.feedback.findMany()                          │   │
│  │  prisma.user.create()                                │   │
│  │  prisma.product.update()                             │   │
│  └─────┬────────────────────────────────────────────────┘   │
│        │                                                      │
└────────┼──────────────────────────────────────────────────────┘
         │
         │ SQL Query
         ▼
┌──────────────────────────────────────────────────────────────┐
│                     DATABASE (MySQL)                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Tables:                                              │   │
│  │  - Product                                            │   │
│  │  - User                                               │   │
│  │  - Feedback                                           │   │
│  │  - Customer_order                                     │   │
│  │  - Category                                           │   │
│  │  - Wishlist                                           │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
```

---

## 7. Request/Response Patterns

### 7.1 Standard Response Format

#### Success Response

```typescript
{
  // Single resource
  "user": { ... },
  "product": { ... },
  
  // Multiple resources
  "users": [ ... ],
  "products": [ ... ],
  
  // With metadata
  "data": [ ... ],
  "page": 1,
  "limit": 10,
  "total": 100,
  
  // With message
  "message": "Operation successful",
  "result": { ... }
}
```

#### Error Response

```typescript
{
  "error": "Error message here",
  
  // With details (validation errors)
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    },
    {
      "field": "password",
      "message": "Password too short"
    }
  ]
}
```

### 7.2 HTTP Status Codes

| Code | Meaning | Use Case |
|------|---------|----------|
| **200** | OK | Successful GET, PUT, DELETE |
| **201** | Created | Successful POST (resource created) |
| **204** | No Content | Successful DELETE (no response body) |
| **400** | Bad Request | Validation error, malformed JSON |
| **401** | Unauthorized | Not logged in, invalid token |
| **403** | Forbidden | Logged in but no permission |
| **404** | Not Found | Resource tidak ditemukan |
| **409** | Conflict | Duplicate entry (email exists) |
| **422** | Unprocessable Entity | Semantic error (e.g., invalid state) |
| **500** | Internal Server Error | Unexpected server error |

### 7.3 Pagination Pattern

```typescript
// Request
GET /api/products?page=2&limit=20

// Response
{
  "products": [ ... ],
  "pagination": {
    "page": 2,
    "limit": 20,
    "total": 150,
    "totalPages": 8,
    "hasNext": true,
    "hasPrev": true
  }
}
```

### 7.4 Filtering Pattern

```typescript
// Single filter
GET /api/products?categoryId=uuid-123

// Multiple filters
GET /api/products?categoryId=uuid-123&minPrice=1000&maxPrice=5000

// Search
GET /api/products?search=laptop

// Sort
GET /api/products?sortBy=price&order=asc
```

---

## 8. Error Handling

### 8.1 Centralized Error Handler

```typescript
// lib/api-error-handler.ts
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public errors?: any[]
  ) {
    super(message);
  }
}

export function handleApiError(error: unknown) {
  console.error("API Error:", error);
  
  // Zod validation error
  if (error instanceof z.ZodError) {
    return NextResponse.json(
      {
        error: "Validation failed",
        errors: error.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message
        }))
      },
      { status: 400 }
    );
  }
  
  // Custom API error
  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        error: error.message,
        errors: error.errors
      },
      { status: error.statusCode }
    );
  }
  
  // Prisma error
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: "Duplicate entry" },
        { status: 409 }
      );
    }
  }
  
  // Generic error
  return NextResponse.json(
    { error: "Internal server error" },
    { status: 500 }
  );
}
```

### 8.2 Usage in API Route

```typescript
export async function POST(request: NextRequest) {
  try {
    // Your logic here
    
  } catch (error) {
    return handleApiError(error);
  }
}
```

---

## 9. Security & Rate Limiting

### 9.1 Authentication Check

```typescript
// Middleware untuk check auth
async function requireAuth(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    throw new ApiError(401, "Unauthorized");
  }
  
  return session.user;
}

// Usage
export async function POST(request: NextRequest) {
  const user = await requireAuth(request);
  
  // User authenticated, proceed...
}
```

### 9.2 Role-Based Authorization

```typescript
function requireRole(user: any, allowedRoles: string[]) {
  if (!allowedRoles.includes(user.role)) {
    throw new ApiError(403, "Forbidden: Insufficient permissions");
  }
}

// Usage
export async function DELETE(request: NextRequest) {
  const user = await requireAuth(request);
  requireRole(user, ['admin']); // Only admin can delete
  
  // Proceed with delete...
}
```

### 9.3 Rate Limiting (Future Implementation)

```typescript
// lib/rate-limit.ts
import { RateLimiter } from 'express-rate-limit'

export const limiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Max 100 requests per window
  message: "Too many requests, please try again later"
});

// Apply to API route
export async function POST(request: NextRequest) {
  await limiter(request);
  
  // Your logic...
}
```

---

## 10. Testing API

### 10.1 Test dengan cURL

```bash
# Register
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}'

# Login (get session cookie)
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}' \
  -c cookies.txt

# Create feedback (with session)
curl -X POST http://localhost:3000/api/feedback \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"productId":"uuid-123","comment":"Great product!","rating":5}'

# Get feedback
curl http://localhost:3000/api/feedback?productId=uuid-123
```

### 10.2 Test dengan Postman/Thunder Client

**Collection structure:**

```
Electronics eCommerce API
├── Auth
│   ├── POST Register
│   ├── POST Login
│   └── GET Session
├── Feedback
│   ├── GET Feedback (by product)
│   ├── GET All Feedback (admin)
│   ├── POST Create Feedback
│   ├── PUT Update Feedback
│   └── DELETE Feedback
└── Products (future)
```

### 10.3 Automated Testing (Jest)

```typescript
// __tests__/api/feedback.test.ts
import { POST } from '@/app/api/feedback/route';

describe('POST /api/feedback', () => {
  it('should create feedback successfully', async () => {
    const request = new Request('http://localhost:3000/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId: 'test-uuid',
        comment: 'Test comment',
        rating: 5
      })
    });
    
    const response = await POST(request as any);
    const data = await response.json();
    
    expect(response.status).toBe(201);
    expect(data.feedback).toBeDefined();
  });
  
  it('should reject invalid rating', async () => {
    const request = new Request('http://localhost:3000/api/feedback', {
      method: 'POST',
      body: JSON.stringify({
        productId: 'test-uuid',
        comment: 'Test',
        rating: 6 // Invalid!
      })
    });
    
    const response = await POST(request as any);
    
    expect(response.status).toBe(400);
  });
});
```

---

## 11. Best Practices

### 11.1 ✅ DO's

#### 1. Use TypeScript Types

```typescript
// ✅ BENAR: Strong typing
interface CreateFeedbackRequest {
  productId: string;
  comment: string;
  rating: number;
}

export async function POST(request: NextRequest) {
  const body: CreateFeedbackRequest = await request.json();
}
```

#### 2. Validate All Inputs

```typescript
// ✅ BENAR: Validate dengan Zod
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

const validated = schema.parse(body);
```

#### 3. Use Proper HTTP Status Codes

```typescript
// ✅ BENAR
return NextResponse.json(data, { status: 201 }); // Created
return NextResponse.json(error, { status: 404 }); // Not Found
return NextResponse.json(error, { status: 403 }); // Forbidden
```

#### 4. Sanitize User Input

```typescript
import DOMPurify from 'dompurify';

const clean = DOMPurify.sanitize(userInput);
```

#### 5. Log Errors

```typescript
console.error('API Error:', {
  endpoint: '/api/feedback',
  method: 'POST',
  error: error.message,
  stack: error.stack
});
```

### 11.2 ❌ DON'Ts

#### 1. Jangan Expose Sensitive Data

```typescript
// ❌ SALAH: Return password
return NextResponse.json({ user: { ...user } });

// ✅ BENAR: Select only needed fields
return NextResponse.json({
  user: {
    id: user.id,
    email: user.email,
    role: user.role
  }
});
```

#### 2. Jangan Skip Authentication

```typescript
// ❌ SALAH: No auth check
export async function DELETE(request: NextRequest) {
  await prisma.feedback.delete(...);
}

// ✅ BENAR: Check auth first
export async function DELETE(request: NextRequest) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  await prisma.feedback.delete(...);
}
```

#### 3. Jangan Return Stack Trace ke Client

```typescript
// ❌ SALAH
catch (error) {
  return NextResponse.json({ error: error.stack }, { status: 500 });
}

// ✅ BENAR
catch (error) {
  console.error(error); // Log di server
  return NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  );
}
```

---

## 📚 Referensi

### Official Docs

- [Next.js Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [NextAuth.js API](https://next-auth.js.org/getting-started/rest-api)
- [Prisma Client API](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)

### Related Docs

- [03-AUTHENTICATION-AUTHORIZATION.md](./03-AUTHENTICATION-AUTHORIZATION.md) - Auth implementation
- [04-VALIDASI-DATA.md](./04-VALIDASI-DATA.md) - Validation with Zod
- [05-DATABASE-PRISMA.md](./05-DATABASE-PRISMA.md) - Database operations

---

**✅ Dokumentasi API Routes & Data Flow Selesai!**

**🎉 SEMUA 8 DOKUMENTASI TELAH SELESAI! 🎉**
