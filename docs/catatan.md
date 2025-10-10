# 📦 Setup & Build Project

> **Dokumentasi Lengkap**: Setup Environment, Instalasi Dependencies, Konfigurasi, dan Build Project

---

## 📑 Daftar Isi
- [Prasyarat](#prasyarat)
- [Instalasi Awal](#instalasi-awal)
- [Konfigurasi Environment](#konfigurasi-environment)
- [Setup Database](#setup-database)
- [Menjalankan Project](#menjalankan-project)
- [Build untuk Production](#build-untuk-production)
- [Troubleshooting](#troubleshooting)

---

## 🔧 Prasyarat

Sebelum memulai, pastikan sistem Anda sudah terinstall:

### 1. **Node.js & npm/bun**
```bash
# Cek versi Node.js (minimal v18.17.0 atau lebih tinggi)
node --version

# Cek versi npm
npm --version

# Atau jika pakai bun (lebih cepat)
bun --version
```

**Versi yang Direkomendasikan:**
- Node.js: `v20.x` atau `v22.x` (LTS)
- npm: `v10.x` atau lebih tinggi
- bun: `v1.x` (opsional, lebih cepat dari npm)

**Download:**
- Node.js: [https://nodejs.org](https://nodejs.org)
- Bun: [https://bun.sh](https://bun.sh)

### 2. **MySQL Database**
```bash
# Cek versi MySQL (minimal 5.7 atau 8.0)
mysql --version
```

**Opsi Database:**
- **Lokal**: MySQL Server di komputer Anda
- **Cloud**: PlanetScale, Railway, Supabase, atau AWS RDS

**Download MySQL:**
- Windows: [https://dev.mysql.com/downloads/installer/](https://dev.mysql.com/downloads/installer/)
- macOS: `brew install mysql`
- Linux: `sudo apt-get install mysql-server`

### 3. **Git** (opsional, untuk version control)
```bash
git --version
```

### 4. **Code Editor**
- VS Code (direkomendasikan) dengan extensions:
  - Prisma
  - ESLint
  - Tailwind CSS IntelliSense
  - ES7+ React/Redux/React-Native snippets

---

## 🚀 Instalasi Awal

### Step 1: Clone atau Download Project

**Opsi A: Clone dari GitHub**
```bash
git clone https://github.com/amrfad/Electronics-eCommerce-Shop-With-Admin-Dashboard-NextJS-NodeJS.git
cd Electronics-eCommerce-Shop-With-Admin-Dashboard-NextJS-NodeJS
```

**Opsi B: Download ZIP**
1. Download ZIP dari GitHub
2. Extract ke folder kerja Anda
3. Buka terminal di folder tersebut

### Step 2: Install Dependencies

Project ini menggunakan **bun** sebagai package manager (terlihat dari `bun.lock`).

**Menggunakan Bun (Direkomendasikan - Lebih Cepat):**
```bash
bun install
```

**Atau Menggunakan npm:**
```bash
npm install
```

**Atau Menggunakan yarn:**
```bash
yarn install
```

**Waktu Instalasi:**
- Bun: ~10-20 detik
- npm: ~1-2 menit
- yarn: ~30-60 detik

### Step 3: Verifikasi Instalasi

Setelah instalasi selesai, cek apakah `node_modules` sudah terisi:

```bash
# Windows
dir node_modules

# macOS/Linux
ls node_modules
```

Anda harus melihat folder-folder dependencies seperti:
- `next`
- `react`
- `@prisma/client`
- `next-auth`
- dll.

---

## ⚙️ Konfigurasi Environment

### Step 1: Buat File `.env`

Copy file `.env.example` (jika ada) atau buat file baru `.env` di root project:

```bash
# Windows (PowerShell)
Copy-Item .env.example .env

# macOS/Linux
cp .env.example .env
```

Jika tidak ada `.env.example`, buat file `.env` secara manual.

### Step 2: Isi Konfigurasi `.env`

Buka file `.env` dan isi dengan konfigurasi berikut:

```env
# ============================================
# DATABASE CONFIGURATION
# ============================================
# Format: mysql://USER:PASSWORD@HOST:PORT/DATABASE_NAME
# Contoh lokal: mysql://root:password@localhost:3306/ecommerce_db
# Contoh PlanetScale: mysql://username:password@host.psdb.cloud/database?sslaccept=strict

DATABASE_URL="mysql://root:password@localhost:3306/electronics_ecommerce"

# ============================================
# NEXTAUTH CONFIGURATION
# ============================================
# Secret untuk enkripsi JWT (generate dengan: openssl rand -base64 32)
NEXTAUTH_SECRET="your-super-secret-key-change-this-in-production"

# URL aplikasi Anda
NEXTAUTH_URL="http://localhost:3000"

# ============================================
# OAUTH PROVIDERS (Opsional)
# ============================================
# GitHub OAuth (jika ingin pakai login GitHub)
# GITHUB_ID="your-github-oauth-client-id"
# GITHUB_SECRET="your-github-oauth-client-secret"

# Google OAuth (jika ingin pakai login Google)
# GOOGLE_CLIENT_ID="your-google-oauth-client-id"
# GOOGLE_CLIENT_SECRET="your-google-oauth-client-secret"

# ============================================
# API CONFIGURATION
# ============================================
NEXT_PUBLIC_API_BASE_URL="http://localhost:3000"

# ============================================
# OPTIONAL: EMAIL CONFIGURATION
# ============================================
# EMAIL_SERVER="smtp://username:password@smtp.example.com:587"
# EMAIL_FROM="noreply@example.com"
```

### Step 3: Generate NEXTAUTH_SECRET

Untuk keamanan, generate secret yang random:

**Menggunakan OpenSSL:**
```bash
# Windows (Git Bash atau WSL)
openssl rand -base64 32

# Output contoh: xK7m3p9qR2wN5vT8yU4zX1cA6bE0dF9g
```

**Menggunakan Node.js:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Copy hasilnya dan paste ke `NEXTAUTH_SECRET` di file `.env`.

### Step 4: Konfigurasi Database URL

**Format DATABASE_URL:**
```
mysql://[USER]:[PASSWORD]@[HOST]:[PORT]/[DATABASE_NAME]
```

**Contoh untuk Berbagai Skenario:**

**1. MySQL Lokal (Default)**
```env
DATABASE_URL="mysql://root:@localhost:3306/electronics_ecommerce"
```

**2. MySQL Lokal dengan Password**
```env
DATABASE_URL="mysql://root:mypassword@localhost:3306/electronics_ecommerce"
```

**3. MySQL di Server Lain**
```env
DATABASE_URL="mysql://admin:secret123@192.168.1.100:3306/ecommerce"
```

**4. PlanetScale (Cloud)**
```env
DATABASE_URL="mysql://xxxxxxx:pscale_pw_xxxxx@aws.connect.psdb.cloud/electronics_ecommerce?sslaccept=strict"
```

**5. Railway (Cloud)**
```env
DATABASE_URL="mysql://root:password@containers-us-west-123.railway.app:1234/railway"
```

---

## 🗄️ Setup Database

### Step 1: Buat Database MySQL

Buka MySQL command line atau MySQL Workbench, lalu jalankan:

```sql
-- Buat database baru
CREATE DATABASE electronics_ecommerce;

-- Verifikasi database sudah dibuat
SHOW DATABASES;

-- Gunakan database
USE electronics_ecommerce;
```

**Atau menggunakan command line:**
```bash
# Login ke MySQL
mysql -u root -p

# Jalankan perintah SQL di atas
```

### Step 2: Generate Prisma Client

Generate Prisma Client dari schema:

```bash
npx prisma generate
```

**Output yang diharapkan:**
```
✔ Generated Prisma Client (v6.16.1) to ./node_modules/@prisma/client
```

### Step 3: Jalankan Migrations

Buat tabel-tabel di database:

```bash
npx prisma migrate deploy
```

**Atau untuk development:**
```bash
npx prisma migrate dev --name init
```

**Output yang diharapkan:**
```
Applying migration '20240101120000_init'
✔ Generated Prisma Client

The following migrations have been applied:
  - 20240101120000_init
```

### Step 4: Seed Database (Isi Data Awal)

Isi database dengan data contoh:

```bash
node prisma/seed.js
```

**Data yang akan di-seed:**
- Kategori produk
- Beberapa produk contoh
- User admin default
- User biasa untuk testing

### Step 5: Verifikasi Database

Cek apakah tabel sudah terbuat:

```bash
npx prisma studio
```

Ini akan membuka Prisma Studio di browser (http://localhost:5555) di mana Anda bisa:
- Melihat semua tabel
- Edit data secara visual
- Cek relationships antar tabel

**Atau via MySQL:**
```bash
mysql -u root -p

USE electronics_ecommerce;
SHOW TABLES;
```

**Tabel yang harus ada:**
- `Product`
- `Category`
- `User`
- `Customer_order`
- `customer_order_product`
- `Wishlist`
- `Feedback`
- `Image`

---

## 🏃 Menjalankan Project

### Mode Development

**Menggunakan Bun:**
```bash
bun run dev
```

**Menggunakan npm:**
```bash
npm run dev
```

**Output yang diharapkan:**
```
▲ Next.js 15.5.3
- Local:        http://localhost:3000
- Environments: .env

✓ Ready in 2.3s
```

### Akses Aplikasi

Buka browser dan kunjungi:

**Frontend (Customer):**
- Homepage: [http://localhost:3000](http://localhost:3000)
- Shop: [http://localhost:3000/shop](http://localhost:3000/shop)
- Product Detail: [http://localhost:3000/product/[slug]](http://localhost:3000/product/laptop-dell)
- Cart: [http://localhost:3000/cart](http://localhost:3000/cart)
- Checkout: [http://localhost:3000/checkout](http://localhost:3000/checkout)
- Login: [http://localhost:3000/login](http://localhost:3000/login)
- Register: [http://localhost:3000/register](http://localhost:3000/register)

**Admin Dashboard:**
- Dashboard: [http://localhost:3000/admin](http://localhost:3000/admin)
- Products: [http://localhost:3000/admin/products](http://localhost:3000/admin/products)
- Orders: [http://localhost:3000/admin/orders](http://localhost:3000/admin/orders)
- Users: [http://localhost:3000/admin/users](http://localhost:3000/admin/users)
- Categories: [http://localhost:3000/admin/categories](http://localhost:3000/admin/categories)

**Login Credentials (setelah seed):**
```
Admin:
Email: admin@example.com
Password: admin123

User:
Email: user@example.com
Password: user123
```

### Hot Reload

Project ini menggunakan **Fast Refresh** dari Next.js:
- Edit file `.tsx` atau `.ts`
- Save (Ctrl+S)
- Browser otomatis reload dengan perubahan

**Tips:**
- Jangan edit file saat ada error
- Jika Fast Refresh tidak bekerja, restart server (Ctrl+C, lalu `npm run dev` lagi)

---

## 🏗️ Build untuk Production

### Step 1: Build Project

```bash
# Menggunakan bun
bun run build

# Atau npm
npm run build
```

**Proses Build:**
1. ✓ Compile TypeScript
2. ✓ Generate optimized bundles
3. ✓ Create static pages
4. ✓ Optimize images
5. ✓ Generate sitemap (jika ada)

**Output:**
```
Route (app)                                Size     First Load JS
┌ ○ /                                      5.2 kB         123 kB
├ ○ /cart                                  3.8 kB         120 kB
├ ○ /checkout                              8.1 kB         135 kB
├ λ /product/[slug]                        12.3 kB        145 kB
└ ○ /shop                                  6.5 kB         128 kB

○ (Static)  automatically rendered as static HTML
λ (Server)  server-side rendered
```

### Step 2: Test Production Build Lokal

Jalankan server production di lokal:

```bash
# Menggunakan bun
bun run start

# Atau npm
npm run start
```

Akses: [http://localhost:3000](http://localhost:3000)

### Step 3: Deployment

**Opsi A: Vercel (Paling Mudah)**

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. Setup environment variables di Vercel Dashboard:
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`

**Opsi B: Netlify**

1. Build project: `npm run build`
2. Upload folder `.next` ke Netlify
3. Set environment variables di Netlify Dashboard

**Opsi C: VPS (Digital Ocean, Linode, etc.)**

1. SSH ke server Anda
2. Install Node.js, nginx, PM2
3. Clone project
4. Setup `.env`
5. Build: `npm run build`
6. Jalankan dengan PM2:
```bash
pm2 start npm --name "ecommerce" -- start
pm2 save
```

**Opsi D: Docker**

Buat `Dockerfile`:
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

Build & run:
```bash
docker build -t ecommerce-app .
docker run -p 3000:3000 --env-file .env ecommerce-app
```

---

## 🔍 Troubleshooting

### Problem 1: `Cannot connect to database`

**Error:**
```
PrismaClientInitializationError: Can't reach database server
```

**Solusi:**
1. Cek MySQL service berjalan:
```bash
# Windows
net start MySQL80

# macOS
brew services start mysql

# Linux
sudo systemctl start mysql
```

2. Cek `DATABASE_URL` di `.env` sudah benar
3. Test koneksi database:
```bash
npx prisma db pull
```

### Problem 2: `Module not found`

**Error:**
```
Error: Cannot find module '@prisma/client'
```

**Solusi:**
```bash
# Generate Prisma Client
npx prisma generate

# Re-install dependencies
rm -rf node_modules
npm install
```

### Problem 3: Port 3000 sudah digunakan

**Error:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solusi:**
```bash
# Windows - Kill proses di port 3000
netstat -ano | findstr :3000
taskkill /PID [PID_NUMBER] /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Atau jalankan di port lain
PORT=3001 npm run dev
```

### Problem 4: `NEXTAUTH_SECRET` tidak valid

**Error:**
```
[next-auth][error][INVALID_SECRET]
```

**Solusi:**
```bash
# Generate secret baru
openssl rand -base64 32

# Copy ke .env
NEXTAUTH_SECRET="hasil-generate-di-atas"
```

### Problem 5: Prisma Migration Failed

**Error:**
```
Error: P3005 Database is not empty
```

**Solusi:**
```bash
# Reset database (WARNING: Hapus semua data)
npx prisma migrate reset

# Atau push schema tanpa migration
npx prisma db push
```

### Problem 6: Build Error - Out of Memory

**Error:**
```
FATAL ERROR: Reached heap limit Allocation failed
```

**Solusi:**
```bash
# Increase Node.js memory limit
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

### Problem 7: TypeScript Errors

**Error:**
```
Type error: Property 'X' does not exist on type 'Y'
```

**Solusi:**
```bash
# Re-generate Prisma types
npx prisma generate

# Check TypeScript config
npx tsc --noEmit
```

### Problem 8: Hot Reload Tidak Bekerja

**Solusi:**
1. Restart dev server (Ctrl+C, lalu `npm run dev`)
2. Clear `.next` folder:
```bash
rm -rf .next
npm run dev
```
3. Disable antivirus sementara (bisa block file watcher)

---

## 📊 Performance Tips

### 1. **Optimize Dependencies**
```bash
# Audit dependencies
npm audit

# Update packages
npm update

# Remove unused dependencies
npm prune
```

### 2. **Enable SWC Minifier** (sudah default di Next.js 15)
Di `next.config.mjs`:
```javascript
const nextConfig = {
  swcMinify: true, // Default true di Next.js 15
}
```

### 3. **Enable Caching**
Di `next.config.mjs`:
```javascript
const nextConfig = {
  experimental: {
    outputFileTracingExcludes: {
      '*': [
        'node_modules/@swc/core-linux-x64-gnu',
        'node_modules/@swc/core-linux-x64-musl',
      ],
    },
  },
}
```

### 4. **Optimize Images**
Gunakan `next/image` untuk lazy loading otomatis:
```tsx
import Image from 'next/image'

<Image 
  src="/product.jpg" 
  alt="Product" 
  width={500} 
  height={500}
  loading="lazy" // Default
/>
```

---

## 📝 Scripts yang Tersedia

```json
{
  "scripts": {
    "dev": "next dev",                    // Jalankan development server
    "build": "next build",                 // Build untuk production
    "start": "next start",                 // Jalankan production server
    "lint": "next lint",                   // Check linting errors
    "prisma:generate": "prisma generate",  // Generate Prisma Client
    "prisma:migrate": "prisma migrate dev",// Jalankan migrations
    "prisma:studio": "prisma studio",      // Buka Prisma Studio
    "prisma:seed": "node prisma/seed.js"   // Seed database
  }
}
```

---

## 🎯 Checklist Setup

Gunakan checklist ini untuk memastikan setup berhasil:

- [ ] Node.js v20+ terinstall
- [ ] MySQL terinstall dan berjalan
- [ ] Dependencies terinstall (`node_modules` ada)
- [ ] File `.env` sudah dikonfigurasi
- [ ] `NEXTAUTH_SECRET` sudah di-generate
- [ ] `DATABASE_URL` sudah benar
- [ ] Database sudah dibuat
- [ ] Prisma Client sudah di-generate
- [ ] Migrations sudah dijalankan
- [ ] Database sudah di-seed
- [ ] Dev server berjalan di http://localhost:3000
- [ ] Bisa akses homepage
- [ ] Bisa login ke admin dashboard
- [ ] Bisa register user baru

---

## 🔗 Referensi

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [MySQL Documentation](https://dev.mysql.com/doc/)

---

**📌 Catatan Penting:**
- Jangan commit file `.env` ke Git (sudah ada di `.gitignore`)
- Backup database sebelum migration di production
- Gunakan `DATABASE_URL` yang berbeda untuk development dan production
- Generate `NEXTAUTH_SECRET` baru untuk setiap environment

---

# 🏗️ Struktur Project & Arsitektur

> **Dokumentasi Lengkap**: Memahami struktur folder, routing, komponen, dan arsitektur aplikasi

---

## 📑 Daftar Isi

- [Gambaran Umum Arsitektur](#gambaran-umum-arsitektur)
- [Struktur Folder Project](#struktur-folder-project)
- [Next.js App Router](#nextjs-app-router)
- [Komponen-Komponen Utama](#komponen-komponen-utama)
- [State Management (Zustand)](#state-management-zustand)
- [Server Components vs Client Components](#server-components-vs-client-components)
- [Data Flow & Patterns](#data-flow--patterns)
- [File Naming Conventions](#file-naming-conventions)

---

## 🎯 Gambaran Umum Arsitektur

### Stack Teknologi

```
┌─────────────────────────────────────────────────┐
│          Frontend (Client-Side)                  │
├─────────────────────────────────────────────────┤
│  - Next.js 15 (App Router)                      │
│  - React 18 (Server & Client Components)        │
│  - TailwindCSS + DaisyUI                        │
│  - Zustand (State Management)                   │
│  - React Hot Toast (Notifications)              │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│          API Layer (Server-Side)                 │
├─────────────────────────────────────────────────┤
│  - Next.js API Routes (app/api)                 │
│  - NextAuth.js (Authentication)                 │
│  - Zod (Validation)                             │
│  - DOMPurify (Sanitization)                     │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│          Database Layer                          │
├─────────────────────────────────────────────────┤
│  - Prisma ORM                                   │
│  - MySQL Database                               │
└─────────────────────────────────────────────────┘
```

### Alur Request-Response

```
User Browser
    ↓
Next.js Server (SSR/SSG)
    ↓
API Route Handler
    ↓
Validation (Zod) → Sanitization (DOMPurify)
    ↓
Prisma ORM
    ↓
MySQL Database
    ↓
Response (JSON)
    ↓
Client Component (Update UI)
```

---

## 📁 Struktur Folder Project

### Root Directory

```
Electronics-eCommerce-Shop/
├── 📁 app/                    # Next.js App Router (halaman & API)
├── 📁 components/             # Komponen React (reusable)
├── 📁 prisma/                 # Database schema & migrations
├── 📁 public/                 # Static assets (images, icons)
├── 📁 lib/                    # Utility functions & helpers
├── 📁 utils/                  # Validation, schemas, helpers
├── 📁 server/                 # Server-side utilities (legacy)
├── 📁 helpers/                # Browser & screen helpers
├── 📁 hooks/                  # Custom React hooks
├── 📁 docs/                   # Dokumentasi (folder ini!)
├── 📄 middleware.ts           # Next.js middleware (auth)
├── 📄 next.config.mjs         # Konfigurasi Next.js
├── 📄 tailwind.config.ts      # Konfigurasi TailwindCSS
├── 📄 tsconfig.json           # Konfigurasi TypeScript
├── 📄 package.json            # Dependencies & scripts
├── 📄 .env                    # Environment variables
└── 📄 README.md               # Dokumentasi project
```

### Struktur `app/` Directory (App Router)

```
app/
├── 📄 layout.tsx              # Root layout (wrapper semua halaman)
├── 📄 page.tsx                # Homepage (/)
├── 📄 error.tsx               # Error boundary
├── 📄 not-found.tsx           # 404 page
├── 📄 globals.css             # Global CSS
│
├── 📁 (dashboard)/            # Route group (tidak muncul di URL)
│   └── 📁 admin/              # Admin dashboard (/admin)
│       ├── 📄 page.tsx        # Dashboard home
│       ├── 📁 products/       # Manage products
│       ├── 📁 orders/         # Manage orders
│       ├── 📁 users/          # Manage users
│       └── 📁 categories/     # Manage categories
│
├── 📁 api/                    # API routes (backend)
│   ├── 📁 auth/               # Authentication endpoints
│   ├── 📁 register/           # User registration
│   ├── 📁 feedback/           # Product feedbacks
│   └── ...                    # Other API endpoints
│
├── 📁 product/                # Product pages
│   └── 📁 [slug]/             # Dynamic route (/product/laptop-dell)
│       └── 📄 page.tsx        # Single product page
│
├── 📁 cart/                   # Shopping cart
│   └── 📄 page.tsx
├── 📁 checkout/               # Checkout page
│   └── 📄 page.tsx
├── 📁 shop/                   # All products page
│   └── 📄 page.tsx
├── 📁 login/                  # Login page
│   └── 📄 page.tsx
├── 📁 register/               # Register page
│   └── 📄 page.tsx
├── 📁 wishlist/               # Wishlist page
│   └── 📄 page.tsx
│
├── 📁 _zustand/               # Zustand stores (state management)
│   ├── 📄 store.ts            # Cart state
│   ├── 📄 wishlistStore.ts    # Wishlist state
│   ├── 📄 paginationStore.ts  # Pagination state
│   └── 📄 sortStore.ts        # Sort state
│
└── 📁 actions/                # Server Actions
    └── 📄 index.ts            # Server-side functions
```

### Struktur `components/` Directory

```
components/
├── 📄 index.ts                # Export semua components
│
├── 📄 Header.tsx              # Header dengan cart, wishlist
├── 📄 HeaderTop.tsx           # Top bar (info toko)
├── 📄 Footer.tsx              # Footer
├── 📄 CategoryMenu.tsx        # Menu kategori
├── 📄 SearchInput.tsx         # Search bar
│
├── 📄 Hero.tsx                # Hero section (banner)
├── 📄 Products.tsx            # Product grid
├── 📄 ProductItem.tsx         # Single product card
├── 📄 ProductsSection.tsx     # Products dengan filter
│
├── 📄 CartElement.tsx         # Cart icon + quantity
├── 📄 HeartElement.tsx        # Wishlist icon + quantity
├── 📄 WishItem.tsx            # Wishlist item
│
├── 📄 AddToCartSingleProductBtn.tsx
├── 📄 AddToWishlistBtn.tsx
├── 📄 BuyNowSingleProductBtn.tsx
│
├── 📄 FeedbackForm.tsx        # Form feedback produk
├── 📄 FeedbackList.tsx        # List feedback
├── 📄 ProductFeedbackSection.tsx
│
├── 📄 DashboardSidebar.tsx    # Sidebar admin
├── 📄 DashboardProductTable.tsx
├── 📄 AdminOrders.tsx
├── 📄 AdminFeedbackTable.tsx
│
├── 📄 Filters.tsx             # Filter produk
├── 📄 SortBy.tsx              # Sorting
├── 📄 Pagination.tsx          # Pagination
│
├── 📄 Loader.tsx              # Loading spinner
├── 📄 CustomButton.tsx        # Button reusable
├── 📄 Checkbox.tsx            # Checkbox input
├── 📄 QuantityInput.tsx       # Input quantity
│
└── 📁 modules/                # Feature modules
    ├── 📁 cart/
    │   └── 📄 index.tsx       # Cart module
    └── 📁 wishlist/
        └── 📄 index.tsx       # Wishlist module
```

### Struktur `prisma/` Directory

```
prisma/
├── 📄 schema.prisma           # Database schema (models)
├── 📄 seed.js                 # Seed data (data awal)
└── 📁 migrations/             # Migration history
    ├── 📁 20240101_init/
    │   └── migration.sql
    └── ...
```

### Struktur `lib/` & `utils/` Directory

```
lib/
├── 📄 api.ts                  # API client (fetch wrapper)
├── 📄 config.ts               # Konfigurasi app
├── 📄 utils.ts                # Helper functions
├── 📄 sanitize.ts             # Sanitization
└── 📄 form-sanitize.ts        # Form sanitization

utils/
├── 📄 validation.ts           # Common validations
├── 📄 schema.ts               # Zod schemas
├── 📄 errorHandler.ts         # Error handling
└── 📄 db.ts                   # Prisma client
```

---

## 🛣️ Next.js App Router

### Konsep Dasar App Router

Next.js 15 menggunakan **App Router** (bukan Pages Router lama):

**Perbedaan Utama:**
```
Pages Router (❌ Lama):
pages/
  ├── index.js          → /
  ├── about.js          → /about
  └── blog/
      └── [slug].js     → /blog/:slug

App Router (✅ Baru):
app/
  ├── page.tsx          → /
  ├── about/
  │   └── page.tsx      → /about
  └── blog/
      └── [slug]/
          └── page.tsx  → /blog/:slug
```

### Special Files di App Router

| File | Fungsi | Contoh |
|------|--------|--------|
| `page.tsx` | Halaman route | `/admin/page.tsx` → `/admin` |
| `layout.tsx` | Layout wrapper | Shared UI (header, footer) |
| `loading.tsx` | Loading UI | Suspense fallback |
| `error.tsx` | Error boundary | Catch errors |
| `not-found.tsx` | 404 page | Not found errors |
| `route.ts` | API endpoint | `/api/users/route.ts` |

### Route Groups `(folder)`

Folder dengan `()` **tidak muncul di URL**:

```
app/
├── (dashboard)/       # ← Tidak muncul di URL!
│   └── admin/
│       └── page.tsx   # URL: /admin (bukan /dashboard/admin)
```

**Kenapa pakai route groups?**
- Grouping halaman tanpa mempengaruhi URL
- Shared layout untuk grup tertentu
- Organisasi kode lebih rapi

### Dynamic Routes `[param]`

Folder dengan `[]` adalah **dynamic route**:

```tsx
// app/product/[slug]/page.tsx

interface ProductPageProps {
  params: {
    slug: string;  // ← dari URL
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = params;
  
  // Fetch product by slug
  const product = await getProductBySlug(slug);
  
  return <div>{product.title}</div>;
}
```

**Contoh URL:**
- `/product/laptop-dell` → `slug = "laptop-dell"`
- `/product/iphone-15-pro` → `slug = "iphone-15-pro"`

### Routing di Project Ini

| URL | File | Deskripsi |
|-----|------|-----------|
| `/` | `app/page.tsx` | Homepage |
| `/shop` | `app/shop/page.tsx` | Semua produk |
| `/product/[slug]` | `app/product/[slug]/page.tsx` | Detail produk |
| `/cart` | `app/cart/page.tsx` | Shopping cart |
| `/checkout` | `app/checkout/page.tsx` | Checkout |
| `/login` | `app/login/page.tsx` | Login |
| `/register` | `app/register/page.tsx` | Register |
| `/wishlist` | `app/wishlist/page.tsx` | Wishlist |
| `/admin` | `app/(dashboard)/admin/page.tsx` | Admin dashboard |
| `/admin/products` | `app/(dashboard)/admin/products/page.tsx` | Manage products |
| `/admin/orders` | `app/(dashboard)/admin/orders/page.tsx` | Manage orders |

---

## 🧩 Komponen-Komponen Utama

### 1. Layout Components

**`app/layout.tsx`** - Root Layout (wrapper semua halaman)

```tsx
import { Providers } from "@/Providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Header />
          {children}  {/* ← Konten halaman */}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
```

**Fungsi:**
- Wrapper untuk semua halaman
- Include Header & Footer
- Setup Providers (NextAuth, Toaster, dll)

### 2. Header & Navigation

**`components/Header.tsx`**

```tsx
"use client";
import { useSession } from "next-auth/react";
import { useWishlistStore } from "@/app/_zustand/wishlistStore";

const Header = () => {
  const { data: session } = useSession();
  const { wishlist, wishQuantity } = useWishlistStore();
  
  return (
    <header>
      <HeaderTop />
      <CategoryMenu />
      <SearchInput />
      <CartElement />
      <HeartElement wishQuantity={wishQuantity} />
      {session ? (
        <button onClick={signOut}>Logout</button>
      ) : (
        <Link href="/login">Login</Link>
      )}
    </header>
  );
};
```

**Fitur Header:**
- ✅ Session management (login/logout)
- ✅ Cart icon + quantity
- ✅ Wishlist icon + quantity
- ✅ Search bar
- ✅ Category menu

### 3. Product Components

**`components/ProductItem.tsx`** - Single Product Card

```tsx
interface ProductItemProps {
  id: string;
  title: string;
  price: number;
  mainImage: string;
  slug: string;
  rating: number;
}

const ProductItem = ({ id, title, price, mainImage, slug, rating }: ProductItemProps) => {
  return (
    <div className="product-card">
      <Link href={`/product/${slug}`}>
        <Image src={mainImage} alt={title} />
        <h3>{title}</h3>
        <p>${price}</p>
        <ProductItemRating rating={rating} />
      </Link>
      <AddToCartSingleProductBtn product={...} />
      <AddToWishlistBtn product={...} />
    </div>
  );
};
```

**Lokasi penggunaan:**
- Homepage (`app/page.tsx`)
- Shop page (`app/shop/page.tsx`)
- Search results

### 4. Cart Components

**`components/modules/cart/index.tsx`** - Cart Module

```tsx
"use client";
import { useProductStore } from "@/app/_zustand/store";

export const CartModule = () => {
  const { products, removeFromCart, calculateTotals, total } = useProductStore();
  
  return (
    <div>
      {products.map((product) => (
        <div key={product.id}>
          <Image src={product.image} alt={product.title} />
          <h3>{product.title}</h3>
          <QuantityInputCart product={product} />
          <p>${product.price * product.amount}</p>
          <button onClick={() => removeFromCart(product.id)}>
            Remove
          </button>
        </div>
      ))}
      <div>
        <p>Total: ${total}</p>
        <Link href="/checkout">Checkout</Link>
      </div>
    </div>
  );
};
```

**State yang digunakan:**
- `products` - Array produk di cart
- `total` - Total harga
- `removeFromCart()` - Hapus produk
- `calculateTotals()` - Hitung ulang total

### 5. Admin Components

**`components/DashboardSidebar.tsx`** - Admin Sidebar

```tsx
const DashboardSidebar = () => {
  const pathname = usePathname();
  
  const menuItems = [
    { href: "/admin", label: "Dashboard", icon: <FaHome /> },
    { href: "/admin/products", label: "Products", icon: <FaBox /> },
    { href: "/admin/orders", label: "Orders", icon: <FaShoppingCart /> },
    { href: "/admin/users", label: "Users", icon: <FaUsers /> },
    { href: "/admin/categories", label: "Categories", icon: <FaTags /> },
  ];
  
  return (
    <aside>
      {menuItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={pathname === item.href ? "active" : ""}
        >
          {item.icon}
          {item.label}
        </Link>
      ))}
    </aside>
  );
};
```

**Halaman Admin:**
- `/admin` - Dashboard stats
- `/admin/products` - CRUD produk
- `/admin/orders` - Manage pesanan
- `/admin/users` - Manage users
- `/admin/categories` - Manage kategori

---

## 🗃️ State Management (Zustand)

### Kenapa Zustand?

**Keuntungan Zustand vs Redux/Context API:**
- ✅ **Simple**: Tidak perlu boilerplate
- ✅ **Fast**: Tidak re-render unnecessary
- ✅ **TypeScript**: Type-safe
- ✅ **Persistence**: Auto save ke localStorage/sessionStorage
- ✅ **Devtools**: Support Redux DevTools

### Store Cart (`app/_zustand/store.ts`)

```typescript
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type ProductInCart = {
  id: string;
  title: string;
  price: number;
  image: string;
  amount: number;
};

export type State = {
  products: ProductInCart[];
  allQuantity: number;
  total: number;
};

export type Actions = {
  addToCart: (newProduct: ProductInCart) => void;
  removeFromCart: (id: string) => void;
  updateCartAmount: (id: string, quantity: number) => void;
  calculateTotals: () => void;
  clearCart: () => void;
};

export const useProductStore = create<State & Actions>()(
  persist(
    (set) => ({
      // Initial State
      products: [],
      allQuantity: 0,
      total: 0,
      
      // Actions
      addToCart: (newProduct) => {
        set((state) => {
          // Cek apakah produk sudah ada di cart
          const cartItem = state.products.find(
            (item) => item.id === newProduct.id
          );
          
          if (!cartItem) {
            // Produk baru, tambahkan ke array
            return { products: [...state.products, newProduct] };
          } else {
            // Produk sudah ada, update quantity
            state.products.map((product) => {
              if (product.id === cartItem.id) {
                product.amount += newProduct.amount;
              }
            });
            return { products: [...state.products] };
          }
        });
      },
      
      removeFromCart: (id) => {
        set((state) => {
          state.products = state.products.filter(
            (product) => product.id !== id
          );
          return { products: state.products };
        });
      },
      
      calculateTotals: () => {
        set((state) => {
          let amount = 0;
          let total = 0;
          
          state.products.forEach((item) => {
            amount += item.amount;
            total += item.amount * item.price;
          });
          
          return {
            products: state.products,
            allQuantity: amount,
            total: total,
          };
        });
      },
      
      updateCartAmount: (id, amount) => {
        set((state) => {
          const cartItem = state.products.find((item) => item.id === id);
          
          if (cartItem) {
            state.products.map((product) => {
              if (product.id === cartItem.id) {
                product.amount = amount;
              }
            });
          }
          
          return { products: [...state.products] };
        });
      },
      
      clearCart: () => {
        set(() => ({
          products: [],
          allQuantity: 0,
          total: 0,
        }));
      },
    }),
    {
      name: "products-storage", // Key di sessionStorage
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
```

**Cara Pakai di Component:**

```tsx
"use client";
import { useProductStore } from "@/app/_zustand/store";

const MyComponent = () => {
  // Ambil state & actions
  const { products, total, addToCart, calculateTotals } = useProductStore();
  
  const handleAddToCart = () => {
    addToCart({
      id: "123",
      title: "Laptop",
      price: 1000,
      image: "/laptop.jpg",
      amount: 1,
    });
    calculateTotals();
  };
  
  return (
    <div>
      <p>Total Items: {products.length}</p>
      <p>Total Price: ${total}</p>
      <button onClick={handleAddToCart}>Add to Cart</button>
    </div>
  );
};
```

### Store Wishlist (`app/_zustand/wishlistStore.ts`)

```typescript
export const useWishlistStore = create<State & Actions>((set) => ({
  wishlist: [],
  wishQuantity: 0,
  
  addToWishlist: (product) => {
    set((state) => {
      const productInWishlist = state.wishlist.find(
        (item) => product.id === item.id
      );
      
      if (!productInWishlist) {
        return {
          wishlist: [...state.wishlist, product],
          wishQuantity: state.wishlist.length + 1,
        };
      }
      
      return { wishlist: [...state.wishlist], wishQuantity: state.wishlist.length };
    });
  },
  
  removeFromWishlist: (id) => {
    set((state) => {
      const newWishlist = state.wishlist.filter((item) => item.id !== id);
      return {
        wishlist: [...newWishlist],
        wishQuantity: newWishlist.length,
      };
    });
  },
  
  setWishlist: (wishlist) => {
    set(() => ({
      wishlist: [...wishlist],
      wishQuantity: wishlist.length,
    }));
  },
}));
```

### Store Pagination (`app/_zustand/paginationStore.ts`)

```typescript
export const usePaginationStore = create<State & Actions>((set) => ({
  page: 1,
  
  incrementPage: () => {
    set((state) => ({ page: state.page + 1 }));
  },
  
  decrementPage: () => {
    set((state) => {
      if (state.page !== 1) {
        return { page: state.page - 1 };
      }
      return { page: 1 };
    });
  },
}));
```

### Store Sort (`app/_zustand/sortStore.ts`)

```typescript
export const useSortStore = create<State & Actions>((set) => ({
  sortBy: "defaultSort",
  
  changeSortBy: (mode: string) => {
    set(() => ({ sortBy: mode }));
  },
}));
```

**Cara Pakai:**
```tsx
const { sortBy, changeSortBy } = useSortStore();

<select onChange={(e) => changeSortBy(e.target.value)}>
  <option value="defaultSort">Default</option>
  <option value="priceAsc">Price: Low to High</option>
  <option value="priceDesc">Price: High to Low</option>
</select>
```

---

## 🎨 Server Components vs Client Components

### Default: Server Components

Di Next.js App Router, **semua components adalah Server Components** secara default.

**Server Components:**
- ✅ Render di server
- ✅ Tidak dikirim ke browser (ukuran bundle kecil)
- ✅ Bisa akses database langsung
- ❌ Tidak bisa pakai hooks (useState, useEffect)
- ❌ Tidak bisa pakai event handlers (onClick, onChange)

```tsx
// ✅ Server Component (default)
export default async function ProductPage() {
  // Bisa fetch data langsung di component
  const products = await prisma.product.findMany();
  
  return (
    <div>
      {products.map((product) => (
        <ProductItem key={product.id} {...product} />
      ))}
    </div>
  );
}
```

### Client Components: `"use client"`

Jika butuh interactivity, tambahkan `"use client"` di atas file:

```tsx
"use client"; // ← Wajib di baris pertama!

import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}
```

**Kapan pakai Client Component?**
- ✅ Butuh React hooks (useState, useEffect, useContext)
- ✅ Butuh event handlers (onClick, onChange, onSubmit)
- ✅ Butuh browser APIs (localStorage, window, document)
- ✅ Butuh third-party libraries yang pakai hooks
- ✅ Butuh NextAuth session dengan `useSession()`

### Pattern: Server + Client Components

**Best Practice:**

```tsx
// app/products/page.tsx (Server Component)
export default async function ProductsPage() {
  // Fetch di server
  const products = await getProducts();
  
  return (
    <div>
      <h1>Products</h1>
      {/* Pass data ke Client Component */}
      <ProductList products={products} />
    </div>
  );
}

// components/ProductList.tsx (Client Component)
"use client";
import { useState } from "react";

export default function ProductList({ products }) {
  const [filteredProducts, setFilteredProducts] = useState(products);
  
  // Interactivity di sini
  const handleFilter = (category) => {
    setFilteredProducts(
      products.filter((p) => p.category === category)
    );
  };
  
  return (
    <div>
      <button onClick={() => handleFilter("laptop")}>Laptop</button>
      {filteredProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

**Kenapa dipisah?**
- Server Component → Fetch data (lebih cepat, SEO friendly)
- Client Component → Interactivity (filter, sort, animation)

---

## 🔄 Data Flow & Patterns

### 1. Data Fetching Pattern

**Server Component (Recommended):**

```tsx
// app/products/page.tsx
import prisma from "@/utils/db";

export default async function ProductsPage() {
  // Direct database access
  const products = await prisma.product.findMany({
    include: { category: true },
  });
  
  return <ProductList products={products} />;
}
```

**Client Component (via API):**

```tsx
"use client";
import { useEffect, useState } from "react";
import apiClient from "@/lib/api";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    apiClient.get("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);
  
  return <ProductList products={products} />;
}
```

### 2. Form Submission Pattern

**Client Component dengan API Route:**

```tsx
"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import apiClient from "@/lib/api";

export default function ProductForm() {
  const [formData, setFormData] = useState({
    title: "",
    price: 0,
  });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await apiClient.post("/api/products", formData);
      
      if (response.ok) {
        toast.success("Product created!");
      } else {
        toast.error("Failed to create product");
      }
    } catch (error) {
      toast.error("Error occurred");
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
      />
      <button type="submit">Submit</button>
    </form>
  );
}
```

### 3. Authentication Pattern

**Menggunakan NextAuth:**

```tsx
"use client";
import { useSession, signIn, signOut } from "next-auth/react";

export default function LoginButton() {
  const { data: session, status } = useSession();
  
  if (status === "loading") {
    return <p>Loading...</p>;
  }
  
  if (session) {
    return (
      <>
        <p>Welcome, {session.user?.email}</p>
        <button onClick={() => signOut()}>Logout</button>
      </>
    );
  }
  
  return <button onClick={() => signIn()}>Login</button>;
}
```

### 4. Protected Route Pattern

**Menggunakan Middleware:**

```typescript
// middleware.ts
import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    // Check for admin routes
    if (req.nextUrl.pathname.startsWith("/admin")) {
      if (req.nextauth.token?.role !== "admin") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        if (req.nextUrl.pathname.startsWith("/admin")) {
          return !!token && token.role === "admin";
        }
        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/admin/:path*"]
};
```

---

## 📝 File Naming Conventions

### Naming Standards

| Type | Convention | Example |
|------|------------|---------|
| **Components** | PascalCase | `ProductItem.tsx` |
| **Pages** | lowercase | `page.tsx`, `layout.tsx` |
| **API Routes** | lowercase | `route.ts` |
| **Utilities** | camelCase | `validation.ts`, `sanitize.ts` |
| **Stores** | camelCase + Store | `wishlistStore.ts` |
| **Types** | PascalCase | `ProductType`, `UserType` |
| **Hooks** | use + PascalCase | `useSessionTimeout.ts` |

### Component Structure

**Template Component:**

```tsx
// *********************
// Role: Brief description of component
// Name: ComponentName.tsx
// Developer: Your Name
// Version: 1.0
// Call: <ComponentName prop={value} />
// Input: interface ComponentNameProps
// Output: What it renders
// *********************

"use client"; // (jika client component)

import React from "react";

interface ComponentNameProps {
  prop1: string;
  prop2: number;
}

const ComponentName = ({ prop1, prop2 }: ComponentNameProps) => {
  return (
    <div>
      {/* Component content */}
    </div>
  );
};

export default ComponentName;
```

### Folder Organization Best Practices

1. **Group by Feature** (bukan by type)
   ```
   ✅ Good:
   components/
   ├── cart/
   │   ├── CartItem.tsx
   │   ├── CartSummary.tsx
   │   └── index.tsx
   
   ❌ Bad:
   components/
   ├── CartItem.tsx
   ├── CartSummary.tsx
   ├── ProductItem.tsx
   └── ProductGrid.tsx
   ```

2. **Use index.ts for exports**
   ```typescript
   // components/index.ts
   export { default as Header } from "./Header";
   export { default as Footer } from "./Footer";
   export { default as ProductItem } from "./ProductItem";
   
   // Usage:
   import { Header, Footer, ProductItem } from "@/components";
   ```

3. **Colocate related files**
   ```
   ProductItem/
   ├── ProductItem.tsx
   ├── ProductItem.test.tsx
   ├── ProductItem.module.css
   └── index.ts
   ```

---

## 🎯 Key Takeaways

### Arsitektur Project

✅ **Next.js App Router** dengan Server Components (default)  
✅ **Zustand** untuk state management (cart, wishlist, pagination)  
✅ **Prisma ORM** untuk database access  
✅ **NextAuth** untuk authentication & session  
✅ **TailwindCSS + DaisyUI** untuk styling  

### Best Practices

1. **Server Components** untuk data fetching (lebih cepat, SEO)
2. **Client Components** untuk interactivity (state, events)
3. **Zustand** untuk global state yang perlu persist
4. **Route Groups** untuk organisasi tanpa mempengaruhi URL
5. **Dynamic Routes** untuk halaman dengan parameter

### File Structure

- `app/` → Pages & API routes
- `components/` → Reusable UI components
- `app/_zustand/` → State management stores
- `prisma/` → Database schema & migrations
- `lib/` & `utils/` → Helper functions & utilities

---

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

# 📊 DATABASE & PRISMA - PANDUAN LENGKAP

**Dokumentasi Database dan ORM Prisma untuk Project eCommerce**

---

## 📑 Daftar Isi

1. [Pengenalan Prisma](#1-pengenalan-prisma)
2. [Database Schema](#2-database-schema)
3. [Model & Field Types](#3-model--field-types)
4. [Relationships](#4-relationships)
5. [Prisma Client](#5-prisma-client)
6. [Migrations](#6-migrations)
7. [Seeding](#7-seeding)
8. [Query & Operations](#8-query--operations)
9. [Cara Menambah Field Baru](#9-cara-menambah-field-baru)
10. [Prisma Studio](#10-prisma-studio)
11. [Best Practices](#11-best-practices)
12. [Troubleshooting](#12-troubleshooting)

---

## 1. Pengenalan Prisma

### 1.1 Apa itu Prisma?

**Prisma** adalah **Next-generation ORM (Object-Relational Mapping)** untuk Node.js dan TypeScript yang mempermudah interaksi dengan database.

#### 🎯 Keunggulan Prisma:

1. **Type-Safe** - Auto-generated TypeScript types
2. **Auto-Completion** - IntelliSense untuk semua query
3. **Migrasi Otomatis** - Version control untuk database schema
4. **Prisma Studio** - GUI untuk mengelola data
5. **Multi-Database** - Support MySQL, PostgreSQL, SQLite, MongoDB, dll.

#### 📦 Komponen Prisma:

```
┌─────────────────────────────────────────────────┐
│              Prisma Ecosystem                   │
├─────────────────────────────────────────────────┤
│                                                 │
│  1. Prisma Schema (schema.prisma)              │
│     └─ Definisi models, fields, relationships  │
│                                                 │
│  2. Prisma Client                              │
│     └─ Auto-generated query builder            │
│                                                 │
│  3. Prisma Migrate                             │
│     └─ Database migration tool                 │
│                                                 │
│  4. Prisma Studio                              │
│     └─ Visual database editor                  │
│                                                 │
└─────────────────────────────────────────────────┘
```

### 1.2 Instalasi & Setup

#### Lokasi File Konfigurasi:

```
prisma/
├── schema.prisma        # Schema definition
├── seed.js             # Data seeding script
└── migrations/         # Migration history
    ├── migration_lock.toml
    └── [timestamp]_[name]/
        └── migration.sql
```

#### Commands Penting:

```bash
# Generate Prisma Client (wajib setelah ubah schema)
npx prisma generate

# Buat migration baru
npx prisma migrate dev --name nama_migration

# Deploy migrations ke production
npx prisma migrate deploy

# Reset database (hati-hati!)
npx prisma migrate reset

# Buka Prisma Studio
npx prisma studio

# Sinkronkan schema dengan database existing
npx prisma db pull

# Push schema tanpa migration (prototyping)
npx prisma db push
```

---

## 2. Database Schema

### 2.1 Konfigurasi Prisma

**📁 Lokasi:** `prisma/schema.prisma`

```prisma
// Generator: Menentukan client yang di-generate
generator client {
  provider = "prisma-client-js"
}

// Datasource: Koneksi database
datasource db {
  provider = "mysql"              // Tipe database
  url      = env("DATABASE_URL")  // Ambil dari .env
}
```

### 2.2 Environment Variable

**📁 Lokasi:** `.env`

```env
# Format: mysql://USER:PASSWORD@HOST:PORT/DATABASE
DATABASE_URL="mysql://root:password@localhost:3306/ecommerce_db"

# Atau dengan options tambahan:
DATABASE_URL="mysql://user:pass@localhost:3306/db?schema=public&connection_limit=5"
```

#### 🔑 Parameter Connection String:

| Parameter | Deskripsi | Contoh |
|-----------|-----------|--------|
| `user` | Username MySQL | `root` |
| `password` | Password MySQL | `secretPass123` |
| `host` | Server host | `localhost` atau `127.0.0.1` |
| `port` | Port MySQL | `3306` (default) |
| `database` | Nama database | `ecommerce_db` |
| `schema` | Schema name | `public` |
| `connection_limit` | Max connections | `5` |
| `pool_timeout` | Timeout (detik) | `10` |

---

## 3. Model & Field Types

### 3.1 Overview Semua Models

Project ini memiliki **8 models** dalam database:

```
1. Product              - Produk yang dijual
2. Image                - Gambar produk (multiple images)
3. Category             - Kategori produk
4. User                 - User & Admin
5. Customer_order       - Order pelanggan
6. customer_order_product - Join table (Order ↔ Product)
7. Wishlist             - Daftar keinginan user
8. Feedback             - Review/rating produk
```

### 3.2 Model: Product

**📁 Lokasi Schema:** `prisma/schema.prisma` (baris 16-30)

```prisma
model Product {
  id             String                   @id @default(uuid())
  slug           String                   @unique
  title          String
  mainImage      String
  price          Int                      @default(0)
  rating         Int                      @default(0)
  description    String
  manufacturer   String
  inStock        Int                      @default(1)
  categoryId     String
  category       Category                 @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  customerOrders customer_order_product[]
  Wishlist       Wishlist[]
  feedbacks      Feedback[]
}
```

#### 📊 Penjelasan Field:

| Field | Type | Constraint | Deskripsi |
|-------|------|------------|-----------|
| `id` | String | `@id` `@default(uuid())` | Primary key, auto-generate UUID |
| `slug` | String | `@unique` | URL-friendly identifier (harus unik) |
| `title` | String | - | Nama produk |
| `mainImage` | String | - | URL gambar utama |
| `price` | Int | `@default(0)` | Harga dalam **integer** (rupiah × 100) |
| `rating` | Int | `@default(0)` | Rating aggregate (dihitung dari feedback) |
| `description` | String | - | Deskripsi produk (TEXT di MySQL) |
| `manufacturer` | String | - | Nama brand/pembuat |
| `inStock` | Int | `@default(1)` | Jumlah stok tersedia |
| `categoryId` | String | Foreign Key | ID kategori (relasi ke Category) |

#### 🔗 Relasi Product:

1. **Category** (Many-to-One) - Setiap product punya 1 category
2. **customerOrders** (Many-to-Many) - Product bisa ada di banyak order
3. **Wishlist** (One-to-Many) - Product bisa ada di banyak wishlist
4. **feedbacks** (One-to-Many) - Product bisa punya banyak feedback

#### 💡 Kenapa Price pakai Int, bukan Float?

```javascript
// ❌ SALAH: Float tidak akurat untuk uang
price: 19.99  // Bisa jadi 19.989999999

// ✅ BENAR: Simpan dalam cent/sen
price: 1999   // Representasi 19.99

// Tampilkan di frontend:
const displayPrice = (price / 100).toFixed(2) + " USD"
// Output: "19.99 USD"
```

### 3.3 Model: Image

```prisma
model Image {
  imageID   String @id @default(uuid())
  productID String
  image     String
}
```

#### ⚠️ Catatan Penting:

Model ini **tidak punya relasi eksplisit** ke Product! Seharusnya:

```prisma
model Image {
  imageID   String  @id @default(uuid())
  productId String
  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  image     String

  @@map("Image") // Nama table di database
}
```

Dan tambahkan di Product:

```prisma
model Product {
  // ... field lain
  images Image[] // Relasi one-to-many
}
```

### 3.4 Model: User

```prisma
model User {
  id        String     @id @default(uuid())
  email     String     @unique
  password  String?    // Optional (untuk OAuth users)
  role      String?    @default("user")
  Wishlist  Wishlist[]
  feedbacks Feedback[]
}
```

#### 📊 Penjelasan Field:

| Field | Type | Constraint | Deskripsi |
|-------|------|------------|-----------|
| `id` | String | `@id` | UUID primary key |
| `email` | String | `@unique` | Email user (harus unik) |
| `password` | String? | Optional | Hash bcrypt (null untuk OAuth) |
| `role` | String? | `@default("user")` | Role: `"user"` atau `"admin"` |

#### 🔐 Kenapa Password Optional (`String?`)?

Karena support **OAuth login** (Google/GitHub) yang tidak memerlukan password:

```javascript
// User dengan password (credentials login)
{
  email: "user@example.com",
  password: "$2a$10$hashedPasswordHere",
  role: "user"
}

// User OAuth (tanpa password)
{
  email: "user@gmail.com",
  password: null,  // ← OAuth users
  role: "user"
}
```

### 3.5 Model: Category

```prisma
model Category {
  id       String    @id @default(uuid())
  name     String    @unique
  products Product[] // One-to-many relationship
}
```

#### 💡 Contoh Data:

```javascript
[
  { id: "uuid-1", name: "Electronics" },
  { id: "uuid-2", name: "Laptops" },
  { id: "uuid-3", name: "Smartphones" },
  { id: "uuid-4", name: "Cameras" }
]
```

### 3.6 Model: Customer_order

```prisma
model Customer_order {
  id          String                   @id @default(uuid())
  name        String
  lastname    String
  phone       String
  email       String
  company     String
  adress      String                    // Typo: seharusnya "address"
  apartment   String
  postalCode  String
  dateTime    DateTime?                 @default(now())
  status      String
  city        String
  country     String
  orderNotice String?                   // Optional: catatan order
  total       Int
  products    customer_order_product[]  // Relasi many-to-many
}
```

#### 📦 Status Order:

```javascript
const ORDER_STATUS = {
  PENDING: "pending",        // Menunggu pembayaran
  PROCESSING: "processing",  // Sedang diproses
  SHIPPED: "shipped",        // Dikirim
  DELIVERED: "delivered",    // Sampai
  CANCELLED: "cancelled"     // Dibatalkan
}
```

### 3.7 Model: customer_order_product (Join Table)

```prisma
model customer_order_product {
  id              String         @id @default(uuid())
  customerOrder   Customer_order @relation(fields: [customerOrderId], references: [id])
  customerOrderId String
  product         Product        @relation(fields: [productId], references: [id])
  productId       String
  quantity        Int
}
```

#### 🎯 Fungsi Join Table:

Menghubungkan **Many-to-Many** antara Order dan Product:

```
Customer_order (1) ←→ (N) customer_order_product (N) ←→ (1) Product
```

Contoh data:

```javascript
// Order #1 punya 2 produk:
{
  id: "order-1",
  total: 5000,
  products: [
    { productId: "prod-a", quantity: 2 }, // 2x Product A
    { productId: "prod-b", quantity: 1 }  // 1x Product B
  ]
}
```

### 3.8 Model: Wishlist

```prisma
model Wishlist {
  id        String  @id @default(uuid())
  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  productId String
  user      User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId    String
}
```

#### 🔄 Cascade Delete:

`onDelete: Cascade` artinya:
- Jika **Product dihapus** → Wishlist items ikut terhapus
- Jika **User dihapus** → Wishlist items ikut terhapus

### 3.9 Model: Feedback

```prisma
model Feedback {
  id        String   @id @default(uuid())
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  productId String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId    String
  comment   String
  rating    Int
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([productId, userId]) // Satu user hanya bisa beri satu feedback per produk
}
```

#### 🌟 Rating System:

```javascript
// Validasi rating (1-5)
rating: z.number().int().min(1).max(5)

// Hitung average rating:
const avgRating = feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length
```

#### 🔒 Unique Constraint:

```prisma
@@unique([productId, userId])
```

Artinya: **1 user hanya bisa kasih 1 feedback untuk 1 produk**.

❌ Tidak bisa:
```javascript
// User "user-1" kasih 2 feedback untuk "product-a"
{ userId: "user-1", productId: "product-a", rating: 5 }
{ userId: "user-1", productId: "product-a", rating: 4 } // ERROR!
```

✅ Bisa:
```javascript
// User "user-1" kasih feedback untuk 2 produk berbeda
{ userId: "user-1", productId: "product-a", rating: 5 }
{ userId: "user-1", productId: "product-b", rating: 4 }
```

---

## 4. Relationships

### 4.1 Jenis Relasi

Prisma mendukung 3 jenis relasi:

```
1. One-to-One   (1:1)   - Jarang dipakai
2. One-to-Many  (1:N)   - Paling umum
3. Many-to-Many (M:N)   - Butuh join table
```

### 4.2 One-to-Many (1:N)

#### Contoh: Category → Products

```prisma
model Category {
  id       String    @id @default(uuid())
  name     String    @unique
  products Product[] // ← Array = "banyak products"
}

model Product {
  id         String   @id @default(uuid())
  categoryId String   // ← Foreign key
  category   Category @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  // ... field lain
}
```

#### 📊 Visual:

```
Category (1)
    │
    ├─ Product 1
    ├─ Product 2
    ├─ Product 3
    └─ Product 4
```

#### 💻 Query Example:

```javascript
// Get category dengan semua products-nya
const category = await prisma.category.findUnique({
  where: { id: "category-id" },
  include: { products: true }
})

// Output:
{
  id: "category-id",
  name: "Electronics",
  products: [
    { id: "prod-1", title: "Laptop", ... },
    { id: "prod-2", title: "Phone", ... }
  ]
}
```

### 4.3 Many-to-Many (M:N)

#### Contoh: Orders ↔ Products

```prisma
model Customer_order {
  id       String                   @id
  products customer_order_product[] // ← Join table
}

model Product {
  id             String                   @id
  customerOrders customer_order_product[] // ← Join table
}

// Join table (explicit many-to-many)
model customer_order_product {
  id              String         @id @default(uuid())
  customerOrder   Customer_order @relation(fields: [customerOrderId], references: [id])
  customerOrderId String
  product         Product        @relation(fields: [productId], references: [id])
  productId       String
  quantity        Int           // ← Extra data di join table
}
```

#### 📊 Visual:

```
Order #1 ←→ [Join: 2x Laptop] ←→ Product: Laptop
Order #1 ←→ [Join: 1x Mouse]  ←→ Product: Mouse
Order #2 ←→ [Join: 1x Laptop] ←→ Product: Laptop
```

#### 💻 Query Example:

```javascript
// Get order dengan products-nya
const order = await prisma.customer_order.findUnique({
  where: { id: "order-id" },
  include: {
    products: {
      include: {
        product: true // Nested include
      }
    }
  }
})

// Output:
{
  id: "order-id",
  total: 5000,
  products: [
    {
      id: "join-1",
      quantity: 2,
      product: { id: "prod-1", title: "Laptop", price: 2000 }
    },
    {
      id: "join-2",
      quantity: 1,
      product: { id: "prod-2", title: "Mouse", price: 1000 }
    }
  ]
}
```

### 4.4 Referential Actions

#### onDelete Options:

| Action | Deskripsi | Contoh |
|--------|-----------|--------|
| `Cascade` | Hapus child jika parent dihapus | Hapus Product → Hapus Wishlist |
| `Restrict` | Cegah hapus parent jika punya child | Tidak bisa hapus Category jika masih punya Product |
| `SetNull` | Set foreign key jadi NULL | Hapus Category → Product.categoryId = NULL |
| `NoAction` | Database handle sendiri | Default MySQL behavior |

#### Contoh di Schema:

```prisma
model Wishlist {
  id        String  @id @default(uuid())
  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  //                                                                 ^^^^^^^^^^^^^^^^
  productId String
}
```

Artinya:

```javascript
// Jika hapus product...
await prisma.product.delete({ where: { id: "prod-1" } })

// ...wishlist items dengan productId "prod-1" ikut terhapus otomatis!
```

---

## 5. Prisma Client

### 5.1 Generate Client

Setiap kali ubah `schema.prisma`, **wajib** jalankan:

```bash
npx prisma generate
```

Ini akan:
1. Generate TypeScript types di `node_modules/.prisma/client`
2. Update auto-completion di IDE
3. Membuat query builder yang type-safe

### 5.2 Import & Initialize

**📁 Cara Pakai di Next.js:**

```javascript
// lib/prisma.ts (Singleton pattern)
import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query', 'error', 'warn'], // Log queries di development
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

**📁 Pakai di API Route:**

```javascript
// app/api/products/route.ts
import { prisma } from '@/lib/prisma'

export async function GET() {
  const products = await prisma.product.findMany()
  return Response.json(products)
}
```

### 5.3 Query Methods

#### CRUD Operations:

| Method | SQL Equivalent | Deskripsi |
|--------|----------------|-----------|
| `findMany()` | `SELECT *` | Ambil banyak record |
| `findUnique()` | `SELECT * WHERE id = ?` | Ambil 1 record by unique field |
| `findFirst()` | `SELECT * LIMIT 1` | Ambil 1 record pertama |
| `create()` | `INSERT INTO` | Buat record baru |
| `update()` | `UPDATE` | Update record |
| `delete()` | `DELETE` | Hapus record |
| `upsert()` | `INSERT ... ON DUPLICATE KEY UPDATE` | Create atau update |
| `count()` | `SELECT COUNT(*)` | Hitung jumlah record |

---

## 6. Migrations

### 6.1 Apa itu Migration?

**Migration** = Version control untuk database schema.

#### 📁 Lokasi Migrations:

```
prisma/migrations/
├── 20240101000000_init/
│   └── migration.sql
├── 20240102000000_add_feedback/
│   └── migration.sql
└── migration_lock.toml
```

### 6.2 Development Workflow

#### 1️⃣ Ubah Schema

Edit `prisma/schema.prisma`:

```prisma
model Product {
  // Tambah field baru:
  discount Float? @default(0)
}
```

#### 2️⃣ Buat Migration

```bash
npx prisma migrate dev --name add_discount_field
```

Output:

```
✔ Migration created: 20240315120000_add_discount_field
✔ Applied migration: 20240315120000_add_discount_field
✔ Generated Prisma Client
```

#### 3️⃣ File Migration Dibuat

`prisma/migrations/20240315120000_add_discount_field/migration.sql`:

```sql
-- AlterTable
ALTER TABLE `Product` ADD COLUMN `discount` DOUBLE NULL DEFAULT 0;
```

### 6.3 Production Deployment

**❌ JANGAN** pakai `prisma migrate dev` di production!

**✅ GUNAKAN:**

```bash
# Deploy pending migrations
npx prisma migrate deploy
```

### 6.4 Migration Commands Lengkap

```bash
# Buat migration baru (development)
npx prisma migrate dev --name nama_migration

# Deploy migrations (production)
npx prisma migrate deploy

# Check migration status
npx prisma migrate status

# Reset database (HAPUS SEMUA DATA!)
npx prisma migrate reset

# Resolve migration conflicts
npx prisma migrate resolve --applied "20240315120000_migration_name"
```

### 6.5 Rollback Migration

⚠️ Prisma **tidak support rollback otomatis**!

**Manual rollback:**

1. Hapus migration file terakhir
2. Edit schema.prisma (kembalikan ke state sebelumnya)
3. Jalankan SQL manual untuk undo changes:

```sql
-- Contoh: hapus field discount
ALTER TABLE `Product` DROP COLUMN `discount`;
```

4. Mark migration sebagai resolved:

```bash
npx prisma migrate resolve --rolled-back "20240315120000_add_discount_field"
```

---

## 7. Seeding

### 7.1 Apa itu Seeding?

**Seeding** = Isi database dengan data awal (dummy data untuk testing).

**📁 Lokasi:** `prisma/seed.js`

### 7.2 Seed Script

```javascript
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const { nanoid } = require("nanoid");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // 1. Create admin user
  const hashedPassword = await bcrypt.hash("admin123456", 14);

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@singitronic.com" },
    update: {},
    create: {
      id: nanoid(),
      email: "admin@singitronic.com",
      password: hashedPassword,
      role: "admin",
    },
  });

  // 2. Create categories
  const category = await prisma.category.upsert({
    where: { name: "Electronics" },
    update: {},
    create: {
      id: nanoid(),
      name: "Electronics",
    },
  });

  // 3. Create products
  await prisma.product.create({
    data: {
      id: nanoid(),
      slug: "laptop-asus-rog",
      title: "ASUS ROG Gaming Laptop",
      mainImage: "/laptop.png",
      price: 15000000, // 15 juta rupiah
      rating: 0,
      description: "Gaming laptop with RTX 4060",
      manufacturer: "ASUS",
      inStock: 10,
      categoryId: category.id,
    },
  });

  console.log("✅ Seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

### 7.3 Konfigurasi package.json

Tambahkan:

```json
{
  "prisma": {
    "seed": "node prisma/seed.js"
  }
}
```

### 7.4 Jalankan Seeding

```bash
# Jalankan seed script
npx prisma db seed

# Atau reset + seed sekaligus
npx prisma migrate reset
```

Output:

```
🌱 Seeding database...
👤 Created users: { admin: 'admin@singitronic.com', testUser: 'testuser@example.com' }
✅ Seeding completed!
```

---

## 8. Query & Operations

### 8.1 Find Operations

#### Find Many (Ambil banyak data):

```javascript
// Ambil semua products
const products = await prisma.product.findMany()

// Dengan filter
const electronicProducts = await prisma.product.findMany({
  where: {
    category: {
      name: "Electronics"
    }
  }
})

// Dengan pagination
const paginatedProducts = await prisma.product.findMany({
  skip: 0,    // Offset
  take: 10,   // Limit
  orderBy: {
    createdAt: 'desc'
  }
})

// Dengan select specific fields
const productTitles = await prisma.product.findMany({
  select: {
    id: true,
    title: true,
    price: true
  }
})
```

#### Find Unique (By ID atau unique field):

```javascript
// By ID
const product = await prisma.product.findUnique({
  where: { id: "product-id" }
})

// By slug (unique field)
const product = await prisma.product.findUnique({
  where: { slug: "laptop-asus-rog" }
})

// Dengan relasi
const product = await prisma.product.findUnique({
  where: { id: "product-id" },
  include: {
    category: true,
    feedbacks: true
  }
})
```

### 8.2 Create Operations

#### Create Single Record:

```javascript
const newProduct = await prisma.product.create({
  data: {
    slug: "iphone-15-pro",
    title: "iPhone 15 Pro",
    mainImage: "/iphone.png",
    price: 17000000,
    description: "Latest iPhone",
    manufacturer: "Apple",
    inStock: 5,
    categoryId: "category-id"
  }
})
```

#### Create dengan Relasi (Nested Create):

```javascript
// Buat product + feedback sekaligus
const product = await prisma.product.create({
  data: {
    slug: "samsung-s24",
    title: "Samsung Galaxy S24",
    mainImage: "/s24.png",
    price: 12000000,
    description: "Flagship Samsung",
    manufacturer: "Samsung",
    inStock: 8,
    category: {
      connect: { id: "category-id" } // Connect ke category existing
    },
    feedbacks: {
      create: [
        {
          userId: "user-id",
          comment: "Great phone!",
          rating: 5
        }
      ]
    }
  }
})
```

### 8.3 Update Operations

```javascript
// Update single field
const updatedProduct = await prisma.product.update({
  where: { id: "product-id" },
  data: {
    price: 15500000 // Update harga
  }
})

// Update multiple fields
const updatedProduct = await prisma.product.update({
  where: { id: "product-id" },
  data: {
    inStock: 20,
    price: 14000000
  }
})

// Increment value
const updatedProduct = await prisma.product.update({
  where: { id: "product-id" },
  data: {
    inStock: {
      increment: 10 // Tambah stok 10
    }
  }
})
```

### 8.4 Delete Operations

```javascript
// Delete single record
await prisma.product.delete({
  where: { id: "product-id" }
})

// Delete many (with filter)
await prisma.product.deleteMany({
  where: {
    inStock: 0 // Hapus produk yang habis
  }
})
```

### 8.5 Upsert (Create or Update)

```javascript
const user = await prisma.user.upsert({
  where: { email: "user@example.com" },
  update: {
    // Jika ada, update ini
    role: "admin"
  },
  create: {
    // Jika tidak ada, create baru
    email: "user@example.com",
    password: "hashedPassword",
    role: "admin"
  }
})
```

### 8.6 Count & Aggregate

```javascript
// Count total products
const count = await prisma.product.count()

// Count dengan filter
const inStockCount = await prisma.product.count({
  where: {
    inStock: {
      gt: 0 // Greater than 0
    }
  }
})

// Aggregate (sum, avg, min, max)
const stats = await prisma.product.aggregate({
  _avg: { price: true },
  _sum: { inStock: true },
  _min: { price: true },
  _max: { price: true }
})

// Output:
{
  _avg: { price: 12500000 },
  _sum: { inStock: 150 },
  _min: { price: 5000000 },
  _max: { price: 20000000 }
}
```

---

## 9. Cara Menambah Field Baru

### 9.1 Langkah-langkah Lengkap

Contoh: Tambah field **`discount`** (diskon dalam persen) ke model Product.

#### ✅ Checklist:

- [ ] Edit Prisma Schema
- [ ] Buat & Jalankan Migration
- [ ] Update TypeScript Types (auto)
- [ ] Update API Routes
- [ ] Update Validasi (Zod)
- [ ] Update UI Components
- [ ] Testing

### 9.2 Step 1: Edit Prisma Schema

**📁 File:** `prisma/schema.prisma`

```prisma
model Product {
  id             String                   @id @default(uuid())
  slug           String                   @unique
  title          String
  mainImage      String
  price          Int                      @default(0)
  rating         Int                      @default(0)
  
  // ✨ TAMBAH FIELD BARU
  discount       Float?                   @default(0)  // Diskon 0-100%
  
  description    String
  manufacturer   String
  inStock        Int                      @default(1)
  categoryId     String
  category       Category                 @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  customerOrders customer_order_product[]
  Wishlist       Wishlist[]
  feedbacks      Feedback[]
}
```

#### 🔍 Penjelasan:

- **`Float?`** = Tipe data decimal, nullable (optional)
- **`@default(0)`** = Default value 0% (tidak ada diskon)
- **Bisa juga:** `Float` (non-nullable) atau `Int` (untuk persentase bulat)

### 9.3 Step 2: Buat Migration

```bash
npx prisma migrate dev --name add_discount_to_product
```

Output:

```
Prisma schema loaded from prisma\schema.prisma
Datasource "db": MySQL database "ecommerce_db" at "localhost:3306"

✔ Migration created: 20240315120000_add_discount_to_product

Applying migration `20240315120000_add_discount_to_product`

The following migration(s) have been applied:

migrations/
  └─ 20240315120000_add_discount_to_product/
    └─ migration.sql

✔ Generated Prisma Client (v6.16.1)
```

**File yang dibuat:**
`prisma/migrations/20240315120000_add_discount_to_product/migration.sql`

```sql
-- AlterTable
ALTER TABLE `Product` ADD COLUMN `discount` DOUBLE NULL DEFAULT 0;
```

### 9.4 Step 3: Update API Routes

**📁 File:** `app/api/products/route.ts`

#### GET (Read):

```typescript
export async function GET() {
  const products = await prisma.product.findMany({
    select: {
      id: true,
      slug: true,
      title: true,
      price: true,
      discount: true, // ✨ Tambahkan discount
      inStock: true,
      // ... field lain
    }
  })

  return Response.json(products)
}
```

#### POST (Create):

```typescript
export async function POST(request: Request) {
  const body = await request.json()
  
  const product = await prisma.product.create({
    data: {
      slug: body.slug,
      title: body.title,
      price: body.price,
      discount: body.discount || 0, // ✨ Default 0
      description: body.description,
      manufacturer: body.manufacturer,
      inStock: body.inStock,
      categoryId: body.categoryId,
      mainImage: body.mainImage
    }
  })

  return Response.json(product)
}
```

#### PUT (Update):

```typescript
export async function PUT(request: Request) {
  const body = await request.json()
  
  const product = await prisma.product.update({
    where: { id: body.id },
    data: {
      discount: body.discount // ✨ Update discount
    }
  })

  return Response.json(product)
}
```

### 9.5 Step 4: Update Validasi (Zod)

**📁 File:** `utils/schema.ts`

```typescript
import { z } from 'zod'

export const ProductSchema = z.object({
  slug: z.string().min(1, "Slug required"),
  title: z.string().min(3, "Title min 3 chars"),
  price: z.number().int().positive("Price must be positive"),
  
  // ✨ TAMBAH VALIDASI DISCOUNT
  discount: z.number()
    .min(0, "Discount tidak boleh negatif")
    .max(100, "Discount maksimal 100%")
    .optional()
    .default(0),
  
  description: z.string().min(10),
  manufacturer: z.string(),
  inStock: z.number().int().min(0),
  categoryId: z.string().uuid(),
  mainImage: z.string().url()
})
```

**Pakai di API:**

```typescript
export async function POST(request: Request) {
  const body = await request.json()
  
  // Validasi dengan Zod
  const validated = ProductSchema.parse(body)
  
  const product = await prisma.product.create({
    data: validated
  })

  return Response.json(product)
}
```

### 9.6 Step 5: Update UI Components

#### Admin Form (Tambah/Edit Product):

**📁 File:** `app/(dashboard)/admin/products/add/page.tsx`

```tsx
"use client"
import { useState } from 'react'

export default function AddProductPage() {
  const [formData, setFormData] = useState({
    title: '',
    price: 0,
    discount: 0, // ✨ State untuk discount
    description: '',
    // ... field lain
  })

  return (
    <form>
      {/* Field lain... */}
      
      {/* ✨ INPUT DISCOUNT */}
      <div>
        <label htmlFor="discount">Diskon (%)</label>
        <input
          type="number"
          id="discount"
          min="0"
          max="100"
          step="0.1"
          value={formData.discount}
          onChange={(e) => setFormData({
            ...formData,
            discount: parseFloat(e.target.value)
          })}
        />
      </div>

      <button type="submit">Simpan</button>
    </form>
  )
}
```

#### Product Card (Tampilkan Diskon):

**📁 File:** `components/ProductItem.tsx`

```tsx
interface ProductItemProps {
  product: {
    id: string
    title: string
    price: number
    discount?: number // ✨ Tambah prop discount
    mainImage: string
  }
}

export default function ProductItem({ product }: ProductItemProps) {
  // Hitung harga setelah diskon
  const discountedPrice = product.discount 
    ? product.price * (1 - product.discount / 100)
    : product.price

  return (
    <div className="product-card">
      <img src={product.mainImage} alt={product.title} />
      <h3>{product.title}</h3>
      
      {/* ✨ TAMPILKAN DISKON */}
      {product.discount > 0 && (
        <div className="discount-badge">
          -{product.discount}%
        </div>
      )}

      <div className="price">
        {product.discount > 0 ? (
          <>
            <span className="original-price line-through">
              Rp {product.price.toLocaleString()}
            </span>
            <span className="discounted-price">
              Rp {discountedPrice.toLocaleString()}
            </span>
          </>
        ) : (
          <span>Rp {product.price.toLocaleString()}</span>
        )}
      </div>
    </div>
  )
}
```

### 9.7 Step 6: Update Seed Data (Optional)

**📁 File:** `prisma/seed.js`

```javascript
await prisma.product.create({
  data: {
    slug: "laptop-asus-rog",
    title: "ASUS ROG Gaming Laptop",
    price: 15000000,
    discount: 10, // ✨ Diskon 10%
    description: "Gaming laptop",
    manufacturer: "ASUS",
    inStock: 10,
    categoryId: category.id,
    mainImage: "/laptop.png"
  }
})
```

### 9.8 Step 7: Testing

```bash
# 1. Test migration
npx prisma migrate dev

# 2. Jalankan seed
npx prisma db seed

# 3. Check di Prisma Studio
npx prisma studio

# 4. Test API
npm run dev
# Buka browser: http://localhost:3000/api/products
```

---

## 10. Prisma Studio

### 10.1 Apa itu Prisma Studio?

**Prisma Studio** = GUI visual untuk manage database (seperti phpMyAdmin).

```bash
# Buka Prisma Studio
npx prisma studio
```

Output:

```
Prisma Studio is up on http://localhost:5555
```

### 10.2 Fitur Prisma Studio

✅ **Lihat semua data** dalam table
✅ **CRUD operations** (Create, Read, Update, Delete)
✅ **Filter & Search** data
✅ **Edit relasi** antar table
✅ **Export data** ke JSON/CSV

### 10.3 Cara Pakai

1. Jalankan `npx prisma studio`
2. Buka browser: `http://localhost:5555`
3. Pilih model (Product, User, Order, dll.)
4. Click row untuk edit
5. Click "Add record" untuk insert baru

### 10.4 Shortcuts

| Action | Shortcut |
|--------|----------|
| Save changes | `Ctrl + S` atau `Cmd + S` |
| Add record | `Ctrl + N` atau `Cmd + N` |
| Delete record | `Ctrl + D` atau `Cmd + D` |
| Search | `Ctrl + F` atau `Cmd + F` |

---

## 11. Best Practices

### 11.1 ✅ DO's (Lakukan)

#### 1. Selalu Generate Client Setelah Ubah Schema

```bash
# Setelah edit schema.prisma:
npx prisma generate
```

#### 2. Gunakan Transactions untuk Multiple Operations

```javascript
// ❌ SALAH: Tidak atomic
await prisma.product.update({ where: { id }, data: { inStock: { decrement: 1 } } })
await prisma.customer_order.create({ data: orderData })

// ✅ BENAR: Gunakan transaction
await prisma.$transaction([
  prisma.product.update({ where: { id }, data: { inStock: { decrement: 1 } } }),
  prisma.customer_order.create({ data: orderData })
])
```

#### 3. Gunakan Select untuk Optimize Query

```javascript
// ❌ Ambil semua fields (lambat)
const products = await prisma.product.findMany()

// ✅ Ambil hanya yang diperlukan
const products = await prisma.product.findMany({
  select: {
    id: true,
    title: true,
    price: true,
    mainImage: true
  }
})
```

#### 4. Gunakan Pagination

```javascript
// ✅ Pagination untuk data besar
const products = await prisma.product.findMany({
  skip: (page - 1) * pageSize,
  take: pageSize,
  orderBy: { createdAt: 'desc' }
})
```

#### 5. Handle Errors dengan Baik

```javascript
try {
  const product = await prisma.product.create({ data })
} catch (error) {
  if (error.code === 'P2002') {
    // Unique constraint violation
    console.error("Product dengan slug ini sudah ada!")
  }
  throw error
}
```

### 11.2 ❌ DON'Ts (Jangan)

#### 1. Jangan Query di Loop

```javascript
// ❌ SALAH: N+1 query problem
const orders = await prisma.customer_order.findMany()
for (const order of orders) {
  const products = await prisma.customer_order_product.findMany({
    where: { customerOrderId: order.id }
  })
}

// ✅ BENAR: Use include
const orders = await prisma.customer_order.findMany({
  include: { products: true }
})
```

#### 2. Jangan Hardcode Connection String

```javascript
// ❌ SALAH
datasource db {
  url = "mysql://root:password@localhost:3306/db"
}

// ✅ BENAR
datasource db {
  url = env("DATABASE_URL")
}
```

#### 3. Jangan Pakai `migrate dev` di Production

```bash
# ❌ SALAH (di production)
npx prisma migrate dev

# ✅ BENAR (di production)
npx prisma migrate deploy
```

---

## 12. Troubleshooting

### 12.1 Error: "Can't reach database server"

**Error:**
```
Can't reach database server at `localhost:3306`
```

**Solusi:**

1. Check MySQL running:
```bash
# Windows
net start MySQL80

# Linux/Mac
sudo service mysql start
```

2. Check `.env`:
```env
DATABASE_URL="mysql://root:password@localhost:3306/ecommerce_db"
```

3. Test koneksi:
```bash
npx prisma db pull
```

### 12.2 Error: "Table does not exist"

**Error:**
```
The table `main.Product` does not exist in the current database.
```

**Solusi:**

```bash
# Jalankan migrations
npx prisma migrate dev

# Atau push schema
npx prisma db push
```

### 12.3 Error: "Migration is in a failed state"

**Error:**
```
Migration `20240315_add_field` failed to apply
```

**Solusi:**

```bash
# Option 1: Resolve as applied
npx prisma migrate resolve --applied "20240315_add_field"

# Option 2: Resolve as rolled back
npx prisma migrate resolve --rolled-back "20240315_add_field"

# Option 3: Reset database (HAPUS DATA!)
npx prisma migrate reset
```

### 12.4 Error: "Type 'Product' is not assignable"

**Error:**
```
Type 'Product' is not assignable to type '...'
```

**Solusi:**

```bash
# Regenerate Prisma Client
npx prisma generate

# Restart TypeScript server di VSCode
# Ctrl+Shift+P → "TypeScript: Restart TS Server"
```

### 12.5 Error: "Unique constraint failed"

**Error:**
```
Unique constraint failed on the fields: (`email`)
```

**Solusi:**

```javascript
// Gunakan upsert atau check dulu
const existing = await prisma.user.findUnique({
  where: { email }
})

if (existing) {
  throw new Error("Email already exists")
}

// Atau gunakan upsert
await prisma.user.upsert({
  where: { email },
  update: { /* update data */ },
  create: { /* create data */ }
})
```

---

## 📚 Referensi

### Official Documentation:
- [Prisma Docs](https://www.prisma.io/docs)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Prisma Client API](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)

---

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

# ➕ PENAMBAHAN FIELD - TUTORIAL LENGKAP

**Tutorial Step-by-Step Menambah Field Baru di Database, API, dan UI**

---

## 📑 Daftar Isi

1. [Overview](#1-overview)
2. [Contoh Kasus: Tambah Field Discount](#2-contoh-kasus-tambah-field-discount)
3. [Step 1: Update Prisma Schema](#3-step-1-update-prisma-schema)
4. [Step 2: Migration Database](#4-step-2-migration-database)
5. [Step 3: Update TypeScript Types](#5-step-3-update-typescript-types)
6. [Step 4: Update Validasi (Zod)](#6-step-4-update-validasi-zod)
7. [Step 5: Update API Routes](#7-step-5-update-api-routes)
8. [Step 6: Update UI Components](#8-step-6-update-ui-components)
9. [Step 7: Update Admin Dashboard](#9-step-7-update-admin-dashboard)
10. [Step 8: Testing](#10-step-8-testing)
11. [Contoh Lain: Tambah Field di Model User](#11-contoh-lain-tambah-field-di-model-user)
12. [Best Practices](#12-best-practices)
13. [Troubleshooting](#13-troubleshooting)

---

## 1. Overview

### 1.1 Workflow Penambahan Field

```
┌─────────────────────────────────────────────────┐
│         Workflow Tambah Field Baru              │
├─────────────────────────────────────────────────┤
│                                                 │
│  1. Update Prisma Schema (schema.prisma)       │
│     └─ Tambah field di model                   │
│                                                 │
│  2. Generate Migration                         │
│     └─ npx prisma migrate dev                  │
│                                                 │
│  3. Update TypeScript Types (Auto)             │
│     └─ npx prisma generate                     │
│                                                 │
│  4. Update Validasi (Zod)                      │
│     └─ Tambah validasi field baru              │
│                                                 │
│  5. Update API Routes                          │
│     └─ GET, POST, PUT, DELETE                  │
│                                                 │
│  6. Update UI Components                       │
│     └─ Forms, cards, detail pages              │
│                                                 │
│  7. Update Admin Dashboard                     │
│     └─ Table columns, form inputs              │
│                                                 │
│  8. Testing                                    │
│     └─ Test CRUD operations                    │
│                                                 │
└─────────────────────────────────────────────────┘
```

### 1.2 Checklist Lengkap

**✅ Sebelum Mulai:**

- [ ] Backup database
- [ ] Commit perubahan terakhir
- [ ] Tentukan nama field & tipe data
- [ ] Tentukan apakah nullable atau required
- [ ] Tentukan default value (jika ada)

**✅ Proses:**

- [ ] Update Prisma schema
- [ ] Jalankan migration
- [ ] Generate Prisma Client
- [ ] Update Zod schema
- [ ] Update API routes (GET, POST, PUT)
- [ ] Update forms (admin)
- [ ] Update display components
- [ ] Update TypeScript interfaces (jika manual)

**✅ Setelah Selesai:**

- [ ] Test CRUD via API
- [ ] Test admin dashboard
- [ ] Test frontend display
- [ ] Commit changes
- [ ] Update dokumentasi

---

## 2. Contoh Kasus: Tambah Field Discount

### 2.1 Requirement

**Target:** Tambah field `discount` ke model `Product`

**Spesifikasi:**
- **Field name:** `discount`
- **Type:** `Float` (decimal untuk persentase)
- **Nullable:** Yes (optional)
- **Default:** `0` (tidak ada diskon)
- **Range:** 0-100 (persen)
- **Use case:** Untuk menampilkan diskon produk

### 2.2 Visual Before & After

**BEFORE:**

```prisma
model Product {
  id           String  @id @default(uuid())
  title        String
  price        Int
  description  String
  inStock      Int
}
```

**AFTER:**

```prisma
model Product {
  id           String  @id @default(uuid())
  title        String
  price        Int
  discount     Float?  @default(0)  // ✨ NEW!
  description  String
  inStock      Int
}
```

---

## 3. Step 1: Update Prisma Schema

### 3.1 Edit Schema File

**📁 File:** `prisma/schema.prisma`

**Lokasi:** Tambah field di model Product (sekitar baris 24)

```prisma
model Product {
  id             String                   @id @default(uuid())
  slug           String                   @unique
  title          String
  mainImage      String
  price          Int                      @default(0)
  rating         Int                      @default(0)
  
  // ✨✨✨ TAMBAH FIELD BARU DI SINI ✨✨✨
  discount       Float?                   @default(0)
  
  description    String
  manufacturer   String
  inStock        Int                      @default(1)
  categoryId     String
  category       Category                 @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  customerOrders customer_order_product[]
  Wishlist       Wishlist[]
  feedbacks      Feedback[]
}
```

### 3.2 Pilihan Tipe Data

| Prisma Type | SQL Type | Contoh Use Case | Range |
|-------------|----------|-----------------|-------|
| `String` | VARCHAR | Nama, URL, text pendek | - |
| `String @db.Text` | TEXT | Deskripsi panjang | - |
| `Int` | INT | Harga (dalam cent), stok | -2³¹ to 2³¹-1 |
| `Float` | DOUBLE | Persentase, rating decimal | - |
| `Boolean` | TINYINT(1) | Active/inactive, featured | true/false |
| `DateTime` | DATETIME | Tanggal, timestamp | - |
| `Json` | JSON | Data structured | - |

### 3.3 Attribute Options

```prisma
// Nullable (optional)
discount Float?

// Non-nullable (required)
discount Float

// Dengan default value
discount Float @default(0)

// Nullable dengan default
discount Float? @default(0)

// Unique constraint
email String @unique

// Index untuk query cepat
@@index([discount])

// Multiple field index
@@index([categoryId, discount])
```

### 3.4 Validasi di Schema Level

```prisma
model Product {
  // Basic field
  discount Float? @default(0)
  
  // Dengan custom database type
  discount Float? @default(0) @db.Decimal(5,2)
  // Decimal(5,2) = max 999.99
  
  // Field dengan komentar
  /// Discount percentage (0-100)
  discount Float? @default(0)
}
```

---

## 4. Step 2: Migration Database

### 4.1 Generate Migration

```bash
# Syntax:
npx prisma migrate dev --name nama_migration

# Contoh untuk case ini:
npx prisma migrate dev --name add_discount_to_product
```

**Output yang diharapkan:**

```
Environment variables loaded from .env
Prisma schema loaded from prisma\schema.prisma
Datasource "db": MySQL database "ecommerce_db" at "localhost:3306"

✔ Enter a name for the new migration: … add_discount_to_product

Applying migration `20250310120000_add_discount_to_product`

The following migration(s) have been created and applied from new schema changes:

migrations/
  └─ 20250310120000_add_discount_to_product/
    └─ migration.sql

✔ Generated Prisma Client (v6.16.1)
```

### 4.2 File Migration yang Dibuat

**📁 File:** `prisma/migrations/20250310120000_add_discount_to_product/migration.sql`

```sql
-- AlterTable
ALTER TABLE `Product` ADD COLUMN `discount` DOUBLE NULL DEFAULT 0;
```

### 4.3 Cek Migration Status

```bash
# Cek status migrations
npx prisma migrate status

# Output:
Database schema is up to date!
```

### 4.4 Jika Migration Gagal

```bash
# Rollback migration (manual)
# 1. Hapus field di schema.prisma
# 2. Hapus folder migration yang baru
# 3. Jalankan SQL manual untuk drop column

# SQL untuk rollback:
ALTER TABLE `Product` DROP COLUMN `discount`;

# 4. Resolve migration
npx prisma migrate resolve --rolled-back "20250310120000_add_discount_to_product"
```

---

## 5. Step 3: Update TypeScript Types

### 5.1 Generate Prisma Client

```bash
# Auto-generate TypeScript types
npx prisma generate
```

**Output:**

```
✔ Generated Prisma Client (v6.16.1) to ./node_modules/@prisma/client
```

### 5.2 TypeScript Types (Auto-Generated)

Setelah generate, type Product otomatis punya field `discount`:

```typescript
// node_modules/.prisma/client/index.d.ts (auto-generated)
export type Product = {
  id: string
  slug: string
  title: string
  mainImage: string
  price: number
  rating: number
  discount: number | null  // ✨ NEW!
  description: string
  manufacturer: string
  inStock: number
  categoryId: string
}
```

### 5.3 Manual Type Definitions (Jika Perlu)

Jika punya custom types:

**📁 File:** `types/product.ts`

```typescript
export interface ProductWithDiscount {
  id: string
  title: string
  price: number
  discount?: number  // ✨ Tambahkan ini
  finalPrice: number // Computed: price - (price * discount/100)
}

// Helper function
export function calculateFinalPrice(price: number, discount?: number): number {
  if (!discount) return price
  return price - (price * discount / 100)
}
```

---

## 6. Step 4: Update Validasi (Zod)

### 6.1 Update Zod Schema

**📁 File:** `utils/schema.ts` atau `lib/validation.ts`

```typescript
import { z } from 'zod'

// SEBELUM:
export const ProductSchema = z.object({
  slug: z.string().min(1, "Slug required"),
  title: z.string().min(3, "Title min 3 chars"),
  price: z.number().int().positive("Price must be positive"),
  description: z.string().min(10),
  manufacturer: z.string(),
  inStock: z.number().int().min(0),
  categoryId: z.string().uuid(),
  mainImage: z.string().url()
})

// SETELAH:
export const ProductSchema = z.object({
  slug: z.string().min(1, "Slug required"),
  title: z.string().min(3, "Title min 3 chars"),
  price: z.number().int().positive("Price must be positive"),
  
  // ✨✨✨ TAMBAH VALIDASI DISCOUNT ✨✨✨
  discount: z.number()
    .min(0, "Discount tidak boleh negatif")
    .max(100, "Discount maksimal 100%")
    .optional()
    .default(0),
  
  description: z.string().min(10),
  manufacturer: z.string(),
  inStock: z.number().int().min(0),
  categoryId: z.string().uuid(),
  mainImage: z.string().url()
})

// Type inference from Zod
export type ProductInput = z.infer<typeof ProductSchema>
```

### 6.2 Validasi di API Route

```typescript
// app/api/products/route.ts
import { ProductSchema } from '@/utils/schema'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validasi dengan Zod
    const validated = ProductSchema.parse(body)
    
    // Jika validation pass, lanjut create
    const product = await prisma.product.create({
      data: validated
    })
    
    return Response.json(product)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        { error: error.errors },
        { status: 400 }
      )
    }
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
```

---

## 7. Step 5: Update API Routes

### 7.1 GET Route (Read)

**📁 File:** `app/api/products/route.ts`

```typescript
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')

  const products = await prisma.product.findMany({
    skip: (page - 1) * limit,
    take: limit,
    select: {
      id: true,
      slug: true,
      title: true,
      price: true,
      discount: true,  // ✨ TAMBAHKAN INI
      mainImage: true,
      rating: true,
      inStock: true,
      category: {
        select: {
          name: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return NextResponse.json({
    products,
    page,
    limit
  })
}
```

### 7.2 GET Single Product

**📁 File:** `app/api/products/[slug]/route.ts`

```typescript
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: {
      category: true,
      feedbacks: true,
      discount: true  // ✨ Include discount
    }
  })

  if (!product) {
    return NextResponse.json(
      { error: 'Product not found' },
      { status: 404 }
    )
  }

  return NextResponse.json(product)
}
```

### 7.3 POST Route (Create)

```typescript
export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validasi
    const validated = ProductSchema.parse(body)
    
    // Create product dengan discount
    const product = await prisma.product.create({
      data: {
        slug: validated.slug,
        title: validated.title,
        price: validated.price,
        discount: validated.discount || 0,  // ✨ Tambahkan discount
        description: validated.description,
        manufacturer: validated.manufacturer,
        inStock: validated.inStock,
        categoryId: validated.categoryId,
        mainImage: validated.mainImage,
        rating: 0
      }
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    // Error handling...
  }
}
```

### 7.4 PUT Route (Update)

```typescript
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    // Partial validation untuk update
    const PartialProductSchema = ProductSchema.partial()
    const validated = PartialProductSchema.parse(body)
    
    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        ...validated,
        discount: validated.discount  // ✨ Update discount
      }
    })

    return NextResponse.json(product)
  } catch (error) {
    // Error handling...
  }
}
```

---

## 8. Step 6: Update UI Components

### 8.1 Product Card Component

**📁 File:** `components/ProductItem.tsx`

```tsx
interface ProductItemProps {
  product: {
    id: string
    slug: string
    title: string
    price: number
    discount?: number  // ✨ Tambah prop
    mainImage: string
    rating: number
  }
}

export default function ProductItem({ product }: ProductItemProps) {
  // ✨ Hitung harga setelah diskon
  const hasDiscount = product.discount && product.discount > 0
  const finalPrice = hasDiscount
    ? product.price * (1 - product.discount! / 100)
    : product.price

  return (
    <div className="product-card border rounded-lg p-4 hover:shadow-lg transition">
      {/* ✨ Badge diskon */}
      {hasDiscount && (
        <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-bold">
          -{product.discount}%
        </div>
      )}

      <img 
        src={product.mainImage} 
        alt={product.title}
        className="w-full h-48 object-cover rounded"
      />
      
      <h3 className="mt-3 font-semibold text-lg">{product.title}</h3>
      
      {/* ✨ Tampilan harga dengan diskon */}
      <div className="mt-2 flex items-center gap-2">
        {hasDiscount ? (
          <>
            <span className="text-gray-400 line-through text-sm">
              Rp {product.price.toLocaleString()}
            </span>
            <span className="text-custom-yellow font-bold text-xl">
              Rp {finalPrice.toLocaleString()}
            </span>
          </>
        ) : (
          <span className="text-custom-yellow font-bold text-xl">
            Rp {product.price.toLocaleString()}
          </span>
        )}
      </div>
      
      {/* ✨ Text saved amount */}
      {hasDiscount && (
        <p className="text-green-600 text-sm mt-1">
          Hemat Rp {(product.price - finalPrice).toLocaleString()}
        </p>
      )}
    </div>
  )
}
```

### 8.2 Product Detail Page

**📁 File:** `app/product/[slug]/page.tsx`

```tsx
export default async function ProductDetailPage({ 
  params 
}: { 
  params: { slug: string } 
}) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: { category: true }
  })

  const hasDiscount = product?.discount && product.discount > 0
  const finalPrice = hasDiscount
    ? product.price * (1 - product.discount! / 100)
    : product.price

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image */}
        <div>
          <img 
            src={product.mainImage} 
            alt={product.title}
            className="w-full rounded-lg"
          />
        </div>

        {/* Info */}
        <div>
          <h1 className="text-3xl font-bold">{product.title}</h1>
          
          {/* ✨ Price dengan discount */}
          <div className="mt-4">
            {hasDiscount && (
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  {product.discount}% OFF
                </span>
                <span className="text-gray-500 line-through text-lg">
                  Rp {product.price.toLocaleString()}
                </span>
              </div>
            )}
            
            <div className="text-4xl font-bold text-custom-yellow">
              Rp {finalPrice.toLocaleString()}
            </div>
            
            {hasDiscount && (
              <p className="text-green-600 mt-1">
                Anda hemat Rp {(product.price - finalPrice).toLocaleString()}
              </p>
            )}
          </div>

          {/* Description */}
          <p className="mt-6 text-gray-600">{product.description}</p>
          
          {/* Actions */}
          <div className="mt-8 flex gap-4">
            <button className="btn btn-primary flex-1">
              Add to Cart
            </button>
            <button className="btn btn-outline">
              Add to Wishlist
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
```

---

## 9. Step 7: Update Admin Dashboard

### 9.1 Admin Product Table

**📁 File:** `components/DashboardProductTable.tsx`

```tsx
export default function DashboardProductTable({ products }: Props) {
  return (
    <table className="table w-full">
      <thead>
        <tr>
          <th>ID</th>
          <th>Title</th>
          <th>Price</th>
          <th>Discount</th>  {/* ✨ New column */}
          <th>Final Price</th>  {/* ✨ New column */}
          <th>Stock</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => {
          const finalPrice = product.discount
            ? product.price * (1 - product.discount / 100)
            : product.price

          return (
            <tr key={product.id}>
              <td>{product.id.slice(0, 8)}...</td>
              <td>{product.title}</td>
              <td>Rp {product.price.toLocaleString()}</td>
              
              {/* ✨ Discount column */}
              <td>
                {product.discount ? (
                  <span className="badge badge-error">
                    -{product.discount}%
                  </span>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </td>
              
              {/* ✨ Final price column */}
              <td className="font-bold">
                Rp {finalPrice.toLocaleString()}
              </td>
              
              <td>{product.inStock}</td>
              <td>
                <button className="btn btn-sm btn-primary">Edit</button>
                <button className="btn btn-sm btn-error">Delete</button>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
```

### 9.2 Admin Add/Edit Product Form

**📁 File:** `app/(dashboard)/admin/products/add/page.tsx`

```tsx
"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AddProductPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    price: 0,
    discount: 0,  // ✨ New field
    description: '',
    manufacturer: '',
    inStock: 0,
    categoryId: '',
    mainImage: ''
  })

  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        router.push('/admin/products')
      } else {
        const error = await response.json()
        alert(error.message)
      }
    } catch (error) {
      console.error(error)
      alert('Failed to create product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Add New Product</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="label">
            <span className="label-text">Product Title</span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>

        {/* Price & Discount (side by side) */}
        <div className="grid grid-cols-2 gap-4">
          {/* Price */}
          <div>
            <label className="label">
              <span className="label-text">Price (Rp)</span>
            </label>
            <input
              type="number"
              className="input input-bordered w-full"
              value={formData.price}
              onChange={(e) => setFormData({ 
                ...formData, 
                price: parseInt(e.target.value) 
              })}
              required
            />
          </div>

          {/* ✨✨✨ DISCOUNT INPUT ✨✨✨ */}
          <div>
            <label className="label">
              <span className="label-text">Discount (%)</span>
            </label>
            <input
              type="number"
              className="input input-bordered w-full"
              min="0"
              max="100"
              step="0.1"
              value={formData.discount}
              onChange={(e) => setFormData({ 
                ...formData, 
                discount: parseFloat(e.target.value) 
              })}
            />
            <label className="label">
              <span className="label-text-alt text-gray-500">
                0-100% (optional, default: 0)
              </span>
            </label>
          </div>
        </div>

        {/* ✨ Preview harga final */}
        {formData.discount > 0 && (
          <div className="alert alert-info">
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div>
                <h3 className="font-bold">Price Preview</h3>
                <div className="text-xs">
                  Original: Rp {formData.price.toLocaleString()}
                  <br />
                  Final: Rp {(formData.price * (1 - formData.discount / 100)).toLocaleString()}
                  <br />
                  You save: Rp {(formData.price * formData.discount / 100).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Other fields... */}
        <div>
          <label className="label">
            <span className="label-text">Description</span>
          </label>
          <textarea
            className="textarea textarea-bordered w-full"
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
        </div>

        {/* Submit */}
        <button 
          type="submit" 
          className="btn btn-primary w-full"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Product'}
        </button>
      </form>
    </div>
  )
}
```

---

## 10. Step 8: Testing

### 10.1 Test di Prisma Studio

```bash
# Buka Prisma Studio
npx prisma studio
```

1. Buka table `Product`
2. Add record baru
3. Isi field `discount` dengan nilai `10` (10%)
4. Save
5. Verify data tersimpan

### 10.2 Test API dengan cURL

```bash
# Test GET all products
curl http://localhost:3000/api/products

# Test POST create product
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "test-product-discount",
    "title": "Test Product with Discount",
    "price": 100000,
    "discount": 15,
    "description": "Test description",
    "manufacturer": "Test Brand",
    "inStock": 10,
    "categoryId": "category-id-here",
    "mainImage": "https://example.com/image.jpg"
  }'

# Test PUT update discount
curl -X PUT http://localhost:3000/api/products/product-id \
  -H "Content-Type: application/json" \
  -d '{"discount": 20}'
```

### 10.3 Test di Frontend

**Manual Testing Checklist:**

- [ ] Product list menampilkan badge diskon
- [ ] Harga coret tampil jika ada diskon
- [ ] Final price dihitung dengan benar
- [ ] Product detail page menampilkan diskon
- [ ] Admin form bisa input discount
- [ ] Admin table menampilkan kolom discount
- [ ] Validasi 0-100% berfungsi
- [ ] Error handling untuk input invalid

### 10.4 Test Case Examples

```typescript
// Test case 1: Discount 0% (no discount)
const product1 = {
  price: 100000,
  discount: 0
}
const expected1 = 100000
const actual1 = calculateFinalPrice(product1.price, product1.discount)
console.assert(actual1 === expected1, 'Test 1 failed')

// Test case 2: Discount 10%
const product2 = {
  price: 100000,
  discount: 10
}
const expected2 = 90000
const actual2 = calculateFinalPrice(product2.price, product2.discount)
console.assert(actual2 === expected2, 'Test 2 failed')

// Test case 3: Discount 50%
const product3 = {
  price: 200000,
  discount: 50
}
const expected3 = 100000
const actual3 = calculateFinalPrice(product3.price, product3.discount)
console.assert(actual3 === expected3, 'Test 3 failed')

// Test case 4: Discount null/undefined
const product4 = {
  price: 100000,
  discount: undefined
}
const expected4 = 100000
const actual4 = calculateFinalPrice(product4.price, product4.discount)
console.assert(actual4 === expected4, 'Test 4 failed')
```

---

## 11. Contoh Lain: Tambah Field di Model User

### 11.1 Requirement

**Target:** Tambah field `phone` dan `address` ke model `User`

### 11.2 Step 1: Update Schema

```prisma
model User {
  id        String     @id @default(uuid())
  email     String     @unique
  password  String?
  role      String?    @default("user")
  
  // ✨ NEW FIELDS
  phone     String?    // Optional phone number
  address   String?    @db.Text  // Optional address (longer text)
  
  Wishlist  Wishlist[]
  feedbacks Feedback[]
}
```

### 11.3 Step 2: Migration

```bash
npx prisma migrate dev --name add_phone_address_to_user
```

### 11.4 Step 3: Update Validasi

```typescript
export const UpdateUserProfileSchema = z.object({
  email: z.string().email().optional(),
  phone: z.string()
    .regex(/^(\+62|62|0)[0-9]{9,12}$/, "Format nomor HP tidak valid")
    .optional(),
  address: z.string()
    .min(10, "Alamat minimal 10 karakter")
    .max(500, "Alamat maksimal 500 karakter")
    .optional()
})
```

### 11.5 Step 4: Update API

```typescript
// app/api/user/profile/route.ts
export async function PUT(request: Request) {
  const session = await getServerSession()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const validated = UpdateUserProfileSchema.parse(body)

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      phone: validated.phone,
      address: validated.address
    }
  })

  return NextResponse.json(user)
}
```

### 11.6 Step 5: Update UI Form

```tsx
// app/profile/edit/page.tsx
export default function EditProfilePage() {
  const [formData, setFormData] = useState({
    phone: '',
    address: ''
  })

  return (
    <form>
      <div>
        <label>Phone Number</label>
        <input
          type="tel"
          placeholder="+62 812-3456-7890"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
      </div>

      <div>
        <label>Address</label>
        <textarea
          placeholder="Jl. Contoh No. 123, Jakarta"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          rows={4}
        />
      </div>

      <button type="submit">Save Changes</button>
    </form>
  )
}
```

---

## 12. Best Practices

### 12.1 ✅ DO's

#### 1. Gunakan Nullable untuk Field Optional

```prisma
// ✅ BENAR: Optional field
discount Float? @default(0)

// ❌ SALAH: Required field tanpa default
discount Float
```

#### 2. Berikan Default Value yang Masuk Akal

```prisma
// ✅ BENAR
discount Float? @default(0)
isActive Boolean @default(true)
createdAt DateTime @default(now())

// ❌ SALAH: No default untuk required field
isActive Boolean  // Bisa error jika tidak diisi
```

#### 3. Validasi di Multiple Layers

```
1. Database Level (Prisma schema constraints)
2. API Level (Zod validation)
3. UI Level (HTML5 validation + client-side)
```

#### 4. Commit per Step

```bash
git add prisma/schema.prisma
git commit -m "feat: add discount field to Product model"

git add app/api/products/
git commit -m "feat: update product API to handle discount"

git add components/ProductItem.tsx
git commit -m "feat: display discount badge in product card"
```

### 12.2 ❌ DON'Ts

#### 1. Jangan Lupa Generate Client

```bash
# ❌ SALAH: Edit schema tapi lupa generate
# Edit schema.prisma
# Langsung coding...  <- TYPE ERROR!

# ✅ BENAR: Generate setelah edit schema
# Edit schema.prisma
npx prisma generate  # <- Wajib!
# Baru coding
```

#### 2. Jangan Hardcode Type di Banyak Tempat

```typescript
// ❌ SALAH: Duplicate type definition
interface ProductA {
  id: string
  discount?: number
}

interface ProductB {
  id: string
  discount?: number
}

// ✅ BENAR: Import from Prisma
import { Product } from '@prisma/client'
```

#### 3. Jangan Skip Validasi

```typescript
// ❌ SALAH: No validation
const discount = req.body.discount  // Bisa -100 atau 999!

// ✅ BENAR: Validate first
const schema = z.object({
  discount: z.number().min(0).max(100)
})
const { discount } = schema.parse(req.body)
```

---

## 13. Troubleshooting

### 13.1 Error: "Field does not exist"

**Error:**
```
Unknown field `discount` for type `Product`.
```

**Penyebab:** Lupa generate Prisma Client.

**Solusi:**
```bash
npx prisma generate
```

### 13.2 Error: "Migration failed"

**Error:**
```
Migration failed to apply cleanly to a temporary database.
```

**Solusi:**

```bash
# 1. Check database connection
npx prisma db pull

# 2. Reset dan migrate ulang
npx prisma migrate reset
npx prisma migrate dev

# 3. Jika masih error, cek database manual
mysql -u root -p
USE ecommerce_db;
DESCRIBE Product;  # Check if column exists
```

### 13.3 Error: "Type error" di TypeScript

**Error:**
```
Property 'discount' does not exist on type 'Product'
```

**Solusi:**

```bash
# 1. Generate ulang
npx prisma generate

# 2. Restart TS Server (VSCode)
# Ctrl+Shift+P → "TypeScript: Restart TS Server"

# 3. Restart dev server
# Ctrl+C
npm run dev
```

### 13.4 Error: "Zod validation failed"

**Error:**
```
ZodError: [
  {
    "code": "too_big",
    "maximum": 100,
    "path": ["discount"],
    "message": "Discount maksimal 100%"
  }
]
```

**Penyebab:** Input melebihi validasi (misalnya discount 150%).

**Solusi:** Fix input value atau adjust validasi range.

---

## 📋 Quick Reference

### Syntax Cheat Sheet

```prisma
// Prisma Schema Field Syntax
fieldName  Type       Modifier  Attribute    Default

discount   Float      ?         @default(0)  @db.Decimal(5,2)
│          │          │         │            │
│          │          │         │            └─ Database-specific type
│          │          │         └─ Default value
│          │          └─ Optional (nullable)
│          └─ Data type
└─ Field name (camelCase)
```

### Common Field Patterns

```prisma
// String fields
name       String                    // Required varchar
slug       String      @unique       // Unique identifier
bio        String?     @db.Text      // Optional long text

// Number fields
price      Int         @default(0)   // Integer with default
rating     Float       @default(0.0) // Decimal
quantity   Int         @default(1)   // Stock count

// Boolean
isActive   Boolean     @default(true)
featured   Boolean     @default(false)

// DateTime
createdAt  DateTime    @default(now())
updatedAt  DateTime    @updatedAt

// Relations
userId     String                    // Foreign key
user       User        @relation(fields: [userId], references: [id])
```

---

## 📚 Referensi

### External Links

- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Prisma Migrate Guide](https://www.prisma.io/docs/guides/migrate)
- [Zod Documentation](https://zod.dev/)

---

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


