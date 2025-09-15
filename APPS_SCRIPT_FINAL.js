// Google Apps Script untuk Update Data APAR
// Copy script ini ke Google Apps Script

function doPost(e) {
  try {
    console.log("=== POST Request Received ===");
    console.log("Request data:", e.postData);

    // Parse request body
    let data;
    try {
      data = JSON.parse(e.postData.contents);
      console.log("Parsed data:", data);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      return createErrorResponse("Invalid JSON data: " + parseError.toString());
    }

    const { nomor, lokasi, kondisi, tanggal } = data;

    // Validasi input
    if (!nomor) {
      return createErrorResponse("Nomor APAR tidak boleh kosong");
    }

    // ID Spreadsheet Anda - GANTI DENGAN ID YANG BENAR
    const SPREADSHEET_ID = "YOUR_SPREADSHEET_ID_HERE";

    if (SPREADSHEET_ID === "YOUR_SPREADSHEET_ID_HERE") {
      return createErrorResponse("Spreadsheet ID belum di-set. Ganti YOUR_SPREADSHEET_ID_HERE dengan ID spreadsheet yang benar.");
    }

    console.log("Opening spreadsheet:", SPREADSHEET_ID);

    // Buka spreadsheet
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getActiveSheet();

    console.log("Sheet name:", sheet.getName());

    // Cari baris berdasarkan nomor APAR
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();

    console.log("Total rows:", values.length);
    console.log("Looking for nomor:", nomor);

    let rowToUpdate = -1;
    for (let i = 1; i < values.length; i++) {
      const currentNomor = String(values[i][0]).trim();
      console.log(`Row ${i + 1}: "${currentNomor}" === "${nomor}"`);

      if (currentNomor === String(nomor).trim()) {
        rowToUpdate = i + 1; // +1 karena sheet dimulai dari 1
        console.log("Found match at row:", rowToUpdate);
        break;
      }
    }

    if (rowToUpdate === -1) {
      console.log("APAR not found");
      return createErrorResponse("APAR dengan nomor '" + nomor + "' tidak ditemukan");
    }

    // Update data
    console.log("Updating row:", rowToUpdate);
    console.log("New data:", [nomor, lokasi, kondisi, tanggal]);

    sheet.getRange(rowToUpdate, 1, 1, 4).setValues([[nomor, lokasi, kondisi, tanggal]]);

    console.log("Update successful");
    return createSuccessResponse("Data APAR berhasil diupdate");
  } catch (error) {
    console.error("Error in doPost:", error);
    return createErrorResponse("Server error: " + error.toString());
  }
}

function doGet(e) {
  console.log("=== GET Request Received ===");
  return createSuccessResponse("APAR Update API is running");
}

// Helper function untuk success response
function createSuccessResponse(message) {
  const response = ContentService.createTextOutput(
    JSON.stringify({
      success: true,
      message: message,
    })
  );
  response.setMimeType(ContentService.MimeType.JSON);
  return response;
}

// Helper function untuk error response
function createErrorResponse(error) {
  const response = ContentService.createTextOutput(
    JSON.stringify({
      success: false,
      error: error,
    })
  );
  response.setMimeType(ContentService.MimeType.JSON);
  return response;
}

// Test function untuk debugging
function testUpdate() {
  const testData = {
    nomor: "TEST123",
    lokasi: "Test Lokasi",
    kondisi: "Baik",
    tanggal: "2024-01-01",
  };

  const mockRequest = {
    postData: {
      contents: JSON.stringify(testData),
    },
  };

  const result = doPost(mockRequest);
  console.log("Test result:", result.getContent());
  return result;
}
