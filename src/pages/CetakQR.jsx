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
  const [selected, setSelected] = useState([]); // nomor[]
  const [printItems, setPrintItems] = useState([]);
  const printRef = useRef(null);

  useEffect(() => {
    fetchAparList()
      .then(setApars)
      .catch((e) => setError(e.message || "Gagal memuat data"));
  }, []);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
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
        <button
          onClick={() => {
            const items = apars.filter((a) => selected.includes(a.nomor));
            if (items.length === 0) return;
            setPrintItems(items);
            setTimeout(() => handlePrint(), 0);
          }}
          style={{ padding: "8px 12px", background: "#111827", color: "#fff", border: 0, borderRadius: 6 }}
        >
          Cetak Terpilih
        </button>
        <button onClick={() => setPrintItems(filtered)} style={{ padding: "8px 12px", background: "#2563eb", color: "#fff", border: 0, borderRadius: 6 }}>
          Cetak Semua Terlihat
        </button>
        <button onClick={() => setSelected([])} style={{ padding: "8px 12px", background: "#e5e7eb", color: "#111827", border: 0, borderRadius: 6 }}>
          Reset Pilihan
        </button>
        <div style={{ fontSize: 12, color: "#6b7280" }}>{selected.length} dipilih</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
        {filtered.map((a, idx) => (
          <label key={idx} style={{ display: "flex", gap: 8, alignItems: "center", border: "1px solid #e5e7eb", padding: 8, borderRadius: 8 }}>
            <input
              type="checkbox"
              checked={selected.includes(a.nomor)}
              onChange={(e) => {
                setSelected((prev) => (e.target.checked ? [...new Set([...prev, a.nomor])] : prev.filter((n) => n !== a.nomor)));
              }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600 }}>{a.nomor}</div>
              <div style={{ fontSize: 12, color: "#6b7280" }}>{a.lokasi}</div>
            </div>
            <button
              onClick={() => {
                setPrintItems([a]);
                setTimeout(() => handlePrint(), 0);
              }}
              style={{ padding: "6px 10px", background: "#2563eb", color: "#fff", border: 0, borderRadius: 6 }}
            >
              Cetak 1
            </button>
          </label>
        ))}
      </div>

      {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}

      {/* Hidden printable area */}
      <div style={{ position: "absolute", left: -9999 }}>
        <div ref={printRef}>
          <QRCards items={printItems} />
        </div>
      </div>
    </div>
  );
}
