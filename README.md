# APAR Manager (React + Vite)

Aplikasi manajemen data APAR berbasis React (Vite) dengan integrasi Google Sheets (read-only), fitur scan QR, generate & cetak QR.

## Fitur

- Menampilkan daftar APAR dari Google Sheets API.
- Pencarian berdasarkan teks dan hasil scan QR (nomor APAR).
- Generate QR code dari kolom nomor APAR.
- Cetak seluruh QR menggunakan react-to-print.
- Scan QR menggunakan html5-qrcode.

## Setup

1. Install dependency:

```bash
npm install
```

2. Buat file `.env` berdasarkan `.env.example`:

```bash
cp .env.example .env
```

Isi variabel berikut:

- `VITE_GOOGLE_API_KEY`: API Key Google (aktifkan Google Sheets API).
- `VITE_SHEETS_ID`: Spreadsheet ID Google Sheets.
- `VITE_SHEETS_RANGE`: Range data, default `Sheet1!A:D`.

3. Jalankan aplikasi dev:

```bash
npm run dev
```

## Struktur Halaman

- `Daftar APAR` (`/`): tabel data dari Sheets.
- `Scan QR` (`/scan`): aktifkan kamera, baca QR, tampilkan detail APAR.
- `Cetak QR` (`/cetak`): daftar semua QR dan tombol cetak.

## Deploy ke Vercel

1. Push repo ke GitHub.
2. Buat project di Vercel, import repo.
3. Pada Project Settings → Environment Variables, tambahkan:
   - `VITE_GOOGLE_API_KEY`
   - `VITE_SHEETS_ID`
   - `VITE_SHEETS_RANGE` (opsional)
4. Build Command: (default) `vite build`. Output Directory: `dist`.
5. Deploy.

Catatan: Aplikasi hanya read-only ke Sheets. Pastikan Spreadsheet di-share "Anyone with the link" as Viewer atau gunakan API Key dengan akses publik untuk range tersebut.
