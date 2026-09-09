# ✨ Inspira — Curated Visual & Design Showcase

Inspira adalah platform digital kontemporer tempat para kreator berbagi dan menemukan karya visual inspiratif mulai dari arsitektur modern, fotografi sinematik, eksplorasi 3D, hingga desain antarmuka digital (UI/UX).

---

## 🌟 Fitur Utama

- **Curated Visual Gallery**: Grid visual responsif dengan animasi hover zoom, badge kategori, dan detail kreator.
- **Direct High-Res Artwork Upload**: Unggah karya langsung dari perangkat dengan optimasi kompresi otomatis dan pengiriman via CDN global.
- **Interactive Like & Appreciation**: Berikan apresiasi pada karya favorit Anda dengan sistem penghitung like instan.
- **Fullscreen Lightbox Experience**: Pratinjau karya beresolusi penuh dilengkapi cerita di balik karya, kategori, nama studio/kreator, serta tautan ukuran asli.
- **Category & Dynamic Search**: Filter karya berdasarkan kategori (*Architecture*, *Photography*, *UI/UX Design*, *3D Art*, *Branding*) atau cari berdasarkan judul, kreator, dan konsep desain.
- **Modern Luxury Aesthetic**: Mengusung desain dark luxury glassmorphism dengan tipografi Plus Jakarta Sans, responsif di mobile dan desktop.

---

## ⚡ Cara Menjalankan Secara Lokal

1. Masuk ke direktori:
   ```bash
   cd /Users/ibhrams/.gemini/antigravity-ide/scratch/studytrack
   ```

2. Jalankan server lokal:
   ```bash
   npm run dev
   ```

3. Buka di browser:
   👉 **http://localhost:3001**

---

## 🛠️ Setup Database (Opsional untuk Persistensi Post)

Jika Anda ingin karya yang diupload langsung tersimpan ke PostgreSQL database, jalankan SQL query berikut di **SQL Editor Supabase**:

```sql
create table if not exists public.posts (
    id uuid default gen_random_uuid() primary key,
    title text not null,
    category text not null,
    author text default 'Guest Creator',
    author_avatar text,
    description text,
    image_url text not null,
    likes integer default 0,
    created_at timestamptz default now() not null
);

alter table public.posts enable row level security;

create policy "Allow public access to posts" 
on public.posts for all 
to anon, authenticated 
using (true) 
with check (true);
```

---

## 🚀 Deploy ke Vercel

1. Push commit terbaru:
   ```bash
   git push origin main
   ```
2. Hubungkan repository `studytrack-paas` ke Vercel Dashboard.
3. Masukkan Environment Variables dari `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
   - `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`
4. Klik **Deploy**!
