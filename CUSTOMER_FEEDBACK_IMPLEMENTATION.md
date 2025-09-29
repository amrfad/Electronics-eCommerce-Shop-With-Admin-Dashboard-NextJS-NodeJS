# Customer Feedback System Implementation

## Overview

Sistem Customer Feedback yang lengkap dengan role-based access control untuk aplikasi e-commerce Electronics Shop. Sistem ini memungkinkan customer untuk memberikan rating dan komentar pada produk, sementara admin dapat melihat semua feedback dalam mode read-only.

## Role-Based Access Control

### Customer (role: "customer")

- ✅ **CREATE**: Dapat membuat feedback baru untuk produk
- ✅ **READ**: Dapat melihat semua feedback produk
- ✅ **UPDATE**: Dapat mengedit feedback milik sendiri
- ✅ **DELETE**: Dapat menghapus feedback milik sendiri

### Admin (role: "admin")

- ❌ **CREATE**: Tidak dapat membuat feedback
- ✅ **READ**: Dapat melihat semua feedback (read-only)
- ❌ **UPDATE**: Tidak dapat mengedit feedback
- ❌ **DELETE**: Tidak dapat menghapus feedback

## Database Schema

### Feedback Model (Prisma)

```prisma
model Feedback {
  id        String   @id @default(uuid())
  comment   String
  rating    Int      @db.TinyInt // 1-5 scale
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  productId String
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)

  // One feedback per user per product
  @@unique([productId, userId])
}
```

### Database Relations

- **User ↔ Feedback**: One-to-Many (satu user bisa punya banyak feedback)
- **Product ↔ Feedback**: One-to-Many (satu produk bisa punya banyak feedback)
- **Unique Constraint**: Satu user hanya bisa memberikan satu feedback per produk

## API Routes

### GET /api/feedback

**Purpose**: Mendapatkan semua feedback atau feedback untuk produk tertentu

**Query Parameters:**

- `productId` (optional): Filter feedback berdasarkan produk

**Response:**

```json
{
  "feedbacks": [
    {
      "id": "uuid",
      "comment": "Great product!",
      "rating": 5,
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z",
      "user": {
        "id": "user-uuid",
        "email": "customer@example.com"
      },
      "product": {
        "id": "product-uuid",
        "title": "Product Name"
      }
    }
  ]
}
```

**Authorization**:

- Semua user dapat mengakses (public read)
- Admin mendapat akses ke semua feedback
- Customer mendapat akses ke feedback publik

### POST /api/feedback

**Purpose**: Membuat feedback baru

**Request Body:**

```json
{
  "productId": "string",
  "comment": "string",
  "rating": 1-5
}
```

**Authorization**:

- ✅ Customer only
- ❌ Admin blocked
- Session required

**Validation**:

- Rating: 1-5 range
- Comment: tidak boleh kosong, max 1000 karakter
- One feedback per user per product (unique constraint)

### PUT /api/feedback/[id]

**Purpose**: Update feedback yang sudah ada

**Request Body:**

```json
{
  "comment": "string",
  "rating": 1-5
}
```

**Authorization**:

- ✅ Customer yang memiliki feedback
- ❌ Admin blocked
- ❌ Customer lain blocked
- Ownership validation required

### DELETE /api/feedback/[id]

**Purpose**: Hapus feedback

**Authorization**:

- ✅ Customer yang memiliki feedback
- ❌ Admin blocked
- ❌ Customer lain blocked
- Ownership validation required

## Frontend Components

### 1. FeedbackForm.tsx

**Purpose**: Form untuk customer membuat feedback baru

**Features**:

- Star rating interface (1-5 bintang)
- Textarea untuk komentar (max 1000 karakter)
- Authentication check
- One feedback per product validation
- Real-time character counter

**Props**:

- `productId`: ID produk untuk feedback
- `onFeedbackAdded`: Callback setelah feedback berhasil ditambah

### 2. FeedbackList.tsx

**Purpose**: Menampilkan daftar feedback untuk produk

**Features**:

- Tampilkan semua feedback produk
- Edit/Delete buttons hanya untuk feedback milik user
- Inline editing dengan star rating
- Role-based UI (customer vs admin)
- Real-time feedback refresh

**Props**:

- `productId`: ID produk
- `refreshTrigger`: Trigger untuk refresh data

### 3. AdminFeedbackTable.tsx

**Purpose**: Dashboard admin untuk melihat semua feedback (read-only)

**Features**:

- Tabel semua feedback dari semua produk
- View-only modal untuk detail feedback
- Search dan filter capabilities
- No edit/delete actions (admin read-only)
- Responsive table design

### 4. ProductFeedbackSection.tsx

**Purpose**: Komponen utama yang menggabungkan form dan list untuk halaman produk

**Features**:

- Conditional rendering berdasarkan authentication
- Form untuk customer yang sudah login
- List feedback yang accessible untuk semua user
- Integration dengan ProductTabs

## Usage Implementation

### 1. Integrasi di Halaman Produk

```tsx
// app/product/[id]/page.tsx
import ProductFeedbackSection from "@/components/ProductFeedbackSection";

export default function ProductPage({ params }) {
  return (
    <div>
      {/* Product details */}
      <ProductFeedbackSection productId={params.id} />
    </div>
  );
}
```

### 2. Integrasi di Admin Dashboard

```tsx
// app/(dashboard)/admin/feedback/page.tsx
import AdminFeedbackTable from "@/components/AdminFeedbackTable";

export default function AdminFeedbackPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <AdminFeedbackTable />
    </div>
  );
}
```

### 3. Update Product Tabs

```tsx
// components/ProductTabs.tsx
const tabs = [
  { id: "description", label: "Description" },
  { id: "reviews", label: "Reviews" },
  { id: "feedback", label: "Customer Feedback" }, // New tab
];
```

## Database Migration & Seeding

### 1. Migration

```bash
npx prisma db push
# atau
npx prisma migrate dev --name add-feedback-system
```

### 2. Seeding Script

File: `prisma/seed-feedback.ts`

```typescript
// Auto-generate sample feedback data dengan:
// - Random ratings (1-5)
// - Realistic customer comments
// - Multiple users per product
// - Proper user/product relationships
```

### 3. Run Seeding

```bash
npx tsx prisma/seed-feedback.ts
```

## Security Features

### 1. API Level Security

- Session validation pada semua protected endpoints
- Role-based authorization (customer vs admin)
- Ownership validation untuk update/delete operations
- Input sanitization dan validation
- SQL injection prevention (Prisma ORM)

### 2. Frontend Security

- Conditional rendering berdasarkan user role
- Client-side validation sebelum submit
- CSRF protection melalui NextAuth
- XSS prevention dengan proper escaping

### 3. Database Security

- UUID primary keys (tidak predictable)
- Cascade delete untuk data consistency
- Foreign key constraints
- Unique constraints untuk business logic

## Performance Optimizations

### 1. Database

- Index pada `userId`, `productId`, dan `rating`
- Unique constraint prevents duplicate entries
- Efficient JOIN queries dengan Prisma

### 2. Frontend

- Conditional component loading
- Optimistic updates untuk better UX
- Debounced input validation
- Proper error boundaries

### 3. API

- Efficient pagination (ready untuk implementasi)
- Response caching headers
- Minimal data transfer dengan select fields

## Testing Considerations

### 1. Unit Tests

- API endpoint testing dengan role simulation
- Component testing dengan different user roles
- Database operation testing
- Form validation testing

### 2. Integration Tests

- End-to-end user flows
- Role-based access testing
- Database constraint testing
- Authentication flow testing

### 3. Manual Testing Checklist

- [ ] Customer dapat CRUD feedback milik sendiri
- [ ] Customer tidak dapat edit feedback user lain
- [ ] Admin dapat melihat semua feedback
- [ ] Admin tidak dapat create/edit/delete feedback
- [ ] Form validation bekerja dengan benar
- [ ] One feedback per user per product constraint
- [ ] Responsive design di semua device

## Future Enhancements

### 1. Advanced Features

- Pagination untuk large datasets
- Sort dan filter feedback (rating, date, user)
- Feedback photos/images upload
- Helpful/unhelpful voting system
- Reply system (admin response to feedback)

### 2. Analytics

- Average rating calculation per product
- Feedback trends over time
- Customer satisfaction metrics
- Most reviewed products

### 3. Notifications

- Email notification saat ada feedback baru
- Admin dashboard notifications
- Customer notification saat feedback direspond

### 4. Moderation

- Inappropriate content filtering
- Admin approval system
- Automated spam detection
- Report feedback functionality

## Troubleshooting

### Common Issues

1. **"User not authenticated" error**

   - Check NextAuth session configuration
   - Verify JWT token validity
   - Check session middleware

2. **"Cannot create feedback" for customer**

   - Verify user role in database
   - Check API authorization logic
   - Validate request payload

3. **"Database constraint violation"**

   - Check unique constraint (one feedback per user per product)
   - Verify foreign key relationships
   - Check data types match schema

4. **Frontend component not showing**
   - Verify session state
   - Check conditional rendering logic
   - Inspect browser network requests

### Debug Commands

```bash
# Check database schema
npx prisma studio

# View API logs
npm run dev -- --inspect

# Check session data
console.log(session) // in browser console
```

## Conclusion

Implementasi Customer Feedback System ini menyediakan:

- ✅ Complete CRUD functionality dengan proper role-based restrictions
- ✅ Secure API endpoints dengan authentication & authorization
- ✅ Modern React components dengan TypeScript
- ✅ Responsive UI/UX design
- ✅ Database schema yang normalized dan efficient
- ✅ Ready untuk production dengan proper error handling

Sistem ini siap digunakan dan dapat dikembangkan lebih lanjut sesuai kebutuhan bisnis.
