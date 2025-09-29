# Feedback CRUD Testing Documentation

## API Endpoints

### 1. Get Feedback for Product

```bash
# Get all feedback for a specific product
curl -X GET "http://localhost:3000/api/feedback?productId=YOUR_PRODUCT_ID"
```

### 2. Create Feedback (Requires Authentication)

```bash
# Create new feedback
curl -X POST "http://localhost:3000/api/feedback" \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN" \
  -d '{
    "productId": "YOUR_PRODUCT_ID",
    "comment": "Great product!",
    "rating": 5
  }'
```

### 3. Update Feedback (Requires Authentication)

```bash
# Update existing feedback
curl -X PUT "http://localhost:3000/api/feedback/FEEDBACK_ID" \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN" \
  -d '{
    "comment": "Updated comment",
    "rating": 4
  }'
```

### 4. Delete Feedback (Requires Authentication)

```bash
# Delete feedback
curl -X DELETE "http://localhost:3000/api/feedback/FEEDBACK_ID" \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN"
```

### 5. Get All Feedback (Admin Only)

```bash
# Get all feedback (admin only)
curl -X GET "http://localhost:3000/api/feedback" \
  -H "Cookie: next-auth.session-token=ADMIN_SESSION_TOKEN"
```

## Testing Steps

### 1. Setup Database

```bash
# Run migrations
npx prisma migrate dev --name add_feedback_model

# Generate Prisma client
npx prisma generate
```

### 2. Start Development Server

```bash
npm run dev
```

### 3. Test Authentication

1. Go to `http://localhost:3000/register`
2. Create a test user
3. Login at `http://localhost:3000/login`

### 4. Test User Feedback

1. Go to any product detail page
2. Submit feedback using the form
3. Verify it appears in the feedback list

### 5. Test Admin Dashboard

1. Update user role to "admin" in database using Prisma Studio:
   ```bash
   npx prisma studio
   ```
2. Login as admin
3. Go to `http://localhost:3000/admin/feedback`
4. Test CRUD operations on feedback

## Database Schema

The Feedback model:

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

  @@unique([productId, userId]) // One feedback per user per product
}
```

## Features Implemented

### User Side:

- ✅ View feedback for products
- ✅ Submit new feedback with rating (1-5)
- ✅ Authentication required for feedback submission
- ✅ One feedback per user per product constraint
- ✅ Real-time feedback updates

### Admin Dashboard:

- ✅ View all feedback with product and user info
- ✅ Edit any feedback
- ✅ Delete any feedback
- ✅ Sortable table with actions
- ✅ Modal for view/edit/delete operations

### API Features:

- ✅ RESTful API endpoints
- ✅ Proper authentication and authorization
- ✅ Input validation and sanitization
- ✅ Error handling and appropriate status codes
- ✅ Prisma integration with relations
