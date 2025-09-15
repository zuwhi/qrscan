export async function fetchAparList() {
  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
  const spreadsheetId = import.meta.env.VITE_SHEETS_ID;
  const range = import.meta.env.VITE_SHEETS_RANGE || "Sheet1!A:D";

  if (!apiKey || !spreadsheetId) {
    throw new Error("Missing Google Sheets config. Please set VITE_GOOGLE_API_KEY and VITE_SHEETS_ID");
  }

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}/values/${encodeURIComponent(range)}?key=${encodeURIComponent(apiKey)}`;

  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch from Google Sheets: ${res.status} ${text}`);
  }
  const data = await res.json();
  const rows = data.values || [];
  if (rows.length === 0) return [];

  // Assume first row is header: nomor, lokasi, kondisi, tanggal
  const header = rows[0].map((h) => h.toLowerCase());
  const idxNomor = header.indexOf("nomor");
  const idxLokasi = header.indexOf("lokasi");
  const idxKondisi = header.indexOf("kondisi");
  const idxTanggal = header.indexOf("tanggal");

  return rows.slice(1).map((r) => ({
    nomor: r[idxNomor] || "",
    lokasi: r[idxLokasi] || "",
    kondisi: r[idxKondisi] || "",
    tanggal: r[idxTanggal] || "",
  }));
}

export async function updateAparData(nomor, updateData) {
  const appsScriptUrl = import.meta.env.VITE_APPS_SCRIPT_URL;

  if (!appsScriptUrl) {
    throw new Error("Missing Google Apps Script URL. Please set VITE_APPS_SCRIPT_URL in your environment variables.");
  }

  // Validate Apps Script URL format
  if (!appsScriptUrl.includes("script.google.com")) {
    throw new Error("Invalid Apps Script URL format. URL should contain 'script.google.com'");
  }

  // Prepare the data to send to Apps Script
  const requestData = {
    nomor: nomor,
    lokasi: updateData.lokasi || "",
    kondisi: updateData.kondisi || "",
    tanggal: updateData.tanggal || "",
  };

  console.log("Sending update request to:", appsScriptUrl);
  console.log("Request data:", requestData);

  try {
    const res = await fetch(appsScriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
      mode: "cors", // Explicitly set CORS mode
    });

    console.log("Response status:", res.status);
    console.log("Response headers:", res.headers);

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Error response:", errorText);
      throw new Error(`HTTP Error: ${res.status} - ${errorText}`);
    }

    const result = await res.json();
    console.log("Response data:", result);

    if (!result.success) {
      throw new Error(result.error || "Gagal mengupdate data");
    }

    return result;
  } catch (error) {
    console.error("Update error:", error);

    if (error.name === "TypeError" && error.message.includes("fetch")) {
      throw new Error("Gagal menghubungi server. Periksa URL Apps Script dan koneksi internet.");
    }

    if (error.message.includes("HTTP Error")) {
      throw new Error(`Gagal mengupdate data: ${error.message}`);
    }

    throw error;
  }
}
