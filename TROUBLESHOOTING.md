# Troubleshooting "Failed to Fetch" Error

## Kemungkinan Penyebab dan Solusi

### 1. **URL Apps Script Tidak Valid**

**Gejala:** Error "Invalid Apps Script URL format"

**Solusi:**

- Pastikan URL Apps Script berformat: `https://script.google.com/macros/s/SCRIPT_ID/exec`
- URL harus diakhiri dengan `/exec` (bukan `/dev`)
- Pastikan Apps Script sudah di-deploy sebagai Web App

### 2. **Apps Script Belum Di-deploy**

**Gejala:** Error 404 atau "Failed to fetch"

**Solusi:**

1. Buka Google Apps Script
2. Klik "Deploy" > "Manage deployments"
3. Pastikan ada deployment dengan status "Active"
4. Jika belum ada, buat deployment baru:
   - Type: "Web app"
   - Execute as: "Me"
   - Who has access: "Anyone"

### 3. **Spreadsheet ID Salah**

**Gejala:** Error dari Apps Script "Spreadsheet not found"

**Solusi:**

1. Buka Google Sheets
2. Copy ID dari URL: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`
3. Ganti `YOUR_SPREADSHEET_ID_HERE` di Apps Script

### 4. **Permission Spreadsheet**

**Gejala:** Error "Permission denied"

**Solusi:**

1. Buka Google Sheets
2. Klik "Share" (tombol berbagi)
3. Pastikan akun Google yang menjalankan Apps Script memiliki akses "Editor"
4. Atau set "Anyone with the link" sebagai "Editor"

### 5. **CORS Issues**

**Gejala:** Error "Failed to fetch" di browser

**Solusi:**

- Apps Script sudah menangani CORS secara otomatis
- Pastikan menggunakan URL yang benar (dengan `/exec`)

## Testing Apps Script

### Test 1: Cek URL Apps Script

Buka URL Apps Script di browser. Harus menampilkan:

```json
{ "message": "APAR Update API is running" }
```

### Test 2: Test dengan cURL

```bash
curl -X POST "YOUR_APPS_SCRIPT_URL" \
  -H "Content-Type: application/json" \
  -d '{"nomor":"TEST123","lokasi":"Test Lokasi","kondisi":"Baik","tanggal":"2024-01-01"}'
```

### Test 3: Cek Console Log

1. Buka Developer Tools (F12)
2. Lihat tab Console
3. Coba update data APAR
4. Lihat log yang muncul

## Debug Steps

1. **Cek Environment Variable:**

   ```javascript
   console.log("Apps Script URL:", import.meta.env.VITE_APPS_SCRIPT_URL);
   ```

2. **Cek Network Tab:**

   - Buka Developer Tools > Network
   - Coba update data
   - Lihat request yang dikirim

3. **Cek Apps Script Logs:**
   - Buka Google Apps Script
   - Klik "Executions" di menu kiri
   - Lihat log execution terbaru

## Common Fixes

### Fix 1: Re-deploy Apps Script

1. Buka Apps Script
2. Klik "Deploy" > "Manage deployments"
3. Klik "Edit" pada deployment
4. Klik "Deploy" lagi

### Fix 2: Update Spreadsheet ID

1. Copy ID spreadsheet yang benar
2. Update di Apps Script
3. Save dan re-deploy

### Fix 3: Check Spreadsheet Format

Pastikan spreadsheet memiliki header di baris pertama:

- Kolom A: Nomor
- Kolom B: Lokasi
- Kolom C: Kondisi
- Kolom D: Tanggal
