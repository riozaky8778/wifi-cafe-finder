# ☕ WiFi Cafe Finder

Rating cafe berdasarkan kualitas WiFi, vibe, dan kecocokan untuk kerja atau ngerjain tugas.

## Tech Stack

- **Frontend**: React + Vite
- **Backend / Database**: Supabase (PostgreSQL)
- **State management**: Zustand
- **Form**: React Hook Form
- **Deploy**: Vercel

## Setup

### 1. Clone & install

```bash
npm install
```

### 2. Buat project di Supabase

1. Daftar di [supabase.com](https://supabase.com) → New Project
2. Buka **SQL Editor** → paste isi file `schema.sql` → Run
3. Copy **Project URL** dan **anon public key** dari Settings → API

### 3. Buat file .env

```bash
cp .env.example .env
```

Isi dengan kredensial Supabase kamu:

```
VITE_SUPABASE_URL=https://xxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

### 4. Jalankan lokal

```bash
npm run dev
```

Buka [http://localhost:5173](http://localhost:5173)

### 5. Deploy ke Vercel

```bash
npm install -g vercel
vercel
```

Tambahin env variables di dashboard Vercel:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Struktur file

```
src/
├── lib/
│   └── supabase.js       # Supabase client
├── store/
│   └── cafeStore.js      # Global state (Zustand)
├── components/
│   ├── StarRating.jsx    # Komponen bintang
│   └── CafeCard.jsx      # Card cafe di list
├── pages/
│   ├── Home.jsx          # Halaman utama + list cafe
│   ├── CafeDetail.jsx    # Detail cafe + reviews
│   ├── ReviewForm.jsx    # Form submit review
│   └── AddCafe.jsx       # Form tambah cafe baru
├── App.jsx               # Routing
└── main.jsx              # Entry point
```

## Fitur

- [x] List cafe dengan rating WiFi, vibe, noise
- [x] Filter cafe (WiFi kenceng, sepi, colokan)
- [x] Halaman detail cafe + semua review
- [x] Form submit review (bintang, speed, fasilitas)
- [x] Tambah cafe baru
- [x] Auth via Supabase (siap pakai)
- [ ] Google Maps integration (butuh API key)
- [ ] Upload foto cafe
- [ ] WiFi speed test langsung dari app
