# ☕ WiFi Cafe Finder

Rating cafe berdasarkan kualitas WiFi, vibe, dan kecocokan untuk kerja atau ngerjain tugas.

## Tech Stack

- **Frontend**: React + Vite
- **Database**: Firebase Firestore
- **State management**: Zustand
- **Form**: React Hook Form
- **Deploy**: Vercel

## Setup

### 1. Clone & install

```bash
npm install
```

### 2. Buat project di Firebase

1. Buka [console.firebase.google.com](https://console.firebase.google.com)
2. Klik **Add project** → isi nama → Next → Next → Create project
3. Di sidebar kiri, klik **Firestore Database** → **Create database**
   - Pilih **Start in test mode** → pilih region → Enable
4. Di sidebar kiri, klik ⚙️ **Project settings**
   - Scroll ke bawah ke bagian **Your apps** → klik ikon `</>`  (Web)
   - Isi nama app → Register app
   - Copy nilai `firebaseConfig` yang muncul

### 3. Buat file .env

```bash
cp .env.example .env
```

Isi file `.env` dengan nilai dari `firebaseConfig` tadi:

```
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=nama-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=nama-project
VITE_FIREBASE_STORAGE_BUCKET=nama-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
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

Tambahin env variables di dashboard Vercel (sama seperti isi .env di atas).

## Struktur file

```
src/
├── lib/
│   └── firebase.js       # Firebase client
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
- [x] Filter cafe (WiFi kenceng, sepi, ada colokan)
- [x] Halaman detail cafe + semua review
- [x] Form submit review (bintang, speed, fasilitas)
- [x] Tambah cafe baru
- [ ] Google Maps integration (butuh API key)
- [ ] Upload foto cafe
- [ ] Login / auth
