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

**📌 Next Steps:**

Lanjutkan ke dokumentasi berikutnya:
- 🔐 **[03-AUTHENTICATION-AUTHORIZATION.md](./03-AUTHENTICATION-AUTHORIZATION.md)** - Setup authentication lengkap
- ✅ **[04-VALIDASI-DATA.md](./04-VALIDASI-DATA.md)** - Validasi & sanitization

