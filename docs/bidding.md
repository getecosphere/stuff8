# Aturan & Spesifikasi Fitur Bidding & Transaksi — Stuff8

Dokumen ini mencatat aturan bisnis, alur kerja UI/UX, serta spesifikasi teknis untuk simulasi fitur penawaran harga (**bidding**), negosiasi chat real-time, transaksi COD, dan provenance tracking pada aplikasi Stuff8.

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
   - **Saat item SOLD**: Badge penawar dihilangkan dari thumbnail marketplace untuk menjaga tampilan clean.

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

## 3. Alur Negosiasi & Chat Real-Time

### 3.1 Status Bid Lifecycle

1. **Pending** → Penawaran baru dikirim, belum direspons penjual
2. **Accepted** → Penjual menyetujui penawaran, chat real-time diaktifkan
3. **Sold** → Transaksi selesai, item dijual ke bidder ini
4. **Outbid** → Penawaran kalah karena item dijual ke bidder lain

### 3.2 Chat Real-Time untuk Accepted Bids

**Dua Mode Chat:**

1. **Modal Chat (Desktop/Window Mode)**
   - Diakses via tombol "Pendekatan & Chat Realtime →" pada kartu bidder
   - Tampilan fullscreen modal dengan chat interface lengkap
   - Quick reply chips: "Halo! Kapan kita bisa ketemuan COD?", "Lokasi penyerahan barang di mana ya?", dll.

2. **Inline Master-Detail Chat (Visitor Section)**
   - Layout 2 kolom: Daftar bidder (kiri) + Chat inline (kanan)
   - Tab filter per produk untuk multi-item bidding
   - Quick chips: "Lokasi COD?", "Jam ketemuan?", "Tunai / QRIS"
   - Responsive mobile: Tabs compact dengan text size lebih kecil (`text-[11px]`)

**Fitur Chat:**
- Template quick replies untuk percepatan komunikasi
- Auto-reply simulasi dari bidder setelah penjual mengirim pesan
- Polling real-time setiap 1.5 detik untuk message updates
- Support untuk inline visitor chat dan modal chat dengan shared message state

**Chat Template Buttons:**
- Fungsi global (`sendInlineVisitorMessage`, `selectVisitorBidder`, `switchVisitorProductTab`) didefinisikan **sebelum** render untuk memastikan onclick handlers work
- Support untuk modal chat dan inline chat dengan proper event handling

---

## 4. Transaksi SOLD & Update Status

### 4.1 Proses Mark SOLD

**Flow:**
1. User klik tombol "🏷️ Tandai SOLD" di header chat
2. Modal konfirmasi muncul dengan detail:
   - Nama pembeli
   - Nama produk
   - Harga transaksi final
3. Setelah konfirmasi:
   - Bid status untuk winning bidder → `'Sold'`
   - Bid status untuk bidder lainnya → `'Outbid'`
   - Item `is_sold` flag → `true`
   - Provenance record dibuat

### 4.2 UI Changes Setelah SOLD

**Winning Buyer (Bid status = 'Sold'):**
- Badge: **"👤 Pemilik Baru"** (amber/kuning)
- Status: **"SOLD (Terjual)"** (merah)
- Button: **"✓ Sudah Terjual"** (disabled, abu-abu)

**Other Buyers (Bid status = 'Outbid'):**
- Badge: **"Bidder"** (hijau emerald)
- Status: **"SOLD (Terjual)"** (merah)
- Button: **"✓ Sudah Terjual"** (disabled, abu-abu)

**Logic Separation:**
- `isBidSold = bid.status === 'Sold'` → Untuk badge "Pemilik Baru" (hanya winning buyer)
- `isItemSold = item?.is_sold || bids.some(...)` → Untuk button & status (semua buyer)
- Fresh bid data diambil dari `bids` array untuk memastikan status terbaru

### 4.3 Marketplace Display

**Setelah SOLD:**
- Badge Top 5 bidders **dihilangkan** dari thumbnail
- Badge **"🏷️ SOLD / TERJUAL"** ditampilkan
- Gambar produk: grayscale + opacity 75%
- Info buyer di card detail: "Terjual ke: **[Nama Buyer]**"
- Button: "📜 Riwayat Kepemilikan" untuk akses provenance

---

## 5. Provenance Tracking (Riwayat Kepemilikan)

### 5.1 Structure

**Modal Title:** "Riwayat Kepemilikan"

**Timeline Entries:**
1. **Entry Pertama (Initial Ownership)**
   - Icon: 📍 (pin)
   - Pemilik: Nama penjual
   - Harga: Harga asking price awal
   - Notes: "Terdaftar pertama kali di Katalog Inventory & Marketplace"
   - Date: 2 hari sebelum SOLD

2. **Entry Kedua+ (SOLD Transactions)**
   - Icon: 🏷️ (tag) + ✓ checkmark
   - Pemilik: Nama pembeli baru
   - Harga: Harga transaksi final
   - Notes: "Terjual via Penawaran Bidding & Transaksi COD"
   - Date: Waktu transaksi
   - Background: emerald/hijau

### 5.2 Data Structure

```javascript
ownershipHistoryStore[itemId] = [
  {
    id: 'prov_init_...',
    item_id: itemId,
    from_owner_id: 'original_creator',
    from_owner_name: sellerName,
    to_owner_id: 'seller_id',
    to_owner_name: sellerName,
    price: initialPrice,
    transferred_at: ISO timestamp,
    notes: 'Terdaftar pertama kali...'
  },
  {
    id: 'prov_sold_...',
    item_id: itemId,
    from_owner_id: 'seller_id',
    from_owner_name: sellerName,
    to_owner_id: buyerId,
    to_owner_name: buyerName,
    price: finalPrice,
    transferred_at: ISO timestamp,
    notes: 'Terjual via Penawaran Bidding...'
  }
]
```

### 5.3 Display Logic

- Timeline vertical dengan border-left
- Dot indicator dengan nomor urut (atau ✓ untuk sold)
- Latest entry: emerald border + background
- Responsive timeline dengan proper spacing
- Clean minimal design tanpa redundant labels

---

## 6. Implementasi Kode Terkait

### File Utama
- **Frontend**: `stuff8_core/frontend/src/pages/index.astro`
- **Layout**: `stuff8_core/frontend/src/layouts/Layout.astro`

### Fungsi Kunci

**Bidding:**
- `openBidModal(id, title, price)`: Setup modal penawaran
- `updateBidFormattedDisplay()`: Update badge harga real-time
- `getBidAmountValue()` & `setBidAmountValue(val)`: Format rupiah
- `renderVisitorMarketplaceGrid()`: Render marketplace dengan Top 5 bids

**Chat:**
- `fetchChatMessages(bidId)`: Load chat messages (support modal & inline)
- `sendChatMessage(text)`: Kirim pesan + auto-reply simulasi
- `sendInlineVisitorMessage(text)`: Handler untuk inline chat chips
- `selectVisitorBidder(bidId)`: Switch active chat bidder
- `switchVisitorProductTab(itemId)`: Filter chat per produk

**Transaction:**
- `openConfirmSoldModalFromChat(bidId)`: Buka modal konfirmasi SOLD
- `executeMarkSold()`: Proses transaksi SOLD + update status
  - Update bid status: Sold / Outbid
  - Update item sold flags
  - Create provenance record
  - Add item to buyer inventory

**Provenance:**
- `openOwnershipHistoryModal(itemId)`: Tampilkan riwayat kepemilikan
- `getOwnershipHistory(itemId)`: Get/generate provenance records
- `normalize_style_json(...)`: Inject template IDs (untuk poll templates)

**Rendering:**
- `render()`: Main render function, calls all sub-renderers
- `renderApprovedBidsWidget()`: Render chat widget untuk accepted bids
- `renderVisitorDealsMasterDetail(filteredDeals)`: Inline chat master-detail
- `openChatModal(bidId)`: Modal chat untuk desktop mode

---

## 7. State Management

### Global Variables
```javascript
let items: any[] = [];                    // Inventory items
let marketplaceListings: any[] = [];      // Marketplace listings
let bids: any[] = [];                     // All bids (source of truth)
let activeChatBidId: string | null;       // Active chat in modal
let activeVisitorChatBidId: string | null; // Active chat in inline
let activeVisitorProductTab: string;      // Product filter tab
let chatPollInterval: any;                // Chat polling interval
let currentConfirmSoldBidId: string | null; // Bid being marked sold

const localChatMessages: Record<string, Array<Message>> = {};
const ownershipHistoryStore: Record<string, Array<ProvenanceRecord>> = {};
```

### Data Flow
1. User action → Function call
2. Update state arrays (`bids`, `items`, etc.)
3. Call `render()` → Triggers all sub-renders
4. UI updates reflect latest state
5. **Fresh data fetch**: Ambil dari `bids` array untuk status terbaru (tidak dari stale references)

---

## 8. Responsive Design Notes

- **Desktop**: Full modal chat, 2-column layout untuk chat
- **Mobile**: 
  - Compact product tabs (`text-[11px]`, `px-2.5`)
  - Stack layout untuk chat interface
  - Shorter title truncation (16 chars vs 20 chars)
  - `whitespace-nowrap` untuk prevent wrapping
- **Timeline**: Adjust padding (`pl-8` vs `pl-6`) untuk proper dot positioning
- **Buttons**: Responsive padding (`px-2.5 sm:px-3.5`)

---

## 9. CTA Section

Setelah simulasi selesai, CTA section ditampilkan:
- **Theme**: White/clean design
- **Headline**: "Siap Kelola Barang & Jualan Lebih Smart?"
- **Copy**: Casual, friendly tone
- **Buttons**: 
  - Primary: "Mulai Pakai Stuff8 Sekarang" (navy)
  - Secondary: "Coba Simulasi Lagi" (scroll to top)
- **Features**: ✓ 100% Gratis, ✓ Chat Realtime, ✓ Provenance Tracking

---

## 10. Footer

```
© 2026 Stuff8 — Catat Barang Pribadi & Pasar Jual Beli
```

Clean footer tanpa technical references, fokus pada value proposition.
