# Stuff8 Asset Style Guide

Panduan ini menjadi acuan untuk aset raster baru di Stuff8, terutama ilustrasi empty state, status, dan pendukung antarmuka. Referensi implementasi saat ini: [`no-item-image.webp`](../frontend/public/images/no-item-image.webp).

## Tujuan

- Membuat antarmuka tetap terasa hangat dan mudah dipahami tanpa terlihat kekanak-kanakan.
- Menjelaskan keadaan kosong atau belum tersedia melalui ilustrasi, bukan hanya teks atau bidang abu-abu.
- Menjaga aset ringan untuk penggunaan mobile.

## Karakter visual

- **Nada:** casual, rapi, dan profesional.
- **Gaya:** ilustrasi objek sederhana dengan bentuk geometris yang lembut; bukan foto stok dan bukan ikon garis tipis semata.
- **Garis:** outline navy gelap yang konsisten dan cukup tegas pada ukuran kecil.
- **Detail:** sedikit aksen positif seperti sparkles atau tag diperbolehkan bila membantu makna; hindari dekorasi berlebihan.
- **Komposisi:** satu subjek utama di tengah, ruang kosong yang cukup di sekelilingnya, dan tetap terbaca saat diperkecil.
- **Teks dalam gambar:** jangan gunakan teks. Keterangan harus diberikan oleh HTML agar dapat diakses, diterjemahkan, dan responsif.

## Palet

Gunakan palet Stuff8 sebagai arah, bukan keharusan nilai piksel yang mutlak.

| Peran | Arah warna |
| --- | --- |
| Outline dan struktur | Navy gelap |
| Objek utama | Slate atau biru lembut |
| Aksen netral | Cream hangat / putih tulang |
| Aksen kecil | Biru Stuff8 secukupnya |
| Latar | Transparan bila aset dipakai di atas kartu UI |

Hindari warna neon, saturasi tinggi yang tidak perlu, dan gradient dramatis. Aset harus menyatu dengan permukaan putih atau `slate-100` pada UI.

## Spesifikasi teknis

- Format final: **WebP**, bukan PNG atau JPEG.
- Transparansi: gunakan alpha untuk aset yang ditempatkan di atas berbagai warna kartu.
- Ukuran master untuk ilustrasi kecil: **512 × 512 px**. Ukuran ini cukup tajam pada layar retina tanpa membebani mobile.
- Target ukuran berkas: usahakan di bawah **50 KB**; aset empty-state saat ini sekitar 17 KB.
- Nama berkas: huruf kecil, kebab-case, deskriptif. Contoh: `no-item-image.webp`, `empty-marketplace.webp`.
- Lokasi: `frontend/public/images/`.

## Aturan penggunaan di UI

- Tampilkan aset hanya ketika data gambar memang kosong atau belum tersedia.
- Jangan mengganti foto produk yang ada dengan ilustrasi ini.
- Gunakan `object-contain` dan padding yang proporsional agar subjek tidak terpotong.
- Sertakan `alt` yang menjelaskan keadaan, misalnya `Gambar barang belum tersedia`.
- Pasangkan dengan teks HTML singkat bila konteks membutuhkan penjelasan; ilustrasi tidak boleh menjadi satu-satunya informasi penting.

## Brief untuk pembuatan aset baru

Gunakan struktur berikut saat meminta aset baru:

```text
Use case: [empty state / status / supporting illustration]
Asset type: WebP illustration for the Stuff8 mobile web app
Subject: [satu objek utama yang menjelaskan keadaan]
Style: casual-but-professional SaaS illustration; simple geometric shapes;
soft navy outlines; muted slate blue and warm cream accents
Composition: centered square illustration with generous padding; readable at small size
Background: transparent after processing
Text: none
Avoid: stock-photo look, people, logos, watermarks, neon colors, heavy gradients,
cast shadows, and text embedded in the image
```

Untuk aset transparan dari generator yang belum mendukung alpha secara langsung, buat sumber dengan latar chroma-key rata, hapus latarnya, lalu konversi hasil akhir menjadi WebP sebelum dimasukkan ke proyek.
