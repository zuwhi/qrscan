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
