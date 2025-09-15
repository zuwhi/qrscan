# APAR Manager (React + Vite)

Aplikasi manajemen data APAR berbasis React (Vite) dengan integrasi Google Sheets, fitur scan QR, generate & cetak QR, dan update data APAR.

## Fitur

- Menampilkan daftar APAR dari Google Sheets API.
- Pencarian berdasarkan teks dan hasil scan QR (nomor APAR).
- Generate QR code dari kolom nomor APAR.
- Cetak seluruh QR menggunakan react-to-print.
- Scan QR menggunakan html5-qrcode.
- **Update data APAR** (lokasi, kondisi, tanggal) melalui Google Apps Script.

## Setup

1. Install dependency:

```bash
npm install
```

2. Buat file `.env` dan isi variabel berikut:

```bash
# Google Sheets Configuration (untuk read data)
VITE_GOOGLE_API_KEY=your_google_api_key_here
VITE_SHEETS_ID=your_google_sheets_id_here
VITE_SHEETS_RANGE=Sheet1!A:D

# Google Apps Script URL (untuk update data)
VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

**Setup Google Apps Script untuk Update Data:**

1. Buka [Google Apps Script](https://script.google.com)
2. Buat project baru dengan nama "APAR Update Handler"
3. Ganti kode default dengan script dari file `GOOGLE_APPS_SCRIPT_SETUP.md`
4. Ganti `YOUR_SPREADSHEET_ID_HERE` dengan ID spreadsheet Anda
5. Deploy sebagai Web App dengan akses "Anyone"
6. Salin URL deployment ke `VITE_APPS_SCRIPT_URL`

7. Jalankan aplikasi dev:

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
   - `VITE_APPS_SCRIPT_URL` (untuk update data)
4. Build Command: (default) `vite build`. Output Directory: `dist`.
5. Deploy.

Catatan:

- Untuk read data: Spreadsheet di-share "Anyone with the link" as Viewer atau gunakan API Key dengan akses publik
- Untuk update data: Gunakan Google Apps Script yang sudah di-deploy sebagai Web App
