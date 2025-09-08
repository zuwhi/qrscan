import { useEffect, useRef, useState } from "react";
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

  return (
    <div>
      <h2>Cetak QR</h2>
      <button onClick={handlePrint} style={{ margin: "8px 0", padding: "8px 12px" }}>
        Cetak
      </button>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <div ref={printRef}>
        <QRCards items={apars} />
      </div>
    </div>
  );
}
