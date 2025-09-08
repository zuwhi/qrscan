import { useEffect, useMemo, useRef, useState } from "react";
import QRCode from "react-qr-code";
import { useReactToPrint } from "react-to-print";
import { fetchAparList } from "../services/sheets";

function QRCards({ items }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 16 }}>
      {items.map((a, idx) => (
        <div key={idx} style={{ border: "1px solid #ddd", padding: 12, textAlign: "center" }}>
          <div style={{ fontWeight: "bold", marginBottom: 8 }}>{a.nomor}</div>
          <div style={{ background: "#fff", padding: 8 }}>
            <QRCode value={String(a.nomor || "")} size={128} level="M" />
          </div>
          <div style={{ marginTop: 6, fontSize: 12 }}>{a.lokasi}</div>
        </div>
      ))}
    </div>
  );
}

export default function CetakQR() {
  const [apars, setApars] = useState([]);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const gridRef = useRef(null);

  useEffect(() => {
    fetchAparList()
      .then(setApars)
      .catch((e) => setError(e.message || "Gagal memuat data"));
  }, []);

  const handlePrint = useReactToPrint({
    content: () => gridRef.current,
    documentTitle: "QR-APAR",
  });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return apars;
    return apars.filter((a) => [a.nomor, a.lokasi, a.kondisi, a.tanggal].some((v) => (v || "").toLowerCase().includes(q)));
  }, [apars, query]);

  return (
    <div>
      <h2>Cetak QR</h2>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", margin: "8px 0" }}>
        <input placeholder="Cari..." value={query} onChange={(e) => setQuery(e.target.value)} style={{ padding: 8, width: 240 }} />
      </div>

      <div ref={gridRef}>
        <QRCards items={filtered} />
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginTop: 12 }}>
        <button onClick={handlePrint} style={{ padding: "10px 14px", background: "#111827", color: "#fff", border: 0, borderRadius: 8 }}>
          Cetak
        </button>
      </div>

      {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
    </div>
  );
}
