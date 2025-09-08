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
  const handlePrint = useReactToPrint({ content: () => printRef.current, documentTitle: "QR-APAR" });

  // Ensure printing runs after DOM updates by using an effect that watches printItems
  useEffect(() => {
    if (printItems && printItems.length > 0) {
      // Defer to end of tick so ref content is rendered
      const id = setTimeout(() => handlePrint(), 0);
      return () => clearTimeout(id);
    }
  }, [printItems, handlePrint]);

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

  if (loading) return <div>Memuat...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div>
      <h2>Daftar APAR</h2>
      <input placeholder="Cari nomor/lokasi/kondisi/tanggal" value={query} onChange={(e) => setQuery(e.target.value)} style={{ padding: 8, margin: "8px 0", width: "100%", maxWidth: 420 }} />

      <div style={{ display: "flex", gap: 8, alignItems: "center", margin: "8px 0" }}>
        <button
          onClick={() => {
            const items = apars.filter((a) => selected.includes(a.nomor));
            if (items.length === 0) return;
            setPrintItems(items);
          }}
          style={{ padding: "6px 10px", background: "#111827", color: "#fff", border: 0, borderRadius: 6 }}
        >
          Cetak QR Terpilih
        </button>
        <button onClick={() => setSelected([])} style={{ padding: "6px 10px", background: "#e5e7eb", color: "#111827", border: 0, borderRadius: 6 }}>
          Reset Pilihan
        </button>
        <div style={{ fontSize: 12, color: "#6b7280" }}>{selected.length} dipilih</div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selected.length > 0 && filtered.every((a) => selected.includes(a.nomor))}
                  onChange={(e) => {
                    if (e.target.checked) setSelected(filtered.map((a) => a.nomor));
                    else setSelected([]);
                  }}
                />
              </th>
              <th>Nomor</th>
              <th>Lokasi</th>
              <th>Kondisi</th>
              <th>Tanggal</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((a, idx) => (
              <tr key={idx}>
                <td>
                  <input
                    type="checkbox"
                    checked={selected.includes(a.nomor)}
                    onChange={(e) => {
                      setSelected((prev) => (e.target.checked ? [...new Set([...prev, a.nomor])] : prev.filter((n) => n !== a.nomor)));
                    }}
                  />
                </td>
                <td>{a.nomor}</td>
                <td>{a.lokasi}</td>
                <td>{a.kondisi}</td>
                <td>{a.tanggal}</td>
                <td>
                  <button
                    onClick={() => {
                      setPrintItems([a]);
                    }}
                    style={{ padding: "4px 8px", background: "#2563eb", color: "#fff", border: 0, borderRadius: 6 }}
                  >
                    Cetak QR
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Hidden printable area */}
      <div style={{ position: "absolute", left: -9999 }} aria-hidden>
        <div ref={printRef}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 16, padding: 16 }}>
            {printItems.map((a, idx) => (
              <div key={idx} style={{ border: "1px solid #ddd", padding: 12, textAlign: "center" }}>
                <div style={{ fontWeight: "bold", marginBottom: 8 }}>{a.nomor}</div>
                <div style={{ background: "#fff", padding: 8 }}>
                  <QRCode value={String(a.nomor || "")} size={128} level="M" />
                </div>
                <div style={{ marginTop: 6, fontSize: 12 }}>{a.lokasi}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
