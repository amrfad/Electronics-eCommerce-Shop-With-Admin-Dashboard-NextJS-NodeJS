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

### Related Docs

- [05-DATABASE-PRISMA.md](./05-DATABASE-PRISMA.md) - Prisma schema & migrations
- [04-VALIDASI-DATA.md](./04-VALIDASI-DATA.md) - Zod validation
- [02-STRUKTUR-ARSITEKTUR.md](./02-STRUKTUR-ARSITEKTUR.md) - API routes structure

### External Links

- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Prisma Migrate Guide](https://www.prisma.io/docs/guides/migrate)
- [Zod Documentation](https://zod.dev/)

---

**✅ Dokumentasi Penambahan Field Selesai!**

Next: [08-API-DATA-FLOW.md](./08-API-DATA-FLOW.md) - API routes & data flow documentation
