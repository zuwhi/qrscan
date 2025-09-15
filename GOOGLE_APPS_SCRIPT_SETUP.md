# Setup Google Apps Script untuk Update Data APAR

## Langkah 1: Buat Google Apps Script

1. Buka [Google Apps Script](https://script.google.com)
2. Klik "New Project"
3. Ganti nama project menjadi "APAR Update Handler"

## Langkah 2: Buat Script

Ganti kode default dengan script berikut:

```javascript
function doPost(e) {
  try {
    // Parse request body
    const data = JSON.parse(e.postData.contents);
    const { nomor, lokasi, kondisi, tanggal } = data;

    // ID Spreadsheet Anda (ganti dengan ID yang benar)
    const SPREADSHEET_ID = "YOUR_SPREADSHEET_ID_HERE";

    // Buka spreadsheet
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getActiveSheet();

    // Cari baris berdasarkan nomor APAR
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();

    let rowToUpdate = -1;
    for (let i = 1; i < values.length; i++) {
      // Skip header
      if (String(values[i][0]).trim() === String(nomor).trim()) {
        rowToUpdate = i + 1; // +1 karena sheet dimulai dari 1
        break;
      }
    }

    if (rowToUpdate === -1) {
      return ContentService.createTextOutput(JSON.stringify({ success: false, error: "APAR tidak ditemukan" })).setMimeType(ContentService.MimeType.JSON);
    }

    // Update data
    sheet.getRange(rowToUpdate, 1, 1, 4).setValues([[nomor, lokasi, kondisi, tanggal]]);

    return ContentService.createTextOutput(JSON.stringify({ success: true, message: "Data berhasil diupdate" })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({ message: "APAR Update API is running" })).setMimeType(ContentService.MimeType.JSON);
}
```

## Langkah 3: Deploy Script

1. Klik "Deploy" > "New deployment"
2. Pilih type "Web app"
3. Set:
   - Execute as: "Me"
   - Who has access: "Anyone"
4. Klik "Deploy"
5. **SALIN URL yang dihasilkan** - ini akan menjadi `VITE_APPS_SCRIPT_URL`

## Langkah 4: Update Environment Variables

Tambahkan ke file `.env`:

```
VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

## Langkah 5: Ganti Spreadsheet ID

Di script Apps Script, ganti `YOUR_SPREADSHEET_ID_HERE` dengan ID spreadsheet Anda yang sebenarnya.

## Catatan Penting

- Pastikan spreadsheet sudah memiliki header: Nomor, Lokasi, Kondisi, Tanggal
- Script ini akan mencari APAR berdasarkan kolom pertama (Nomor)
- Update akan dilakukan pada baris yang ditemukan
