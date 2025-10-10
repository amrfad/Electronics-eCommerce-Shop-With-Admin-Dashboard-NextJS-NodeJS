# ✅ Validasi Data

> **Dokumentasi Lengkap**: Zod Schema, Validation, Sanitization, Error Handling, dan Security Best Practices

---

## 📑 Daftar Isi

- [Konsep Dasar Validasi](#konsep-dasar-validasi)
- [Zod Schema Validation](#zod-schema-validation)
- [Common Validations](#common-validations)
- [Sanitization (XSS Protection)](#sanitization-xss-protection)
- [Client-Side vs Server-Side Validation](#client-side-vs-server-side-validation)
- [Error Handling](#error-handling)
- [Validation Patterns](#validation-patterns)
- [Range & Tipe Data](#range--tipe-data)
- [Custom Validators](#custom-validators)
- [Security Best Practices](#security-best-practices)

---

## 🎯 Konsep Dasar Validasi

### Mengapa Validasi Penting?

1. **Security** 🔒 - Prevent SQL injection, XSS, malicious input
2. **Data Integrity** ✅ - Ensure data format correct
3. **User Experience** 💫 - Clear error messages
4. **Business Logic** 📊 - Enforce rules (min price, max quantity, etc.)

### Validation Flow

```
User Input
    ↓
Client-Side Validation (Optional, UX)
    ↓
HTTP Request
    ↓
Server-Side Validation (REQUIRED!)
    ↓
Sanitization (Remove XSS)
    ↓
Business Logic Validation
    ↓
Database Operation
    ↓
Response
```

---

## 📐 Zod Schema Validation

### Instalasi

Zod sudah terinstall di project:

```json
// package.json
{
  "dependencies": {
    "zod": "^3.22.4"
  }
}
```

### Konsep Dasar Zod

**Zod** adalah TypeScript-first schema validation library.

**Keuntungan:**
- ✅ Type-safe (TypeScript support)
- ✅ Composable schemas
- ✅ Clear error messages
- ✅ Runtime validation
- ✅ Type inference

### Basic Schema Example

```typescript
import { z } from "zod";

// Define schema
const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  age: z.number().min(18).max(100),
});

// Type inference
type User = z.infer<typeof userSchema>;
// → { email: string; password: string; age: number }

// Validate data
const result = userSchema.safeParse({
  email: "user@example.com",
  password: "password123",
  age: 25,
});

if (result.success) {
  console.log("Valid:", result.data);
} else {
  console.log("Errors:", result.error.errors);
}
```

---

## 🔐 Common Validations

### Lokasi: `utils/validation.ts`

```typescript
import { z } from "zod";

export const commonValidations = {
  /**
   * Email validation dengan comprehensive checks
   */
  email: z
    .string()
    .min(1, "Email is required")
    .max(254, "Email must be no more than 254 characters")
    .email("Please provide a valid email address")
    .toLowerCase()
    .trim()
    .refine(
      (email) => {
        // Check for suspicious patterns (XSS attempts)
        const suspiciousPatterns = [
          /<script/i,
          /javascript:/i,
          /on\w+\s*=/i,
          /data:/i,
        ];
        return !suspiciousPatterns.some(pattern => pattern.test(email));
      },
      "Email contains invalid characters"
    ),

  /**
   * Strong password validation
   */
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(128, "Password must be no more than 128 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    )
    .refine(
      (password) => {
        // Check for common weak passwords
        const commonPasswords = [
          "password", "123456", "qwerty", "abc123", "password123",
          "admin", "letmein", "welcome", "monkey", "dragon"
        ];
        return !commonPasswords.includes(password.toLowerCase());
      },
      "Password is too common, please choose a stronger password"
    ),

  /**
   * Request size validation
   */
  validateRequestSize: (contentLength: number | null) => {
    const MAX_REQUEST_SIZE = 1024 * 1024; // 1MB limit
    if (contentLength && contentLength > MAX_REQUEST_SIZE) {
      throw new Error("Request payload too large");
    }
  },

  /**
   * Rate limiting helper
   */
  rateLimit: new Map<string, { count: number; resetTime: number }>(),
  
  checkRateLimit: (
    identifier: string,
    maxRequests: number = 5,
    windowMs: number = 15 * 60 * 1000
  ) => {
    const now = Date.now();
    const userLimit = commonValidations.rateLimit.get(identifier);
    
    if (!userLimit || now > userLimit.resetTime) {
      commonValidations.rateLimit.set(identifier, {
        count: 1,
        resetTime: now + windowMs
      });
      return true;
    }
    
    if (userLimit.count >= maxRequests) {
      return false;
    }
    
    userLimit.count++;
    return true;
  },
};
```

### Usage Example

```typescript
import { commonValidations } from "@/utils/validation";

// Validate email
const emailSchema = z.object({
  email: commonValidations.email,
});

const result = emailSchema.safeParse({
  email: "user@example.com"
});
```

---

## 🧹 Sanitization (XSS Protection)

### Konsep Sanitization

**Sanitization** = Membersihkan input dari karakter berbahaya.

**Kenapa penting?**
- Prevent XSS (Cross-Site Scripting)
- Prevent SQL Injection
- Remove malicious code

### Sanitization Helpers

**Lokasi:** `utils/validation.ts`

```typescript
export const sanitizeInput = {
  /**
   * Remove potentially dangerous characters
   */
  sanitizeString: (input: string): string => {
    return input
      .replace(/[<>]/g, '') // Remove < and >
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+\s*=/gi, '') // Remove event handlers
      .trim();
  },

  /**
   * Validate and sanitize JSON input
   */
  validateJsonInput: async (request: Request) => {
    const contentLength = request.headers.get("content-length");
    commonValidations.validateRequestSize(
      contentLength ? parseInt(contentLength) : null
    );

    try {
      return await request.json();
    } catch (error) {
      throw new Error("Invalid JSON format");
    }
  }
};
```

### DOMPurify for HTML Sanitization

**Lokasi:** `lib/sanitize.ts`

```typescript
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

const window = new JSDOM('').window;
const purify = DOMPurify(window as unknown as Window);

/**
 * Sanitize HTML content to prevent XSS attacks
 */
export function sanitize(dirty: string): string {
  if (typeof dirty !== 'string') {
    return '';
  }
  
  // Configure DOMPurify
  const clean = purify.sanitize(dirty, {
    ALLOWED_TAGS: [], // No HTML tags allowed
    ALLOWED_ATTR: [], // No attributes allowed
    KEEP_CONTENT: true, // Keep text content
  });
  
  return clean.trim();
}
```

### Form Sanitization

**Lokasi:** `lib/form-sanitize.ts`

```typescript
import { sanitize } from './sanitize';

/**
 * Sanitize form data before sending to API
 */
export function sanitizeFormData(formData: any): any {
  if (!formData) return formData;

  const sanitized = { ...formData };

  // Sanitize text fields
  if (sanitized.title) sanitized.title = sanitize(sanitized.title);
  if (sanitized.manufacturer) sanitized.manufacturer = sanitize(sanitized.manufacturer);
  if (sanitized.description) sanitized.description = sanitize(sanitized.description);
  if (sanitized.slug) sanitized.slug = sanitize(sanitized.slug);
  if (sanitized.name) sanitized.name = sanitize(sanitized.name);
  if (sanitized.lastname) sanitized.lastname = sanitize(sanitized.lastname);
  if (sanitized.email) sanitized.email = sanitize(sanitized.email);

  return sanitized;
}
```

### Usage in Component

```tsx
"use client";
import { sanitizeFormData } from "@/lib/form-sanitize";

const MyForm = () => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = {
      title: e.target.title.value,
      description: e.target.description.value,
    };
    
    // Sanitize before sending to API
    const sanitized = sanitizeFormData(formData);
    
    await fetch("/api/products", {
      method: "POST",
      body: JSON.stringify(sanitized),
    });
  };
  
  return <form onSubmit={handleSubmit}>...</form>;
};
```

---

## 🔄 Client-Side vs Server-Side Validation

### Client-Side Validation (UX)

**Tujuan:** Improve user experience, immediate feedback

```tsx
"use client";
import { useState } from "react";

const RegisterForm = () => {
  const [errors, setErrors] = useState({});
  
  const validateEmail = (email: string) => {
    const regex = /^\S+@\S+\.\S+$/;
    return regex.test(email);
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Client-side validation (instant feedback)
    if (name === "email" && !validateEmail(value)) {
      setErrors({ ...errors, email: "Invalid email format" });
    } else {
      const { email, ...rest } = errors;
      setErrors(rest);
    }
  };
  
  return (
    <form>
      <input
        name="email"
        type="email"
        onChange={handleChange}
        required
        minLength={5}
      />
      {errors.email && <p className="error">{errors.email}</p>}
    </form>
  );
};
```

### Server-Side Validation (Security) ✅

**Tujuan:** Security, data integrity (REQUIRED!)

```typescript
// app/api/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import { registrationSchema } from "@/utils/schema";
import { sanitizeInput } from "@/utils/validation";

export async function POST(request: NextRequest) {
  try {
    // 1. Parse & validate JSON
    const body = await sanitizeInput.validateJsonInput(request);
    
    // 2. Validate with Zod schema (SERVER-SIDE!)
    const validatedData = registrationSchema.parse(body);
    
    // 3. Business logic...
    // ...
    
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { errors: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
```

### Best Practice: Both!

```
Client-Side Validation → Immediate UX feedback
         +
Server-Side Validation → Security & Data Integrity
```

❌ **Never trust client-side validation alone!**
✅ **Always validate on server!**

---

## 🎨 Error Handling

### Zod Error Format

```typescript
// When validation fails
{
  "issues": [
    {
      "code": "invalid_type",
      "expected": "string",
      "received": "number",
      "path": ["email"],
      "message": "Expected string, received number"
    }
  ]
}
```

### Error Handler Utility

**Lokasi:** `utils/errorHandler.ts`

```typescript
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";

/**
 * Centralized error handler for API routes
 */
export function handleApiError(error: unknown): NextResponse {
  console.error("API Error:", error);
  
  // Zod validation errors
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        message: "Validation failed",
        errors: error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      },
      { status: 400 }
    );
  }
  
  // Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // Unique constraint violation
    if (error.code === "P2002") {
      return NextResponse.json(
        {
          message: "A record with this value already exists",
          field: error.meta?.target,
        },
        { status: 409 }
      );
    }
    
    // Record not found
    if (error.code === "P2025") {
      return NextResponse.json(
        { message: "Record not found" },
        { status: 404 }
      );
    }
  }
  
  // Generic error
  return NextResponse.json(
    { message: "Internal server error" },
    { status: 500 }
  );
}
```

### Usage in API Route

```typescript
// app/api/products/route.ts
import { handleApiError } from "@/utils/errorHandler";

export async function POST(request: Request) {
  try {
    // Your logic here...
  } catch (error) {
    return handleApiError(error); // ← Centralized error handling
  }
}
```

### Display Errors in UI

```tsx
"use client";
import toast from "react-hot-toast";

const MyForm = () => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch("/api/products", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        // Show validation errors
        if (data.errors) {
          data.errors.forEach((err) => {
            toast.error(`${err.field}: ${err.message}`);
          });
        } else {
          toast.error(data.message);
        }
      } else {
        toast.success("Success!");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };
  
  return <form onSubmit={handleSubmit}>...</form>;
};
```

---

## 🔢 Range & Tipe Data

### Numeric Ranges

```typescript
import { z } from "zod";

// Product schema with ranges
const productSchema = z.object({
  price: z
    .number()
    .min(0, "Price must be non-negative")
    .max(1000000, "Price too high")
    .int("Price must be an integer"),
  
  rating: z
    .number()
    .min(0, "Rating must be at least 0")
    .max(5, "Rating cannot exceed 5"),
  
  inStock: z
    .number()
    .int("Stock must be an integer")
    .min(0, "Stock cannot be negative")
    .max(10000, "Stock limit exceeded"),
});
```

### String Ranges

```typescript
const orderSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .regex(/^[a-zA-Z\s\-']+$/, "Name contains invalid characters"),
  
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(20, "Phone number must be less than 20 characters")
    .regex(/^[0-9+\-\(\)\s]+$/, "Invalid phone format"),
  
  address: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .max(200, "Address too long"),
  
  apartment: z
    .string()
    .min(1, "Apartment is required")
    .max(50, "Apartment too long"),
  
  postalCode: z
    .string()
    .min(3, "Postal code too short")
    .max(10, "Postal code too long"),
});
```

### Date Ranges

```typescript
const feedbackSchema = z.object({
  createdAt: z
    .date()
    .min(new Date("2020-01-01"), "Date too old")
    .max(new Date(), "Date cannot be in the future"),
});
```

### Array Ranges

```typescript
const cartSchema = z.object({
  products: z
    .array(z.object({
      id: z.string(),
      quantity: z.number().min(1).max(100),
    }))
    .min(1, "Cart cannot be empty")
    .max(50, "Too many items in cart"),
});
```

### Validation in Server-Side (Node.js)

**Lokasi:** `server/utills/validation.js`

```javascript
class ValidationError extends Error {
  constructor(message, field = null) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}

const orderValidation = {
  // Name validation (2-50 chars)
  validateName: (name, fieldName = 'name') => {
    if (!name || typeof name !== 'string') {
      throw new ValidationError(`${fieldName} is required`, fieldName);
    }

    const trimmedName = name.trim();
    
    if (trimmedName.length < 2) {
      throw new ValidationError(
        `${fieldName} must be at least 2 characters`,
        fieldName
      );
    }

    if (trimmedName.length > 50) {
      throw new ValidationError(
        `${fieldName} must be less than 50 characters`,
        fieldName
      );
    }

    // Allow letters, spaces, hyphens, apostrophes
    if (!/^[a-zA-Z\s\-']+$/.test(trimmedName)) {
      throw new ValidationError(
        `${fieldName} contains invalid characters`,
        fieldName
      );
    }

    return trimmedName;
  },

  // Phone validation (10-20 chars)
  validatePhone: (phone) => {
    if (!phone || typeof phone !== 'string') {
      throw new ValidationError('Phone number is required', 'phone');
    }

    const cleanedPhone = phone.replace(/[^0-9+\-\(\)\s]/g, '');
    
    if (cleanedPhone.length < 10) {
      throw new ValidationError(
        'Phone number must be at least 10 digits',
        'phone'
      );
    }

    if (cleanedPhone.length > 20) {
      throw new ValidationError(
        'Phone number must be less than 20 characters',
        'phone'
      );
    }

    return cleanedPhone;
  },

  // Address validation (min 5 chars, apartment min 1 char)
  validateAddress: (address, fieldName = 'address') => {
    if (!address || typeof address !== 'string') {
      throw new ValidationError(`${fieldName} is required`, fieldName);
    }

    const trimmedAddress = address.trim();
    
    // Special case for apartment - only 1 character minimum
    const minLength = fieldName === 'apartment' ? 1 : 5;
    
    if (trimmedAddress.length < minLength) {
      throw new ValidationError(
        `${fieldName} must be at least ${minLength} character${minLength > 1 ? 's' : ''}`,
        fieldName
      );
    }

    if (trimmedAddress.length > 200) {
      throw new ValidationError(
        `${fieldName} must be less than 200 characters`,
        fieldName
      );
    }

    return trimmedAddress;
  },

  // Email validation
  validateEmail: (email) => {
    if (!email || typeof email !== 'string') {
      throw new ValidationError('Email is required', 'email');
    }

    const trimmedEmail = email.trim().toLowerCase();
    
    if (trimmedEmail.length < 5) {
      throw new ValidationError('Email is too short', 'email');
    }

    if (trimmedEmail.length > 254) {
      throw new ValidationError('Email is too long', 'email');
    }

    // Simple email regex
    if (!/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
      throw new ValidationError('Invalid email format', 'email');
    }

    return trimmedEmail;
  },

  // Postal code validation (3-10 chars)
  validatePostalCode: (postalCode) => {
    if (!postalCode || typeof postalCode !== 'string') {
      throw new ValidationError('Postal code is required', 'postalCode');
    }

    const cleaned = postalCode.trim();
    
    if (cleaned.length < 3) {
      throw new ValidationError(
        'Postal code must be at least 3 characters',
        'postalCode'
      );
    }

    if (cleaned.length > 10) {
      throw new ValidationError(
        'Postal code must be less than 10 characters',
        'postalCode'
      );
    }

    return cleaned;
  },
};

module.exports = { ValidationError, orderValidation };
```

---

## 🎯 Validation Patterns

### Pattern 1: Form Validation

```tsx
"use client";
import { z } from "zod";
import { useState } from "react";
import toast from "react-hot-toast";

const formSchema = z.object({
  title: z.string().min(3).max(100),
  price: z.number().min(0).max(1000000),
});

const ProductForm = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      title: formData.get("title") as string,
      price: parseFloat(formData.get("price") as string),
    };
    
    // Validate
    const result = formSchema.safeParse(data);
    
    if (!result.success) {
      // Show errors
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    
    // Submit to API
    toast.success("Valid!");
    setErrors({});
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input name="title" />
      {errors.title && <p className="error">{errors.title}</p>}
      
      <input name="price" type="number" />
      {errors.price && <p className="error">{errors.price}</p>}
      
      <button type="submit">Submit</button>
    </form>
  );
};
```

### Pattern 2: API Route Validation

```typescript
// app/api/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { handleApiError } from "@/utils/errorHandler";
import { sanitizeInput } from "@/utils/validation";
import prisma from "@/utils/db";

const productSchema = z.object({
  title: z.string().min(3).max(100),
  price: z.number().min(0),
  description: z.string().min(10).max(5000),
  categoryId: z.string().uuid(),
  inStock: z.number().int().min(0),
});

export async function POST(request: NextRequest) {
  try {
    // 1. Parse JSON
    const body = await sanitizeInput.validateJsonInput(request);
    
    // 2. Validate with Zod
    const validatedData = productSchema.parse(body);
    
    // 3. Sanitize strings
    const sanitized = {
      ...validatedData,
      title: sanitizeInput.sanitizeString(validatedData.title),
      description: sanitizeInput.sanitizeString(validatedData.description),
    };
    
    // 4. Create product
    const product = await prisma.product.create({
      data: sanitized,
    });
    
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
```

### Pattern 3: Nested Object Validation

```typescript
const orderSchema = z.object({
  customer: z.object({
    name: z.string().min(2).max(50),
    email: z.string().email(),
    phone: z.string().min(10).max(20),
  }),
  shipping: z.object({
    address: z.string().min(5),
    city: z.string().min(2),
    postalCode: z.string().min(3).max(10),
    country: z.string().min(2),
  }),
  items: z.array(
    z.object({
      productId: z.string().uuid(),
      quantity: z.number().int().min(1).max(100),
    })
  ).min(1, "Order must have at least one item"),
});

// Type inference
type Order = z.infer<typeof orderSchema>;
```

---

## 🛠️ Custom Validators

### Custom Zod Validator

```typescript
import { z } from "zod";

// Custom credit card validator
const creditCardSchema = z
  .string()
  .min(13)
  .max(19)
  .refine(
    (value) => {
      // Luhn algorithm for credit card validation
      const digits = value.replace(/\D/g, "");
      let sum = 0;
      let isEven = false;
      
      for (let i = digits.length - 1; i >= 0; i--) {
        let digit = parseInt(digits[i]);
        
        if (isEven) {
          digit *= 2;
          if (digit > 9) {
            digit -= 9;
          }
        }
        
        sum += digit;
        isEven = !isEven;
      }
      
      return sum % 10 === 0;
    },
    { message: "Invalid credit card number" }
  );

// Custom slug validator
const slugSchema = z
  .string()
  .min(1)
  .max(200)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format")
  .refine(
    async (slug) => {
      // Check if slug already exists in database
      const existing = await prisma.product.findUnique({
        where: { slug },
      });
      return !existing;
    },
    { message: "Slug already exists" }
  );
```

### Custom Function Validator

```typescript
// utils/customValidators.ts

export const validatePassword = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push("Password must be at least 8 characters");
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain uppercase letter");
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain lowercase letter");
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain number");
  }
  
  if (!/[@$!%*?&]/.test(password)) {
    errors.push("Password must contain special character");
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Usage
const result = validatePassword("weak");
if (!result.isValid) {
  console.log("Errors:", result.errors);
}
```

---

## 🔒 Security Best Practices

### 1. Input Validation

✅ **DO:**
- Always validate on server-side
- Use strong validation libraries (Zod)
- Whitelist allowed characters
- Set min/max length limits
- Validate data types

❌ **DON'T:**
- Trust client-side validation alone
- Allow arbitrary input
- Use regex only (combine with type checking)

### 2. Sanitization

✅ **DO:**
- Sanitize all user inputs
- Use DOMPurify for HTML
- Remove XSS patterns
- Encode special characters

❌ **DON'T:**
- Store unsanitized data
- Trust user input
- Use innerHTML without sanitization

### 3. Error Messages

✅ **DO:**
- Show clear, helpful errors
- Log detailed errors on server
- Return generic errors to client

❌ **DON'T:**
- Expose stack traces to client
- Reveal database structure
- Show sensitive information

### 4. Rate Limiting

```typescript
// Implement rate limiting for API routes
import { commonValidations } from "@/utils/validation";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  
  // Check rate limit
  if (!commonValidations.checkRateLimit(ip, 5, 15 * 60 * 1000)) {
    return NextResponse.json(
      { message: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }
  
  // Process request...
}
```

### 5. HTTPS Only

```typescript
// next.config.mjs
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
        ],
      },
    ];
  },
};
```

---

## 📊 Summary: Validation Checklist

### Client-Side

- [ ] HTML5 validation (required, minLength, maxLength)
- [ ] Real-time validation feedback
- [ ] Clear error messages
- [ ] Disabled submit during validation

### Server-Side

- [ ] Zod schema validation
- [ ] Sanitization (XSS protection)
- [ ] Business logic validation
- [ ] Error handling
- [ ] Rate limiting
- [ ] Request size limits

### Security

- [ ] Never trust client input
- [ ] Always validate on server
- [ ] Sanitize all inputs
- [ ] Use prepared statements (Prisma)
- [ ] Implement rate limiting
- [ ] Use HTTPS in production

---

**📌 Next Steps:**

Lanjutkan ke dokumentasi berikutnya:
- 🗄️ **[05-DATABASE-PRISMA.md](./05-DATABASE-PRISMA.md)** - Database schema & relationships lengkap
- 📈 **[06-UPGRADE-LIBRARIES.md](./06-UPGRADE-LIBRARIES.md)** - Panduan upgrade libraries

