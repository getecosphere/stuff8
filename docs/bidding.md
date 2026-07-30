# Aturan & Spesifikasi Fitur Bidding (Penawaran Harga) — Stuff8

Dokumen ini mencatat aturan bisnis, alur kerja UI/UX, serta spesifikasi teknis untuk simulasi fitur penawaran harga (**bidding**) pada aplikasi Stuff8.

---

## 1. Aturan Dasar Penawaran (Bidding Rules)

1. **Kondisi Awal (Initial State)**
   - Setiap barang/produk di marketplace dimulai dengan daftar penawar yang **kosong (0 penawar)**.
   - Badge penawar hanya akan muncul pada kartu produk setelah pengguna mengirimkan penawaran simulasi.

2. **Satu User Satu Penawaran (Single Offer Per User Per Item)**
   - Setiap pengguna simulasi hanya diperbolehkan membuat **maksimal 1 penawaran per barang**.
   - Saat modal penawaran dibuka, sistem secara otomatis memilih nama penawar simulasi unik yang **belum pernah menawar** barang tersebut.
   - Apabila terdapat upaya pengiriman ulang penawaran dari user yang sama untuk barang yang sama, sistem akan memblokir duplikasi tersebut.

3. **Nilai Default Penawaran (Highest Bid Default)**
   - Saat modal penawaran dibuka:
     - Jika sudah ada penawaran sebelumnya untuk barang tersebut, nilai awal input otomatis terisi sesuai **Harga Penawaran Tertinggi Saat Ini** (`currentHighestBid`).
     - Jika belum ada penawaran, nilai awal terisi sesuai **Harga Buka** (`currentBidBasePrice`).
   - Header modal menampilkan informasi harga buka serta penawaran tertinggi saat ini (contoh: `Harga Buka: Rp 21.750.000 • Tertinggi: Rp 23.925.000`).

4. **Peringkat Top 5 Penawaran (Top 5 Leaderboard)**
   - Kartu produk marketplace menampilkan maksimal **Top 5 Penawaran Tertinggi**.
   - Penawaran diurutkan dari nominal terbesar ke terkecil:
     - Peringkat `#1`: Penawaran bernominal tertinggi.
     - Peringkat `#2` s/d `#5`: Penawaran berikutnya secara berurutan.

---

## 2. Fitur Input & Navigasi Harga (UI/UX Controls)

1. **Format Mata Uang Rupiah (Decimal Thousands Separator)**
   - Input harga penawaran menggunakan format teks numerik (`type="text" inputmode="numeric"`).
   - Angka di dalam kolom input otomatis diformat dengan pemisah ribuan titik (contoh: `30.750.000`).
   - Di sebelah kanan label input, terdapat dua indikator badge real-time:
     - **Badge Nominal Total**: Menampilkan nilai formatted lengkap (contoh: `Rp 30.750.000`).
     - **Badge Selisih/Delta**: Menampilkan perubahan nominal dan persentase relative terhadap harga buka (contoh: `+Rp 9.000.000 (+41.4%)` warna hijau, `-Rp 1.000.000 (-4.6%)` warna merah, atau `Harga Pas (0%)` warna abu-abu).

2. **Inkremental Stepping 5% & Stepper nominal**
   - **Stepper `- 100rb` / `+ 100rb`**: Menambah/mengurangi nominal sebesar Rp 100.000.
   - **Tombol `-5%` / `+5%`**: Menambah/mengurangi nominal secara inkremental sebesar 5% dari harga buka per klik tanpa batas kaku (continuous stepping).
   - **Tombol "Harga Pas"**: Mereset nilai input kembali ke **Harga Buka** awal (`currentBidBasePrice`).
   - **Tombol "Harga Tertinggi"**: Mereset nilai input ke **Harga Penawaran Tertinggi** saat ini (`currentHighestBid`).

3. **Tata Letak Header Anti-Jumping (Layout Stability)**
   - Bagian header penawaran disusun dalam struktur 2 baris vertikal (`flex flex-col items-end`) dengan properti `whitespace-nowrap`.
   - Mengubah nominal atau status badge tidak akan menyebabkan teks label *"Jumlah Penawaran Kamu"* melompat atau berpindah baris.

---

## 3. Implementasi Kode Terkait

- **File Utama**: [`stuff8/stuff8_composition/frontend/src/pages/index.astro`](file:///Users/eko/dev/SuperApp/stuff8/stuff8_composition/frontend/src/pages/index.astro)
- **Fungsi Utama**:
  - `openBidModal(id, title, price)`: Menyiapkan nama simulasi unik, menghitung `currentHighestBid`, dan mengisi default nilai penawaran.
  - `updateBidFormattedDisplay()`: Memperbarui badge harga formatted & badge delta selisih real-time.
  - `getBidAmountValue()` & `setBidAmountValue(val)`: Helper ekstraksi angka murni & formatting rupiah bertitik.
  - `renderVisitorMarketplaceGrid()`: Mengurutkan penawaran tertinggi dan menampilkan Top 5 pada overlay kartu produk.
