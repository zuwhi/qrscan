import { useEffect, useMemo, useRef, useState } from "react";
import { fetchAparList } from "../services/sheets";
import QRCode from "react-qr-code";
import { useReactToPrint } from "react-to-print";

export default function DaftarApar() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [apars, setApars] = useState([]);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState([]); // array of nomor
  const [printItems, setPrintItems] = useState([]);
  const printRef = useRef(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "QR-APAR",
  });

  useEffect(() => {
    let mounted = true;
    fetchAparList()
      .then((list) => {
        if (mounted) {
          setApars(list);
          setLoading(false);
        }
      })
      .catch((e) => {
        if (mounted) {
          setError(e.message || "Gagal memuat data");
          setLoading(false);
        }
      });
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return apars;
    return apars.filter((a) => [a.nomor, a.lokasi, a.kondisi, a.tanggal].some((v) => (v || "").toLowerCase().includes(q)));
  }, [apars, query]);

  const handlePrintSelected = () => {
    const items = apars.filter((a) => selected.includes(a.nomor));
    if (items.length === 0) return;
    setPrintItems(items);
    setTimeout(() => handlePrint(), 100);
  };

  const handlePrintSingle = (item) => {
    setPrintItems([item]);
    setTimeout(() => handlePrint(), 100);
  };

  if (loading) return <div>Memuat...</div>;
  if (error) return <div style={{ color: "#ef4444" }}>{error}</div>;

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      <h2 style={{ marginTop: 0, color: "#0b1220" }}>Daftar APAR</h2>
      <input placeholder="Cari nomor/lokasi/kondisi/tanggal" value={query} onChange={(e) => setQuery(e.target.value)} style={{ padding: 8, margin: "8px 0", width: "100%", maxWidth: 420, border: "1px solid #bfdbfe", borderRadius: 8 }} />

      <div style={{ display: "flex", gap: 8, alignItems: "center", margin: "8px 0", flexWrap: "wrap" }}>
        <button onClick={handlePrintSelected} style={{ padding: "6px 10px", background: "#1d4ed8", color: "#ffffff", border: 0, borderRadius: 8 }}>
          Cetak QR Terpilih
        </button>
        <button onClick={() => setSelected([])} style={{ padding: "6px 10px", background: "#e5e7eb", color: "#0b1220", border: 0, borderRadius: 8 }}>
          Reset Pilihan
        </button>
        <div style={{ fontSize: 12, color: "#6b7280" }}>{selected.length} dipilih</div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", padding: 8, borderBottom: "2px solid #93c5fd", color: "#0b1220" }}>
                <input
                  type="checkbox"
                  checked={selected.length > 0 && filtered.every((a) => selected.includes(a.nomor))}
                  onChange={(e) => {
                    if (e.target.checked) setSelected(filtered.map((a) => a.nomor));
                    else setSelected([]);
                  }}
                />
              </th>
              <th style={{ textAlign: "left", padding: 8, borderBottom: "2px solid #93c5fd", color: "#0b1220" }}>Nomor</th>
              <th style={{ textAlign: "left", padding: 8, borderBottom: "2px solid #93c5fd", color: "#0b1220" }}>Lokasi</th>
              <th style={{ textAlign: "left", padding: 8, borderBottom: "2px solid #93c5fd", color: "#0b1220" }}>Kondisi</th>
              <th style={{ textAlign: "left", padding: 8, borderBottom: "2px solid #93c5fd", color: "#0b1220" }}>Tanggal</th>
              <th style={{ textAlign: "left", padding: 8, borderBottom: "2px solid #93c5fd", color: "#0b1220" }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((a, idx) => (
              <tr key={idx}>
                <td style={{ padding: 8, borderBottom: "1px solid #e5e7eb" }}>
                  <input
                    type="checkbox"
                    checked={selected.includes(a.nomor)}
                    onChange={(e) => {
                      setSelected((prev) => (e.target.checked ? [...new Set([...prev, a.nomor])] : prev.filter((n) => n !== a.nomor)));
                    }}
                  />
                </td>
                <td style={{ padding: 8, borderBottom: "1px solid #e5e7eb", color: "#0b1220" }}>{a.nomor}</td>
                <td style={{ padding: 8, borderBottom: "1px solid #e5e7eb", color: "#0b1220" }}>{a.lokasi}</td>
                <td style={{ padding: 8, borderBottom: "1px solid #e5e7eb", color: "#0b1220" }}>{a.kondisi}</td>
                <td style={{ padding: 8, borderBottom: "1px solid #e5e7eb", color: "#0b1220" }}>{a.tanggal}</td>
                <td style={{ padding: 8, borderBottom: "1px solid #e5e7eb" }}>
                  <button onClick={() => handlePrintSingle(a)} style={{ padding: "4px 8px", background: "#2563eb", color: "#ffffff", border: 0, borderRadius: 8 }}>
                    Cetak QR
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Hidden printable area */}
      <div style={{ position: "absolute", left: -9999, top: -9999 }} aria-hidden>
        <div ref={printRef}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 16, padding: 16 }}>
            {printItems.map((a, idx) => (
              <div key={idx} style={{ border: "1px solid #e5e7eb", padding: 12, textAlign: "center" }}>
                <div style={{ fontWeight: "bold", marginBottom: 8, color: "#0b1220" }}>{a.nomor}</div>
                <div style={{ background: "#ffffff", padding: 8 }}>
                  <QRCode value={String(a.nomor || "")} size={128} level="M" />
                </div>
                <div style={{ marginTop: 6, fontSize: 12, color: "#0b1220" }}>{a.lokasi}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
