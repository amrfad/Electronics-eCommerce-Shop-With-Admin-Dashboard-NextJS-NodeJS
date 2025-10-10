# 🔐 Authentication & Authorization

> **Dokumentasi Lengkap**: Setup NextAuth, JWT Tokens, Session Management, Role-Based Access Control

---

## 📑 Daftar Isi

- [Konsep Dasar](#konsep-dasar)
- [NextAuth Setup](#nextauth-setup)
- [Credential Provider](#credential-provider)
- [OAuth Providers (GitHub, Google)](#oauth-providers)
- [JWT Tokens & Session](#jwt-tokens--session)
- [Session Timeout](#session-timeout)
- [Middleware & Protected Routes](#middleware--protected-routes)
- [Role-Based Access Control](#role-based-access-control)
- [Login & Register Flow](#login--register-flow)
- [Security Best Practices](#security-best-practices)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Konsep Dasar

### Authentication vs Authorization

| **Authentication** | **Authorization** |
|-------------------|------------------|
| Siapa Anda? (Identity) | Apa yang boleh Anda lakukan? (Permission) |
| Login dengan email/password | User vs Admin |
| JWT Token | Role-based access |

### Flow Diagram

```
┌──────────────┐
│   Browser    │
└──────┬───────┘
       │ 1. Login (email, password)
       ↓
┌──────────────┐
│  NextAuth.js │
└──────┬───────┘
       │ 2. Verify credentials
       ↓
┌──────────────┐
│   Database   │ ← Check user exists & password match
└──────┬───────┘
       │ 3. User found
       ↓
┌──────────────┐
│  JWT Token   │ ← Generate token dengan role & id
└──────┬───────┘
       │ 4. Send token
       ↓
┌──────────────┐
│   Session    │ ← Store di cookies (httpOnly)
└──────┬───────┘
       │ 5. Access protected routes
       ↓
┌──────────────┐
│  Middleware  │ ← Check role (user/admin)
└──────────────┘
```

---

## ⚙️ NextAuth Setup

### 1. Instalasi

NextAuth sudah terinstall di project:

```json
// package.json
{
  "dependencies": {
    "next-auth": "^4.24.11"
  }
}
```

### 2. Environment Variables

```env
# .env
NEXTAUTH_SECRET="your-super-secret-key-change-this"
NEXTAUTH_URL="http://localhost:3000"

# Optional: OAuth Providers
GITHUB_ID="your-github-oauth-client-id"
GITHUB_SECRET="your-github-oauth-client-secret"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 3. NextAuth Route Handler

**Lokasi:** `app/api/auth/[...nextauth]/route.ts`

```typescript
import NextAuth, { NextAuthOptions } from "next-auth";
import { Account, User as AuthUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import prisma from "@/utils/db";
import { nanoid } from "nanoid";

export const authOptions: NextAuthOptions = {
  // Providers configuration
  providers: [
    // 1. Email/Password (Credentials)
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any) {
        try {
          // Find user by email
          const user = await prisma.user.findFirst({
            where: { email: credentials.email },
          });
          
          if (user) {
            // Compare password with hashed password
            const isPasswordCorrect = await bcrypt.compare(
              credentials.password,
              user.password!
            );
            
            if (isPasswordCorrect) {
              return {
                id: user.id,
                email: user.email,
                role: user.role,
              };
            }
          }
        } catch (err: any) {
          throw new Error(err);
        }
        
        return null; // Login failed
      },
    }),
    
    // 2. GitHub OAuth (Opsional)
    // GithubProvider({
    //   clientId: process.env.GITHUB_ID!,
    //   clientSecret: process.env.GITHUB_SECRET!,
    // }),
    
    // 3. Google OAuth (Opsional)
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID!,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    // }),
  ],
  
  // Callbacks
  callbacks: {
    // Called on successful sign in
    async signIn({ user, account }: { user: AuthUser; account: Account }) {
      if (account?.provider === "credentials") {
        return true;
      }
      
      // Handle OAuth providers (GitHub, Google)
      if (account?.provider === "github" || account?.provider === "google") {
        try {
          // Check if user exists
          const existingUser = await prisma.user.findFirst({
            where: { email: user.email! },
          });
          
          if (!existingUser) {
            // Create new user for OAuth
            await prisma.user.create({
              data: {
                id: nanoid(),
                email: user.email!,
                role: "user", // Default role
                password: null, // OAuth users don't have passwords
              },
            });
          }
          
          return true;
        } catch (error) {
          console.error("Error in signIn callback:", error);
          return false;
        }
      }
      
      return true;
    },
    
    // Called whenever a JWT is created or updated
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.iat = Math.floor(Date.now() / 1000); // Issued at time
      }
      
      // Check if token is expired (15 minutes)
      const now = Math.floor(Date.now() / 1000);
      const tokenAge = now - (token.iat as number);
      const maxAge = 15 * 60; // 15 minutes
      
      if (tokenAge > maxAge) {
        // Token expired, force re-authentication
        return {};
      }
      
      return token;
    },
    
    // Called whenever session is checked
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  
  // Pages
  pages: {
    signIn: '/login',
    error: '/login', // Redirect to login on errors
  },
  
  // Session configuration
  session: {
    strategy: "jwt",
    maxAge: 15 * 60, // 15 minutes
    updateAge: 5 * 60, // Update every 5 minutes
  },
  
  // JWT configuration
  jwt: {
    maxAge: 15 * 60, // 15 minutes
  },
  
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};

// Export handlers for GET and POST
export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

### 4. NextAuth Provider Wrapper

**Lokasi:** `Providers.tsx`

```tsx
"use client";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <Toaster position="top-right" />
    </SessionProvider>
  );
}
```

**Digunakan di Root Layout:**

```tsx
// app/layout.tsx
import { Providers } from "@/Providers";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
```

---

## 🔑 Credential Provider

### Register New User

**Lokasi:** `app/api/register/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import { registrationSchema } from "@/utils/schema";
import { handleApiError } from "@/utils/errorHandler";
import { sanitizeInput } from "@/utils/validation";

export async function POST(request: NextRequest) {
  try {
    // 1. Parse & validate request body
    const body = await sanitizeInput.validateJsonInput(request);
    
    // 2. Validate with Zod schema
    const validatedData = registrationSchema.parse(body);
    
    // 3. Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: { email: validatedData.email },
    });
    
    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 409 }
      );
    }
    
    // 4. Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);
    
    // 5. Create user
    const newUser = await prisma.user.create({
      data: {
        id: nanoid(),
        email: validatedData.email,
        password: hashedPassword,
        role: "user", // Default role
      },
    });
    
    return NextResponse.json(
      {
        message: "User registered successfully",
        user: {
          id: newUser.id,
          email: newUser.email,
          role: newUser.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
```

### Login Page

**Lokasi:** `app/login/page.tsx`

```tsx
"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false, // Don't auto redirect
      });
      
      if (result?.error) {
        toast.error("Invalid email or password");
      } else {
        toast.success("Login successful!");
        router.push("/"); // Redirect to homepage
        router.refresh();
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-8">Login</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 block w-full rounded-md border px-3 py-2"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 block w-full rounded-md border px-3 py-2"
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? "Loading..." : "Sign In"}
          </button>
        </form>
        
        <p className="mt-4 text-center text-sm">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-600 hover:underline">
            Register here
          </a>
        </p>
      </div>
    </div>
  );
}
```

### Register Page

**Lokasi:** `app/register/page.tsx`

```tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import apiClient from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    
    try {
      const response = await apiClient.post("/api/register", {
        email,
        password,
      });
      
      if (response.ok) {
        toast.success("Registration successful! Please login.");
        router.push("/login");
      } else {
        const data = await response.json();
        toast.error(data.message || "Registration failed");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-8">Register</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 block w-full rounded-md border px-3 py-2"
            />
            <p className="mt-1 text-xs text-gray-500">
              Must be a valid email address
            </p>
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              className="mt-1 block w-full rounded-md border px-3 py-2"
            />
            <p className="mt-1 text-xs text-gray-500">
              Must be at least 8 characters with uppercase, lowercase, number, and special character
            </p>
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? "Loading..." : "Register"}
          </button>
        </form>
        
        <p className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
}
```

---

## 🌐 OAuth Providers

### 1. GitHub OAuth

#### Step 1: Buat GitHub OAuth App

1. Pergi ke [GitHub Settings](https://github.com/settings/developers)
2. Klik **OAuth Apps** → **New OAuth App**
3. Isi form:
   - **Application name**: Your App Name
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
4. Klik **Register application**
5. Copy **Client ID** dan generate **Client Secret**

#### Step 2: Tambahkan ke `.env`

```env
GITHUB_ID="your-github-client-id"
GITHUB_SECRET="your-github-client-secret"
```

#### Step 3: Aktifkan Provider

```typescript
// app/api/auth/[...nextauth]/route.ts
GithubProvider({
  clientId: process.env.GITHUB_ID!,
  clientSecret: process.env.GITHUB_SECRET!,
}),
```

#### Step 4: Tambahkan Button di Login Page

```tsx
<button onClick={() => signIn("github")}>
  Sign in with GitHub
</button>
```

### 2. Google OAuth

#### Step 1: Buat Google OAuth Credentials

1. Pergi ke [Google Cloud Console](https://console.cloud.google.com/)
2. Buat project baru atau pilih existing
3. Enable **Google+ API**
4. Pergi ke **Credentials** → **Create Credentials** → **OAuth client ID**
5. Application type: **Web application**
6. Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
7. Copy **Client ID** dan **Client Secret**

#### Step 2: Tambahkan ke `.env`

```env
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

#### Step 3: Aktifkan Provider

```typescript
// app/api/auth/[...nextauth]/route.ts
GoogleProvider({
  clientId: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
}),
```

#### Step 4: Tambahkan Button di Login Page

```tsx
<button onClick={() => signIn("google")}>
  Sign in with Google
</button>
```

---

## 🎫 JWT Tokens & Session

### JWT Token Structure

```json
{
  "user": {
    "email": "user@example.com",
    "id": "abc123",
    "role": "user"
  },
  "iat": 1704067200,  // Issued at (timestamp)
  "exp": 1704068100,  // Expires at (15 minutes later)
  "jti": "xyz789"     // JWT ID (unique)
}
```

### JWT Callback (Token Creation)

```typescript
async jwt({ token, user }) {
  if (user) {
    // First time JWT created (login)
    token.role = user.role;
    token.id = user.id;
    token.iat = Math.floor(Date.now() / 1000);
  }
  
  // Check token expiration
  const now = Math.floor(Date.now() / 1000);
  const tokenAge = now - (token.iat as number);
  const maxAge = 15 * 60; // 15 minutes
  
  if (tokenAge > maxAge) {
    // Token expired, return empty to force re-login
    return {};
  }
  
  return token;
}
```

### Session Callback (Session Access)

```typescript
async session({ session, token }) {
  if (token) {
    // Add custom fields to session
    session.user.role = token.role as string;
    session.user.id = token.id as string;
  }
  return session;
}
```

### Accessing Session in Components

#### Client Component:

```tsx
"use client";
import { useSession } from "next-auth/react";

export default function MyComponent() {
  const { data: session, status } = useSession();
  
  if (status === "loading") {
    return <p>Loading...</p>;
  }
  
  if (status === "unauthenticated") {
    return <p>Please login</p>;
  }
  
  return (
    <div>
      <p>Welcome, {session?.user?.email}</p>
      <p>Role: {session?.user?.role}</p>
    </div>
  );
}
```

#### Server Component:

```tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function MyServerComponent() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return <p>Not authenticated</p>;
  }
  
  return (
    <div>
      <p>Welcome, {session.user?.email}</p>
      <p>Role: {session.user?.role}</p>
    </div>
  );
}
```

---

## ⏱️ Session Timeout

### Configuration

**Session expires after 15 minutes of inactivity:**

```typescript
// app/api/auth/[...nextauth]/route.ts
session: {
  strategy: "jwt",
  maxAge: 15 * 60, // 15 minutes
  updateAge: 5 * 60, // Update every 5 minutes
},
jwt: {
  maxAge: 15 * 60, // 15 minutes
},
```

### Custom Session Timeout Hook

**Lokasi:** `hooks/useSessionTimeout.ts`

```typescript
import { useEffect, useCallback, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import toast from "react-hot-toast";

export const useSessionTimeout = () => {
  const { data: session, status } = useSession();
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  
  const TIMEOUT_DURATION = 15 * 60 * 1000; // 15 minutes
  const WARNING_BEFORE = 2 * 60 * 1000; // Warn 2 minutes before
  
  const handleLogout = useCallback(async () => {
    toast.error("Session expired. Please login again.");
    await signOut({ redirect: true, callbackUrl: "/login" });
  }, []);
  
  const resetTimer = useCallback(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    // Show warning 2 minutes before timeout
    const warningTimeout = setTimeout(() => {
      toast("Your session will expire in 2 minutes", {
        icon: "⚠️",
        duration: 5000,
      });
    }, TIMEOUT_DURATION - WARNING_BEFORE);
    
    // Logout after timeout
    const logoutTimeout = setTimeout(handleLogout, TIMEOUT_DURATION);
    
    setTimeoutId(logoutTimeout);
    
    return () => {
      clearTimeout(warningTimeout);
      clearTimeout(logoutTimeout);
    };
  }, [handleLogout, timeoutId]);
  
  useEffect(() => {
    if (status === "authenticated") {
      resetTimer();
      
      // Reset timer on user activity
      const events = ["mousedown", "keypress", "scroll", "touchstart"];
      events.forEach((event) => {
        document.addEventListener(event, resetTimer);
      });
      
      return () => {
        events.forEach((event) => {
          document.removeEventListener(event, resetTimer);
        });
      };
    }
  }, [status, resetTimer]);
};
```

**Usage:**

```tsx
"use client";
import { useSessionTimeout } from "@/hooks/useSessionTimeout";

export default function MyApp({ children }) {
  useSessionTimeout(); // Automatically handle session timeout
  
  return <div>{children}</div>;
}
```

---

## 🛡️ Middleware & Protected Routes

### Middleware Setup

**Lokasi:** `middleware.ts` (root directory)

```typescript
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Check for admin routes
    if (req.nextUrl.pathname.startsWith("/admin")) {
      if (req.nextauth.token?.role !== "admin") {
        // Not admin, redirect to homepage
        return NextResponse.redirect(new URL("/", req.url));
      }
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Admin routes require admin token
        if (req.nextUrl.pathname.startsWith("/admin")) {
          return !!token && token.role === "admin";
        }
        return true;
      },
    },
  }
);

// Specify which routes to protect
export const config = {
  matcher: ["/admin/:path*"]
};
```

### Protect Specific Routes

```typescript
// middleware.ts
export const config = {
  matcher: [
    "/admin/:path*",      // All admin routes
    "/checkout",          // Checkout page
    "/wishlist",          // Wishlist page
    "/api/wishlist/:path*", // Wishlist API
  ]
};
```

### Conditional UI Based on Auth

```tsx
"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Header() {
  const { data: session } = useSession();
  
  return (
    <header>
      {session ? (
        <>
          <p>Welcome, {session.user?.email}</p>
          {session.user?.role === "admin" && (
            <Link href="/admin">Admin Dashboard</Link>
          )}
          <button onClick={() => signOut()}>Logout</button>
        </>
      ) : (
        <>
          <Link href="/login">Login</Link>
          <Link href="/register">Register</Link>
        </>
      )}
    </header>
  );
}
```

---

## 👥 Role-Based Access Control

### Database Schema

```prisma
// prisma/schema.prisma
model User {
  id       String   @id @default(uuid())
  email    String   @unique
  password String?
  role     String?  @default("user") // "user" or "admin"
}
```

### Check Role in Component

```tsx
"use client";
import { useSession } from "next-auth/react";

export default function AdminPanel() {
  const { data: session } = useSession();
  
  if (session?.user?.role !== "admin") {
    return <p>Access Denied. Admin only.</p>;
  }
  
  return (
    <div>
      <h1>Admin Panel</h1>
      {/* Admin content */}
    </div>
  );
}
```

### Check Role in API Route

```typescript
// app/api/admin/users/route.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  
  // Check if user is authenticated
  if (!session) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }
  
  // Check if user is admin
  if (session.user?.role !== "admin") {
    return NextResponse.json(
      { message: "Forbidden. Admin only." },
      { status: 403 }
    );
  }
  
  // Admin logic here
  const users = await prisma.user.findMany();
  return NextResponse.json({ users });
}
```

### Create Admin User

**Via Prisma Studio:**
```bash
npx prisma studio
```
1. Buka table `User`
2. Buat user baru atau edit existing
3. Set `role` menjadi `"admin"`

**Via SQL:**
```sql
UPDATE User SET role = 'admin' WHERE email = 'admin@example.com';
```

**Via API (dengan password):**
```typescript
const hashedPassword = await bcrypt.hash("admin123", 10);

await prisma.user.create({
  data: {
    id: nanoid(),
    email: "admin@example.com",
    password: hashedPassword,
    role: "admin",
  },
});
```

---

## 🔄 Login & Register Flow

### Complete Login Flow

```
User → Enter email & password
  ↓
Frontend → signIn("credentials", { email, password })
  ↓
NextAuth → CredentialsProvider.authorize()
  ↓
Database → Find user by email
  ↓
bcrypt → Compare password
  ↓
JWT → Generate token with user data
  ↓
Session → Store in cookies (httpOnly, secure)
  ↓
Redirect → Homepage or dashboard
```

### Complete Register Flow

```
User → Enter email & password
  ↓
Frontend → POST /api/register
  ↓
Validation → Zod schema validation
  ↓
Sanitization → Remove XSS
  ↓
Database → Check if email exists
  ↓
bcrypt → Hash password
  ↓
Database → Create new user
  ↓
Redirect → Login page
```

---

## 🔒 Security Best Practices

### 1. Password Security

✅ **DO:**
- Hash passwords dengan bcrypt (cost factor 10+)
- Validate password strength (min 8 chars, uppercase, lowercase, number, special char)
- Never store plain text passwords
- Never log passwords

❌ **DON'T:**
- Store passwords in plain text
- Use weak hashing (MD5, SHA1)
- Return password in API responses

### 2. JWT Security

✅ **DO:**
- Use strong `NEXTAUTH_SECRET` (32+ characters random)
- Set short expiration time (15 minutes recommended)
- Store JWT in httpOnly cookies
- Validate JWT on every request

❌ **DON'T:**
- Store JWT in localStorage (XSS vulnerable)
- Use predictable secrets
- Never expire tokens
- Trust client-side token validation

### 3. Session Security

✅ **DO:**
- Implement session timeout
- Refresh tokens periodically
- Logout on sensitive actions
- Clear session on logout

❌ **DON'T:**
- Use long session durations (> 24 hours)
- Store sensitive data in session
- Trust session without re-validation

### 4. API Security

✅ **DO:**
- Validate all inputs with Zod
- Sanitize inputs (XSS protection)
- Check authentication on every API route
- Use HTTPS in production
- Rate limit API endpoints

❌ **DON'T:**
- Trust client-side validation alone
- Expose sensitive errors to client
- Allow SQL injection
- Return stack traces in production

---

## 🔧 Troubleshooting

### Problem 1: Session tidak tersimpan

**Symptoms:**
- Login berhasil tapi langsung logout
- `useSession()` return null

**Solutions:**
```bash
# 1. Cek NEXTAUTH_SECRET sudah di-set
echo $NEXTAUTH_SECRET

# 2. Cek NEXTAUTH_URL correct
NEXTAUTH_URL="http://localhost:3000"

# 3. Clear cookies & restart server
# Ctrl+C, lalu:
npm run dev

# 4. Cek browser cookies
# Chrome DevTools → Application → Cookies
# Harus ada: next-auth.session-token
```

### Problem 2: "Invalid token"

**Solutions:**
```typescript
// Cek JWT callback return value
async jwt({ token, user }) {
  console.log("JWT callback:", { token, user });
  
  // Make sure return token, not {}
  return token;
}
```

### Problem 3: Redirect loop

**Solutions:**
```typescript
// middleware.ts
// Jangan protect login/register page!
export const config = {
  matcher: [
    "/admin/:path*",
    // ❌ JANGAN: "/login", "/register"
  ]
};
```

### Problem 4: OAuth provider error

**Solutions:**
```bash
# 1. Cek environment variables
echo $GITHUB_ID
echo $GITHUB_SECRET

# 2. Cek callback URL di OAuth provider
# Harus exact match:
# http://localhost:3000/api/auth/callback/github

# 3. Restart server setelah add env variables
```

### Problem 5: Role tidak tersimpan

**Solutions:**
```typescript
// Pastikan role di-add ke JWT token
async jwt({ token, user }) {
  if (user) {
    token.role = user.role; // ← IMPORTANT!
  }
  return token;
}

// Pastikan role di-add ke session
async session({ session, token }) {
  if (token) {
    session.user.role = token.role; // ← IMPORTANT!
  }
  return session;
}
```

---

## 📊 Summary: Authentication Checklist

- [ ] NextAuth installed & configured
- [ ] `NEXTAUTH_SECRET` generated & set
- [ ] `NEXTAUTH_URL` configured
- [ ] Credential provider setup
- [ ] Register API route created
- [ ] Login page created
- [ ] Register page created
- [ ] JWT callbacks configured
- [ ] Session callbacks configured
- [ ] Middleware untuk protected routes
- [ ] Role-based access control
- [ ] Session timeout implemented
- [ ] Logout functionality
- [ ] OAuth providers (opsional)

---

**📌 Next Steps:**

Lanjutkan ke dokumentasi berikutnya:
- ✅ **[04-VALIDASI-DATA.md](./04-VALIDASI-DATA.md)** - Validasi & sanitization lengkap
- 🗄️ **[05-DATABASE-PRISMA.md](./05-DATABASE-PRISMA.md)** - Database schema & relationships

