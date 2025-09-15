# 🚀 Quick Fix Guide - "Failed to Fetch" Error

## Masalah

- ✅ GET request berhasil
- ❌ POST request gagal dengan "Failed to fetch"
- Apps Script belum di-update dengan kode terbaru

## Solusi Cepat

### Step 1: Update Apps Script

1. Buka [Google Apps Script](https://script.google.com)
2. Buka project "APAR Update Handler"
3. **HAPUS SEMUA KODE LAMA**
4. **COPY PASTE** kode dari file `APPS_SCRIPT_FINAL.js`
5. **GANTI** `YOUR_SPREADSHEET_ID_HERE` dengan ID spreadsheet yang benar
6. **SAVE** (Ctrl+S)

### Step 2: Re-deploy Apps Script

1. Klik "Deploy" > "Manage deployments"
2. Klik "Edit" (pencil icon) pada deployment yang ada
3. Klik "Deploy" lagi
4. **JANGAN** buat deployment baru!

### Step 3: Test

1. Buka halaman Scan QR
2. Klik "Test Apps Script"
3. Harus menampilkan:
   - ✅ GET Test: `{"success":true,"message":"APAR Update API is running"}`
   - ✅ POST Test: `{"success":true,"message":"Data APAR berhasil diupdate"}`

## Cara Mendapatkan Spreadsheet ID

1. Buka Google Sheets
2. Copy ID dari URL:
   ```
   https://docs.google.com/spreadsheets/d/SPREADSHEET_ID_HERE/edit
   ```
3. Ganti `YOUR_SPREADSHEET_ID_HERE` di Apps Script

## Troubleshooting

### Jika masih error:

1. **Cek Console Logs** di Apps Script:

   - Buka Apps Script
   - Klik "Executions" di menu kiri
   - Lihat log execution terbaru

2. **Cek Permission Spreadsheet**:

   - Buka Google Sheets
   - Klik "Share"
   - Pastikan akun Google yang menjalankan Apps Script memiliki akses "Editor"

3. **Test dengan cURL**:
   ```bash
   curl -X POST "YOUR_APPS_SCRIPT_URL" \
     -H "Content-Type: application/json" \
     -d '{"nomor":"TEST123","lokasi":"Test","kondisi":"Baik","tanggal":"2024-01-01"}'
   ```

## Expected Results

**Sebelum fix:**

- GET: `{"message":"APAR Update API is running"}`
- POST: ❌ Failed to fetch

**Setelah fix:**

- GET: `{"success":true,"message":"APAR Update API is running"}`
- POST: `{"success":true,"message":"Data APAR berhasil diupdate"}`

## ⚠️ PENTING

- Pastikan Apps Script sudah di-deploy sebagai Web App
- Pastikan Spreadsheet ID benar
- Pastikan permission spreadsheet sudah benar
- Re-deploy Apps Script setelah update kode
