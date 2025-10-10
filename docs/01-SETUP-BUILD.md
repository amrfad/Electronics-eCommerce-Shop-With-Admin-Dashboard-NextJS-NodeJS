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

**✅ Setup Selesai!**

Jika semua langkah di atas berhasil, Anda siap untuk mulai development! 🎉

Lanjutkan ke dokumentasi berikutnya:
- 📖 **[02-STRUKTUR-ARSITEKTUR.md](./02-STRUKTUR-ARSITEKTUR.md)** - Memahami struktur project
- 🔐 **[03-AUTHENTICATION-AUTHORIZATION.md](./03-AUTHENTICATION-AUTHORIZATION.md)** - Setup authentication

