import { useEffect, useMemo, useRef, useState } from "react";
import QRCode from "react-qr-code";
import { useReactToPrint } from "react-to-print";
import { fetchAparList } from "../services/sheets";

function QRCards({ items }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 16 }}>
      {items.map((a, idx) => (
        <div key={idx} style={{ border: "1px solid #e5e7eb", padding: 12, textAlign: "center", background: "#ffffff" }}>
          <div style={{ fontWeight: "bold", marginBottom: 8, color: "#0b1220" }}>{a.nomor}</div>
          <div style={{ background: "#ffffff", padding: 8 }}>
            <QRCode value={String(a.nomor || "")} size={128} level="M" />
          </div>
          <div style={{ marginTop: 6, fontSize: 12, color: "#0b1220" }}>{a.lokasi}</div>
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
    contentRef: gridRef,
    documentTitle: "QR-APAR",
  });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return apars;
    return apars.filter((a) => [a.nomor, a.lokasi, a.kondisi, a.tanggal].some((v) => (v || "").toLowerCase().includes(q)));
  }, [apars, query]);

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", color: "#0b1220" }}>
      <h2 style={{ marginTop: 0 }}>Cetak QR</h2>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", margin: "8px 0" }}>
        <input placeholder="Cari..." value={query} onChange={(e) => setQuery(e.target.value)} style={{ padding: 8, width: 240, maxWidth: "100%", border: "1px solid #bfdbfe", borderRadius: 8 }} />
      </div>

      <div ref={gridRef}>
        <QRCards items={filtered} />
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginTop: 12 }}>
        <button onClick={handlePrint} style={{ padding: "10px 14px", background: "#1d4ed8", color: "#ffffff", border: 0, borderRadius: 8 }}>
          Cetak
        </button>
      </div>

      {error && <div style={{ color: "#ef4444", marginTop: 8 }}>{error}</div>}
    </div>
  );
}
