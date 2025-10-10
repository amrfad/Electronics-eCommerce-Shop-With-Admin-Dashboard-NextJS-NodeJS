# 🔄 UPGRADE LIBRARIES - PANDUAN LENGKAP

**Panduan Upgrade React, Next.js, Prisma, NextAuth, TailwindCSS & Dependencies Lainnya**

---

## 📑 Daftar Isi

1. [Persiapan Upgrade](#1-persiapan-upgrade)
2. [Cek Versi Saat Ini](#2-cek-versi-saat-ini)
3. [Upgrade React](#3-upgrade-react)
4. [Upgrade Next.js](#4-upgrade-nextjs)
5. [Upgrade Prisma](#5-upgrade-prisma)
6. [Upgrade NextAuth](#6-upgrade-nextauth)
7. [Upgrade TailwindCSS](#7-upgrade-tailwindcss)
8. [Upgrade Dependencies Lainnya](#8-upgrade-dependencies-lainnya)
9. [Testing Setelah Upgrade](#9-testing-setelah-upgrade)
10. [Rollback Strategy](#10-rollback-strategy)
11. [Troubleshooting](#11-troubleshooting)

---

## 1. Persiapan Upgrade

### 1.1 Checklist Sebelum Upgrade

**✅ Wajib Dilakukan:**

- [ ] **Backup database** (export SQL)
- [ ] **Commit semua perubahan** ke Git
- [ ] **Buat branch baru** untuk upgrade
- [ ] **Baca changelog** library yang akan diupgrade
- [ ] **Test di development** dulu, **jangan langsung production**
- [ ] **Catat versi sekarang** (untuk rollback)

### 1.2 Backup Database

```bash
# MySQL dump
mysqldump -u root -p ecommerce_db > backup_$(date +%Y%m%d).sql

# Atau pakai Prisma Studio
npx prisma studio
# Manual export data
```

### 1.3 Git Workflow

```bash
# 1. Commit current state
git add .
git commit -m "chore: backup before upgrade libraries"

# 2. Buat branch upgrade
git checkout -b feature/upgrade-libraries

# 3. Push ke remote
git push -u origin feature/upgrade-libraries
```

### 1.4 Catat Versi Sekarang

**📁 File:** `package.json`

```json
{
  "dependencies": {
    "next": "^15.5.3",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "@prisma/client": "^6.16.1",
    "next-auth": "^4.24.11",
    "tailwindcss": "^3.3.0"
  }
}
```

**💾 Simpan info ini untuk rollback!**

---

## 2. Cek Versi Saat Ini

### 2.1 Versi Library di Package.json

**Versi Saat Ini (Project Ini):**

| Library | Versi Sekarang | Kategori |
|---------|----------------|----------|
| **React** | 18.3.1 | Frontend Framework |
| **Next.js** | 15.5.3 | Full-stack Framework |
| **Prisma** | 6.16.1 | ORM |
| **NextAuth** | 4.24.11 | Authentication |
| **TailwindCSS** | 3.3.0 | CSS Framework |
| **Zod** | 3.22.4 | Validation |
| **Zustand** | 4.5.1 | State Management |
| **TypeScript** | 5.9.2 | Language |

### 2.2 Cek Versi Terbaru

```bash
# Cek semua outdated packages
npm outdated

# Atau pakai Yarn
yarn outdated

# Output example:
Package       Current  Wanted  Latest  Location
next          15.5.3   15.5.3  16.0.2  node_modules/next
react         18.3.1   18.3.1  19.0.0  node_modules/react
prisma        6.16.1   6.16.1  7.2.0   node_modules/prisma
```

### 2.3 Cek Breaking Changes

Sebelum upgrade, **wajib** baca:

- [Next.js Upgrade Guide](https://nextjs.org/docs/app/building-your-application/upgrading)
- [React 19 Changelog](https://react.dev/blog/2024/04/25/react-19)
- [Prisma Release Notes](https://github.com/prisma/prisma/releases)
- [NextAuth.js Migration](https://authjs.dev/getting-started/migrating-to-v5)
- [TailwindCSS Upgrade Guide](https://tailwindcss.com/docs/upgrade-guide)

---

## 3. Upgrade React

### 3.1 React 18 → React 19

**⚠️ React 19 masih dalam Beta (per 2024)!** Tunggu stable release.

**Jika tetap ingin upgrade:**

```bash
npm install react@rc react-dom@rc
```

### 3.2 Breaking Changes React 19

#### 1️⃣ Automatic Batching

```javascript
// React 18: Manual batching di event handler
function handleClick() {
  setCount(c => c + 1)
  setFlag(f => !f)
  // Batched automatically
}

// React 19: Batched di semua tempat (termasuk promises, setTimeout)
fetch('/api').then(() => {
  setCount(c => c + 1)
  setFlag(f => !f)
  // ✨ Auto-batched di React 19
})
```

#### 2️⃣ New Hook: `use()`

```javascript
// React 19: Read context with use()
import { use } from 'react'

function Component() {
  const theme = use(ThemeContext) // ✨ New!
  return <div style={{ color: theme.color }} />
}
```

#### 3️⃣ Server Components Improvements

```javascript
// React 19: Better server component support
async function ServerComponent() {
  const data = await fetch('/api/data')
  return <div>{data}</div>
}
```

### 3.3 Upgrade React 18.x (Minor Versions)

**Aman untuk upgrade patch/minor versions:**

```bash
# Dari 18.3.1 → 18.3.x (latest patch)
npm install react@18 react-dom@18

# Atau specific version
npm install react@18.3.5 react-dom@18.3.5
```

### 3.4 Update React Types

```bash
# Update React TypeScript types
npm install --save-dev @types/react@18 @types/react-dom@18

# Atau latest
npm install --save-dev @types/react@latest @types/react-dom@latest
```

### 3.5 Testing React Upgrade

```javascript
// Test file: __tests__/react-version.test.js
import React from 'react'

console.log('React version:', React.version)
// Output: "18.3.1"
```

---

## 4. Upgrade Next.js

### 4.1 Next.js 15 → Next.js 16

**⚠️ Next.js 16 belum release (per early 2025).**

**Current stable:** Next.js 15.5.x

### 4.2 Upgrade Minor Version (15.5.3 → 15.6.x)

```bash
# Upgrade ke latest 15.x
npm install next@15

# Atau specific version
npm install next@15.6.0
```

### 4.3 Breaking Changes Next.js 15

#### 1️⃣ Async Request APIs (Breaking Change!)

**Next.js 15** membuat beberapa API menjadi **async**:

```typescript
// ❌ LAMA (Next.js 14 dan sebelumnya):
export default function Page({ params, searchParams }) {
  const { id } = params        // Sync
  const { query } = searchParams // Sync
}

// ✅ BARU (Next.js 15+):
export default async function Page({ params, searchParams }) {
  const { id } = await params        // Async!
  const { query } = await searchParams // Async!
}
```

**📁 Update di Project:**

Cari semua file yang pakai `params` atau `searchParams`:

```bash
# Search files
grep -r "params\|searchParams" app/
```

Contoh update:

**📁 File:** `app/product/[slug]/page.tsx`

```typescript
// ❌ LAMA:
export default function ProductPage({ params }: { params: { slug: string } }) {
  const { slug } = params
}

// ✅ BARU:
export default async function ProductPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params
}
```

#### 2️⃣ Caching Changes

```typescript
// Next.js 15: fetch() tidak cached by default
const data = await fetch('/api/data') // Not cached

// Untuk cache, tambahkan option:
const data = await fetch('/api/data', {
  cache: 'force-cache' // Explicitly cache
})
```

#### 3️⃣ Image Component Changes

```typescript
// Next.js 15: alt attribute wajib
import Image from 'next/image'

<Image 
  src="/photo.jpg" 
  width={500} 
  height={300}
  alt="Description" // ✅ Wajib!
/>
```

### 4.4 Update Next.js Config

**📁 File:** `next.config.mjs`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next.js 15 config
  reactStrictMode: true,
  
  // Experimental features (jika ada)
  experimental: {
    // serverActions: true, // Deprecated di Next.js 15
  },

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}

export default nextConfig
```

### 4.5 Update ESLint Config

```bash
# Update ESLint Next.js
npm install --save-dev eslint-config-next@15
```

### 4.6 Codemod untuk Migration

Next.js menyediakan **codemod** untuk auto-migrate code:

```bash
# Jalankan codemod
npx @next/codemod@latest upgrade

# Atau specific codemod:
npx @next/codemod@latest next-async-request-api
```

---

## 5. Upgrade Prisma

### 5.1 Prisma 6 → Prisma 7

**⚠️ Prisma 7 masih development (per 2025).**

**Current stable:** Prisma 6.16.x

### 5.2 Upgrade Minor Version (6.16.1 → 6.x.x)

```bash
# Upgrade Prisma CLI dan Client sekaligus
npm install prisma@6 @prisma/client@6

# Atau latest patch
npm install prisma@latest @prisma/client@latest
```

**⚠️ PENTING:** Versi `prisma` dan `@prisma/client` **harus sama**!

```json
{
  "dependencies": {
    "@prisma/client": "^6.16.1" // ✅ Same version
  },
  "devDependencies": {
    "prisma": "^6.16.1" // ✅ Same version
  }
}
```

### 5.3 Regenerate Prisma Client

**Wajib setelah upgrade:**

```bash
# 1. Generate ulang client
npx prisma generate

# 2. Check database connection
npx prisma db pull

# 3. Test migration
npx prisma migrate dev
```

### 5.4 Breaking Changes Prisma 6

#### 1️⃣ TypedSQL (New Feature)

```typescript
// Prisma 6: TypedSQL support
import { sql } from '@prisma/client/sql'

const result = await prisma.$queryRawTyped(
  sql`SELECT * FROM Product WHERE price > ${1000}`
)
```

#### 2️⃣ Improved Error Messages

```typescript
// Prisma 6: Better error messages
try {
  await prisma.product.create({ data: {} })
} catch (error) {
  // Error messages lebih detail di Prisma 6
  console.log(error.message)
}
```

#### 3️⃣ Performance Improvements

Prisma 6 lebih cepat:
- Query optimization
- Smaller client bundle size
- Faster cold starts

### 5.5 Update Prisma Schema

**Tidak ada breaking changes di schema format**, tapi bisa pakai fitur baru:

```prisma
// Prisma 6: New features
model Product {
  id    String @id @default(uuid(7)) // ✨ Shorter UUIDs
  title String @db.VarChar(255)     // Explicit DB type
}
```

### 5.6 Migration Strategy

```bash
# 1. Backup database
mysqldump -u root -p ecommerce_db > backup.sql

# 2. Upgrade Prisma
npm install prisma@latest @prisma/client@latest

# 3. Generate client
npx prisma generate

# 4. Check pending migrations
npx prisma migrate status

# 5. Apply migrations (development)
npx prisma migrate dev

# 6. Deploy migrations (production)
npx prisma migrate deploy
```

---

## 6. Upgrade NextAuth

### 6.1 NextAuth v4 → v5 (Auth.js)

**⚠️ BREAKING CHANGES BESAR!**

NextAuth v5 sekarang bernama **Auth.js** dengan perubahan signifikan.

### 6.2 Major Breaking Changes

| Fitur | NextAuth v4 | Auth.js v5 |
|-------|-------------|------------|
| **Package name** | `next-auth` | `@auth/nextjs` |
| **Config location** | `[...nextauth]/route.ts` | `auth.ts` (root) |
| **Import** | `import NextAuth from 'next-auth'` | `import NextAuth from '@auth/nextjs'` |
| **Session** | `getServerSession()` | `auth()` |
| **Middleware** | `withAuth()` | `middleware.ts` dengan `auth` export |

### 6.3 Migration Steps

#### Step 1: Install Auth.js v5

```bash
# Uninstall NextAuth v4
npm uninstall next-auth

# Install Auth.js v5
npm install @auth/nextjs@beta @auth/prisma-adapter@beta
```

#### Step 2: Buat auth.ts (Root Config)

**📁 Buat file baru:** `auth.ts` (di root project)

```typescript
import NextAuth from "@auth/nextjs"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import CredentialsProvider from "@auth/nextjs/providers/credentials"
import bcrypt from "bcryptjs"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string }
        })

        if (!user || !user.password) return null

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        )

        if (!isValid) return null

        return {
          id: user.id,
          email: user.email,
          role: user.role,
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },

  pages: {
    signIn: '/login',
  },
})
```

#### Step 3: Update API Route

**📁 File:** `app/api/auth/[...nextauth]/route.ts`

```typescript
// ❌ LAMA (NextAuth v4):
import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }

// ✅ BARU (Auth.js v5):
import { handlers } from "@/auth"

export const { GET, POST } = handlers
```

#### Step 4: Update Middleware

**📁 File:** `middleware.ts`

```typescript
// ❌ LAMA (NextAuth v4):
import { withAuth } from "next-auth/middleware"

export default withAuth({
  callbacks: {
    authorized({ req, token }) {
      if (req.nextUrl.pathname.startsWith('/admin')) {
        return token?.role === "admin"
      }
      return !!token
    },
  },
})

// ✅ BARU (Auth.js v5):
import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth
  const isAdmin = req.auth?.user?.role === "admin"

  if (pathname.startsWith('/admin') && !isAdmin) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/admin/:path*']
}
```

#### Step 5: Update Server Components

```typescript
// ❌ LAMA (NextAuth v4):
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export default async function Page() {
  const session = await getServerSession(authOptions)
  return <div>{session?.user?.email}</div>
}

// ✅ BARU (Auth.js v5):
import { auth } from "@/auth"

export default async function Page() {
  const session = await auth()
  return <div>{session?.user?.email}</div>
}
```

#### Step 6: Update Client Components

```typescript
// ❌ LAMA (NextAuth v4):
import { useSession, signIn, signOut } from "next-auth/react"

export default function Component() {
  const { data: session } = useSession()
  
  return (
    <button onClick={() => signIn()}>Login</button>
  )
}

// ✅ BARU (Auth.js v5):
import { useSession } from "@auth/nextjs/react"
import { signIn, signOut } from "@/auth"

export default function Component() {
  const { data: session } = useSession()
  
  return (
    <button onClick={() => signIn()}>Login</button>
  )
}
```

### 6.4 Tetap Pakai NextAuth v4 (Recommended untuk Saat Ini)

**Jika belum siap migrate ke v5:**

```bash
# Stay di v4, upgrade minor version saja
npm install next-auth@4

# Atau latest v4
npm install next-auth@^4.24.11
```

**✅ NextAuth v4 masih actively maintained sampai v5 stable.**

---

## 7. Upgrade TailwindCSS

### 7.1 TailwindCSS 3 → TailwindCSS 4

**⚠️ TailwindCSS v4 masih Alpha (per 2025).**

**Current stable:** TailwindCSS 3.4.x

### 7.2 Upgrade Minor Version (3.3.0 → 3.4.x)

```bash
# Upgrade Tailwind
npm install tailwindcss@3

# Atau latest 3.x
npm install tailwindcss@^3.4.0
```

### 7.3 Update Dependencies

```bash
# Update semua Tailwind plugins
npm install @tailwindcss/forms@latest
npm install @tailwindcss/typography@latest
npm install daisyui@latest
```

### 7.4 Breaking Changes Tailwind 3.4

#### 1️⃣ New Colors

```javascript
// tailwind.config.ts
colors: {
  // Tailwind 3.4 added:
  lime: colors.lime,
  cyan: colors.cyan,
  // ... more colors
}
```

#### 2️⃣ Dynamic Breakpoints

```css
/* Tailwind 3.4: Dynamic breakpoints */
@media (min-width: theme('screens.lg')) {
  /* Custom breakpoint */
}
```

### 7.5 Update Tailwind Config

**📁 File:** `tailwind.config.ts`

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'custom-yellow': '#FED700',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('daisyui'),
  ],
  daisyui: {
    themes: ["light", "dark", "cupcake"],
  },
}

export default config
```

### 7.6 Rebuild CSS

```bash
# Rebuild Tailwind CSS
npm run dev

# Atau build production
npm run build
```

---

## 8. Upgrade Dependencies Lainnya

### 8.1 Zod (Validation)

```bash
# Current: 3.22.4
# Latest: 3.24.x

npm install zod@latest
```

**Breaking changes:** Minimal (usually backward compatible).

### 8.2 Zustand (State Management)

```bash
# Current: 4.5.1
# Latest: 4.5.x

npm install zustand@latest
```

**Breaking changes:** None dalam minor versions.

### 8.3 TypeScript

```bash
# Current: 5.9.2
# Latest: 5.7.x (stable)

npm install --save-dev typescript@latest

# Check config compatibility
npx tsc --version
```

### 8.4 DOMPurify

```bash
# Current: 3.0.8
# Latest: 3.x.x

npm install dompurify@latest
npm install --save-dev @types/dompurify@latest
```

### 8.5 bcryptjs

```bash
# Current: 2.4.3
# Latest: 2.4.x

npm install bcryptjs@latest
npm install --save-dev @types/bcryptjs@latest
```

### 8.6 Update Semua Dependencies Sekaligus

```bash
# Check outdated
npm outdated

# Update semua (hati-hati!)
npm update

# Atau pakai npm-check-updates
npx npm-check-updates -u
npm install
```

---

## 9. Testing Setelah Upgrade

### 9.1 Testing Checklist

**✅ Wajib Test:**

- [ ] `npm run build` sukses
- [ ] `npm run dev` sukses
- [ ] Login/logout works
- [ ] Admin dashboard accessible
- [ ] Product CRUD operations
- [ ] Cart & Wishlist functionality
- [ ] Order creation
- [ ] Database queries working
- [ ] API routes responding
- [ ] No console errors
- [ ] TypeScript no errors

### 9.2 Build Test

```bash
# Test build
npm run build

# Expected output:
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages
✓ Finalizing page optimization

# Test production
npm run start
```

### 9.3 Development Test

```bash
# Run dev server
npm run dev

# Open browser
# Test all critical paths
```

### 9.4 Database Test

```bash
# Test Prisma
npx prisma generate
npx prisma migrate status

# Test query
npx prisma studio
# Manual check data
```

### 9.5 Type Check

```bash
# TypeScript type check
npx tsc --noEmit

# Expected: No errors
```

### 9.6 Lint Check

```bash
# ESLint check
npm run lint

# Expected: No errors
```

---

## 10. Rollback Strategy

### 10.1 Git Rollback

```bash
# 1. Check commits
git log --oneline

# 2. Rollback ke commit sebelum upgrade
git reset --hard <commit-hash>

# 3. Force push (jika sudah push)
git push --force
```

### 10.2 Package Rollback

```bash
# Rollback specific package
npm install next@15.5.3 --save-exact

# Rollback semua dari package-lock.json
npm ci

# Atau dari backup
cp package.json.backup package.json
npm install
```

### 10.3 Database Rollback

```bash
# Restore database dari backup
mysql -u root -p ecommerce_db < backup_20250315.sql

# Atau pakai Prisma migrate
npx prisma migrate reset
```

### 10.4 Full Rollback Procedure

```bash
# 1. Stop server
# Ctrl+C di terminal

# 2. Git rollback
git checkout feature/upgrade-libraries
git reset --hard HEAD~1  # Rollback 1 commit

# 3. Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# 4. Regenerate Prisma
npx prisma generate

# 5. Restore database
mysql -u root -p ecommerce_db < backup.sql

# 6. Restart
npm run dev
```

---

## 11. Troubleshooting

### 11.1 Error: "Cannot find module 'next'"

**Error:**
```
Error: Cannot find module 'next'
```

**Solusi:**

```bash
# Reinstall Next.js
npm install next@15

# Clear cache
rm -rf .next node_modules package-lock.json
npm install
```

### 11.2 Error: "Prisma Client version mismatch"

**Error:**
```
Prisma Client version mismatch
Expected: 6.16.1
Actual: 6.15.0
```

**Solusi:**

```bash
# Install matching versions
npm install prisma@6.16.1 @prisma/client@6.16.1 --save-exact

# Regenerate
npx prisma generate
```

### 11.3 Error: "NextAuth session undefined"

**Error:**
```
useSession() hook returns undefined
```

**Solusi:**

```tsx
// Pastikan ada SessionProvider
// app/layout.tsx
import { SessionProvider } from "next-auth/react"

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
```

### 11.4 Error: "Type error in params"

**Error:**
```
Type 'Params' is not assignable to type 'Promise<Params>'
```

**Solusi:**

```typescript
// Update ke async params (Next.js 15)
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
}
```

### 11.5 Error: "Build failed - Module not found"

**Error:**
```
Module not found: Can't resolve '@/components/...'
```

**Solusi:**

```bash
# Check tsconfig.json paths
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}

# Restart TypeScript server
# VSCode: Ctrl+Shift+P → "TypeScript: Restart TS Server"
```

### 11.6 Error: "TailwindCSS not working after upgrade"

**Error:**
CSS classes tidak apply setelah upgrade.

**Solusi:**

```bash
# 1. Clear Next.js cache
rm -rf .next

# 2. Rebuild
npm run build

# 3. Check tailwind.config.ts content paths
content: [
  './app/**/*.{js,ts,jsx,tsx,mdx}',
  './components/**/*.{js,ts,jsx,tsx,mdx}',
]
```

---

## 📋 Upgrade Checklist Summary

### Pre-Upgrade

- [ ] Backup database
- [ ] Commit all changes
- [ ] Create upgrade branch
- [ ] Read changelogs
- [ ] Note current versions

### Upgrade Process

- [ ] Upgrade React
- [ ] Upgrade Next.js
- [ ] Upgrade Prisma
- [ ] Update NextAuth (optional)
- [ ] Upgrade TailwindCSS
- [ ] Update other dependencies
- [ ] Run `npm install`
- [ ] Run `npx prisma generate`

### Testing

- [ ] `npm run build` works
- [ ] `npm run dev` works
- [ ] TypeScript no errors
- [ ] ESLint no errors
- [ ] All features working
- [ ] No console errors
- [ ] Test on production-like env

### Post-Upgrade

- [ ] Update documentation
- [ ] Commit changes
- [ ] Create PR for review
- [ ] Deploy to staging
- [ ] Monitor for issues
- [ ] Deploy to production

---

## 📚 Referensi

### Official Upgrade Guides

- [Next.js Upgrade Guide](https://nextjs.org/docs/app/building-your-application/upgrading)
- [React 19 Upgrade](https://react.dev/blog/2024/04/25/react-19)
- [Prisma Upgrade Guide](https://www.prisma.io/docs/guides/upgrade-guides)
- [Auth.js v5 Migration](https://authjs.dev/getting-started/migrating-to-v5)
- [TailwindCSS Upgrade](https://tailwindcss.com/docs/upgrade-guide)

### Related Docs

- [01-SETUP-BUILD.md](./01-SETUP-BUILD.md) - Initial setup
- [05-DATABASE-PRISMA.md](./05-DATABASE-PRISMA.md) - Prisma details
- [03-AUTHENTICATION-AUTHORIZATION.md](./03-AUTHENTICATION-AUTHORIZATION.md) - NextAuth setup

---

**✅ Dokumentasi Upgrade Libraries Selesai!**

Next: [07-PENAMBAHAN-FIELD.md](./07-PENAMBAHAN-FIELD.md) - Tutorial step-by-step tambah field baru
