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
  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
  const spreadsheetId = import.meta.env.VITE_SHEETS_ID;
  const range = import.meta.env.VITE_SHEETS_RANGE || "Sheet1!A:D";

  if (!apiKey || !spreadsheetId) {
    throw new Error("Missing Google Sheets config. Please set VITE_GOOGLE_API_KEY and VITE_SHEETS_ID");
  }

  // First, get all data to find the row number
  const allData = await fetchAparList();
  const aparIndex = allData.findIndex((apar) => String(apar.nomor).trim() === String(nomor).trim());

  if (aparIndex === -1) {
    throw new Error("APAR tidak ditemukan");
  }

  // Row number in the sheet (1-based, +2 because we skip header and arrays are 0-based)
  const rowNumber = aparIndex + 2;

  // Prepare the update data
  const values = [[updateData.nomor || nomor, updateData.lokasi || "", updateData.kondisi || "", updateData.tanggal || ""]];

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}/values/Sheet1!A${rowNumber}:D${rowNumber}?valueInputOption=RAW&key=${encodeURIComponent(apiKey)}`;

  const res = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      values: values,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to update Google Sheets: ${res.status} ${text}`);
  }

  return await res.json();
}
