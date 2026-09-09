# 🚀 StudyTrack — Multi-Cloud PaaS Web Platform

StudyTrack adalah aplikasi manajemen tugas dan catatan belajar mahasiswa yang dibangun dengan arsitektur **Platform as a Service (PaaS)** modern. Dirancang untuk memenuhi kriteria proyek/tugas kuliah berbasis PaaS yang elegan, fungsional, dan mudah dipresentasikan.

![PaaS Architecture](https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop)

---

## 🏛️ Arsitektur Platform as a Service (PaaS)

Proyek ini memanfaatkan 3 layanan PaaS terkemuka di industri ditambah integrasi Version Control & Git-Ops:

| Komponen | Layanan PaaS | Peran & Tanggung Jawab |
|---|---|---|
| **App & Compute** | **Vercel** | Hosting Next.js 15, SSR, dan Serverless API Functions di Edge Global Network. |
| **Database** | **Supabase** | Cloud PostgreSQL Database, REST API otomatis, dan Row Level Security (RLS). |
| **Media Storage** | **Cloudinary** | Object Storage CDN untuk berkas/lampiran tugas, foto materi, dan kompresi media otomatis. |
| **Version Control & CI/CD** | **GitHub** | Git repository, automated GitHub Actions workflow, dan Vercel Git-Ops auto-deploy on push. |

---

## ✨ Fitur Unggulan

- **Live PaaS Architecture & Health Monitor**: Widget di navbar dan dashboard yang memverifikasi status koneksi aktif ke Vercel, Supabase, Cloudinary, dan GitHub secara real-time.
- **Task & Assignment Tracker**: Manajemen tugas kuliah lengkap dengan mata kuliah, deadline, dan badge prioritas (*Urgent*, *High*, *Medium*, *Low*).
- **Direct Cloudinary File Upload**: Upload lampiran dokumen atau gambar materi kuliah langsung ke Cloudinary CDN dengan live preview modal.
- **Dual Mode (Instant Demo + Live Cloud)**: Aplikasi langsung berfungsi normal saat dijalankan secara lokal (dengan mock storage) dan otomatis tersambung ke PostgreSQL & Cloudinary saat file `.env.local` diisi.
- **Modern Glassmorphism UI**: Antarmuka responsif bernuansa dark luxury, micro-animations, dan Google Font Plus Jakarta Sans tanpa dependensi CSS berat.

---

## ⚡ Quickstart (Menjalankan di Komputer Lokal)

1. Masuk ke direktori proyek:
   ```bash
   cd /Users/ibhrams/.gemini/antigravity-ide/scratch/studytrack
   ```

2. Install dependensi (jika belum):
   ```bash
   npm install
   ```

3. Jalankan server pengembangan lokal:
   ```bash
   npm run dev
   ```

4. Buka browser di [http://localhost:3000](http://localhost:3000).

---

## 🔑 Langkah Setup Kredensial PaaS (Supabase & Cloudinary)

Salin template variabel lingkungan:
```bash
cp .env.example .env.local
```

### 1. Setup Supabase (Database PaaS)
1. Buat akun dan project baru di [supabase.com](https://supabase.com).
2. Buka menu **SQL Editor** di sidebar Supabase.
3. Buka file `supabase_schema.sql` di proyek ini, copy seluruh isinya, paste ke SQL Editor Supabase, lalu klik **Run**.
4. Masuk ke **Project Settings > API**:
   - Salin **Project URL** ke `NEXT_PUBLIC_SUPABASE_URL`.
   - Salin **anon public API Key** ke `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

### 2. Setup Cloudinary (Storage PaaS)
1. Buat akun di [cloudinary.com](https://cloudinary.com).
2. Catat **Cloud Name** Anda di dashboard Cloudinary dan masukkan ke `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`.
3. Buka menu **Settings (ikon gear) > Upload > Upload presets**:
   - Klik **Add upload preset**.
   - Beri nama preset (misalnya: `studytrack_preset`).
   - Ubah **Signing Mode** menjadi **Unsigned**.
   - Klik **Save**.
4. Masukkan nama preset ke `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`.

---

## 🐙 Integrasi GitHub & Deploy Otomatis ke Vercel (Git-Ops)

Proyek ini sudah dilengkapi dengan `.gitignore` dan workflow `.github/workflows/ci.yml`.

### Langkah 1: Push ke GitHub Repository Anda
```bash
# Inisialisasi git (jika belum)
git init
git add .
git commit -m "feat: initial release of StudyTrack multi-cloud PaaS platform"
git branch -M main

# Hubungkan ke repo GitHub baru Anda
git remote add origin https://github.com/USERNAME/studytrack-paas.git
git push -u origin main
```

### Langkah 2: Deploy ke Vercel (1-Click)
1. Login ke [vercel.com](https://vercel.com) menggunakan akun GitHub Anda.
2. Klik **Add New Project**, pilih repository `studytrack-paas`.
3. Di bagian **Environment Variables**, tambahkan variabel berikut:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
   - `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`
4. Klik **Deploy**!
5. Setiap kali Anda melakukan `git push` ke GitHub, Vercel akan otomatis melakukan build dan update website live Anda!

---

## 📂 Struktur Proyek

```
studytrack/
├── .github/
│   └── workflows/
│       └── ci.yml                 # Automated CI/CD pipeline
├── app/
│   ├── api/
│   │   └── paas-check/
│   │       └── route.ts           # Serverless PaaS connectivity health check
│   ├── layout.tsx                 # Root HTML layout & font
│   └── page.tsx                   # Main Dashboard UI & reactivity
├── components/
│   ├── Navbar.tsx                 # Header & brand status
│   ├── PaaSStatusBanner.tsx       # Live status cards (Vercel, Supabase, Cloudinary)
│   ├── PaaSArchitectureModal.tsx  # Architecture documentation dialog
│   ├── TaskCard.tsx               # Task card with Cloudinary media viewer
│   ├── TaskModal.tsx              # Add task form with Cloudinary upload
│   └── ImagePreviewModal.tsx      # HD media CDN preview
├── lib/
│   ├── cloudinary.ts              # Cloudinary Storage PaaS integration
│   ├── supabase.ts                # Supabase Database PaaS client
│   ├── mockData.ts                # Fallback data for offline/demo testing
│   └── types.ts                   # TypeScript interfaces
├── styles/
│   └── globals.css                # Modern Vanilla CSS design system
├── supabase_schema.sql            # PostgreSQL table schema & RLS policies
├── next.config.mjs                # Next.js configuration (Cloudinary domains)
├── tsconfig.json                  # TypeScript configuration
├── package.json                   # Dependencies
└── .env.example                   # Environment variable template
```

---

## 🎓 Disusun untuk Tugas Mata Kuliah PaaS / Cloud Computing
Aplikasi ini membuktikan pemahaman praktis implementasi multi-tier cloud services:
1. **Frontend & Serverless Backend**: Vercel
2. **Database as a Service (DBaaS)**: Supabase PostgreSQL
3. **Storage as a Service (STaaS)**: Cloudinary Object Store
4. **Git-Ops & DevOps CI/CD**: GitHub + Vercel Webhooks
