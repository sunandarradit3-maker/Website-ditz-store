# DiTz Store Module Hub

Website full-stack untuk katalog module DiTz Store, halaman gate sebelum download, dan admin panel terpisah.

## Fitur

- Landing page branding DiTz Store
- Daftar module aktif
- URL per module: `/download/[slug]`
- Action gate TikTok + saluran + konfirmasi + delay
- Redirect link download/MediaFire hanya setelah gate selesai
- Admin login berbasis cookie HTTP-only bertanda tangan HMAC
- CRUD module: tambah, edit, hapus, aktif/nonaktif
- Penyimpanan persisten memakai Upstash Redis REST
- Responsive Android dan desktop

## Catatan verifikasi follow

Website biasa tidak dapat memastikan seseorang benar-benar follow TikTok atau bergabung ke saluran tanpa akses API resmi dan izin akun/platform. Versi ini memastikan pengguna membuka kedua link, menunggu beberapa detik, lalu mencentang konfirmasi. Jangan menulis klaim “terverifikasi otomatis” pada halaman publik kecuali integrasi API resmi sudah tersedia.

## Instalasi lokal

```bash
npm install
cp .env.example .env.local
npm run dev
```

Buka:

- Website: `http://localhost:3000`
- Login admin: `http://localhost:3000/admin/login`
- Contoh link: `http://localhost:3000/download/module-gaming-ditz-store`

## Environment variables

Isi seluruh variabel dari `.env.example`.

Untuk development, jika Upstash belum diisi, aplikasi memakai memory fallback. Perubahan akan hilang ketika server restart. Untuk Vercel wajib pasang Upstash Redis agar data admin persisten.

## Deploy Vercel

1. Push folder ini ke GitHub.
2. Import repository ke Vercel.
3. Buat database Redis di Upstash.
4. Tambahkan semua Environment Variables di Vercel.
5. Deploy ulang.

## Ganti logo

Timpa file `public/logo.svg` dengan logo DiTz Store. Nama file dapat tetap `logo.svg` agar tidak perlu mengubah kode.

## Keamanan produksi

- Ganti `ADMIN_PASSWORD` dengan password panjang dan unik.
- Isi `SESSION_SECRET` minimal 32 karakter acak.
- Jangan menyimpan password di repository.
- Gunakan link HTTPS.
- Untuk trafik besar, tambahkan rate limiting pada endpoint login.
