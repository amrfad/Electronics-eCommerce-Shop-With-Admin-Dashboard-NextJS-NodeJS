Saya ingin menambahkan fitur **CRUD Customer Feedback** pada produk di proyek **Singitronic (Electronics eCommerce Shop with Admin Dashboard - NextJS + NodeJS + Prisma + MySQL)**. Tolong bantu saya dengan langkah-langkah terstruktur berikut:

---

### 1. **Database (Prisma Schema & Migration)**

* Tambahkan model `Feedback` di `schema.prisma`:

  ```prisma
  model Feedback {
    id        Int      @id @default(autoincrement())
    product   Product  @relation(fields: [productId], references: [id])
    productId Int
    user      User     @relation(fields: [userId], references: [id])
    userId    Int
    comment   String
    rating    Int
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
  }
  ```
* Jalankan:

  ```bash
  npx prisma migrate dev --name add_feedback_model
  ```
* Pastikan relasi ke `Product` dan `User` sudah benar.

---

### 2. **Backend (API Routes / Controllers)**

* Buat endpoint REST atau route di `/pages/api/feedback` atau gunakan `app/api/feedback` (jika pakai App Router).
* Operasi yang perlu ada:

  * **GET** `/api/feedback?productId=xxx` → ambil semua feedback untuk produk
  * **POST** `/api/feedback` → buat feedback baru (dari user)
  * **PUT** `/api/feedback/:id` → update feedback tertentu (opsional: hanya boleh oleh user yang membuat)
  * **DELETE** `/api/feedback/:id` → hapus feedback tertentu (opsional: admin atau owner)
* Gunakan Prisma Client:

  ```ts
  import prisma from "@/lib/prisma";

  // Contoh GET by productId
  const feedbacks = await prisma.feedback.findMany({
    where: { productId: Number(productId) },
    include: { user: true }
  });
  ```

---

### 3. **Frontend (User Side)**

* Pada halaman detail produk (`/product/[id]`):

  * Tambahkan **form feedback** (input teks + rating).
  * Tambahkan section untuk menampilkan daftar feedback.
  * Kirim data ke API `/api/feedback` dengan `fetch` atau `axios`.
* Pastikan validasi:

  * Hanya user yang login bisa memberi feedback.
  * Batasi 1 feedback per user per produk (opsional).

---

### 4. **Frontend (Admin Dashboard)**

* Tambahkan menu baru di sidebar Admin: **"Customer Feedback"**.
* Halaman ini menampilkan tabel CRUD feedback:

  * Kolom: ID, Produk, User, Rating, Comment, CreatedAt.
  * Aksi: **View**, **Edit**, **Delete**.
* Gunakan komponen table (misalnya dari Tailwind + shadcn/ui atau antd).
* API yang dipakai sama dengan backend CRUD di atas.

---

### 5. **Aspek yang Perlu Diperhatikan**

* **Auth & Role**:

  * User → hanya bisa CRUD feedback miliknya.
  * Admin → bisa CRUD semua feedback.
* **Validasi Input**: hindari SQL injection dengan Prisma (sudah aman default), tapi tetap validasi rating (misalnya 1–5).
* **UX**: tambahkan notifikasi (toast) untuk sukses/gagal.
* **Optimasi**: gunakan `getServerSideProps` / `fetchServerSide` (Next 13) untuk prefetch feedback saat render halaman produk.

---

### 6. **Testing**

* Uji coba API lewat Postman/Insomnia.
* Tambahkan feedback dummy dan cek apakah tampil di dashboard & halaman produk.
* Cek role restriction (user vs admin).

---

Tolong buatkan kode implementasi nyata untuk setiap bagian (schema, migration, API routes, frontend form, dan admin table).
