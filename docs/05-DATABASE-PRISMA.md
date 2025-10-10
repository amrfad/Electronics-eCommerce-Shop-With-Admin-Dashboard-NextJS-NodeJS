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

### Related Docs:
- [01-SETUP-BUILD.md](./01-SETUP-BUILD.md) - Database configuration
- [04-VALIDASI-DATA.md](./04-VALIDASI-DATA.md) - Data validation dengan Zod
- [07-PENAMBAHAN-FIELD.md](./07-PENAMBAHAN-FIELD.md) - Tutorial lengkap tambah field

---

**✅ Dokumentasi Database & Prisma Selesai!**

Next: [06-UPGRADE-LIBRARIES.md](./06-UPGRADE-LIBRARIES.md) - Cara upgrade React, Next.js, Prisma, dll.
