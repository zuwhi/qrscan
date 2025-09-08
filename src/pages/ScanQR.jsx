import { useEffect, useMemo, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { fetchAparList } from "../services/sheets";

export default function ScanQR() {
  const [apars, setApars] = useState([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [cameraError, setCameraError] = useState("");
  const qrRef = useRef(null);
  const scannerRef = useRef(null);

  useEffect(() => {
    fetchAparList()
      .then(setApars)
      .catch((e) => setError(e.message || "Gagal memuat data"));
  }, []);

  useEffect(() => {
    const divId = "qr-reader";
    if (!qrRef.current) return;
    const html5QrCode = new Html5Qrcode(divId);
    scannerRef.current = html5QrCode;
    const config = { fps: 10, qrbox: 250 };

    // Prefer back camera by facingMode. Fallback: choose a device with 'back'/'rear' label, else first.
    html5QrCode
      .start(
        { facingMode: "environment" },
        config,
        (decodedText) => setResult(decodedText),
        () => {}
      )
      .catch(() => {
        Html5Qrcode.getCameras()
          .then((devices) => {
            if (!devices || devices.length === 0) throw new Error("Kamera tidak ditemukan");
            const backPreferred = devices.find((d) => /back|rear|environment/i.test(d.label || "")) || devices[0];
            return html5QrCode.start(
              backPreferred.id,
              config,
              (decodedText) => setResult(decodedText),
              () => {}
            );
          })
          .catch((err) => setCameraError(err.message || String(err)));
      });

    return () => {
      try {
        html5QrCode.stop().finally(() => html5QrCode.clear());
      } catch {
        console.error("Error stopping scanner");
      }
    };
  }, []);

  const matched = useMemo(() => {
    if (!result) return null;
    const nomor = String(result).trim();
    return apars.find((a) => String(a.nomor).trim() === nomor) || null;
  }, [result, apars]);

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: 0 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "stretch" }}>
        <div style={{ padding: 16 }}>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>Scan QR</h2>
          <p style={{ margin: "8px 0 16px", color: "#555" }}>Arahkan kamera ke QR APAR. Sistem akan otomatis membaca nomor.</p>
          <div
            style={{
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: 12,
              boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
              padding: 16,
              height: "calc(100vh - 240px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {cameraError ? (
              <div style={{ color: "#b91c1c", background: "#fee2e2", padding: 12, borderRadius: 8 }}>{cameraError}</div>
            ) : (
              <div ref={qrRef} style={{ width: "100%", height: "100%" }}>
                <div id="qr-reader" style={{ width: "100%", height: "100%", borderRadius: 12, overflow: "hidden", background: "#0f172a" }} />
              </div>
            )}
          </div>
        </div>
        <div style={{ padding: 16 }}>
          <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Hasil & Detail</h3>
          <div
            style={{
              marginTop: 16,
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: 12,
            }}
          >
            <div
              style={{
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: 10,
                padding: 12,
              }}
            >
              <div style={{ fontSize: 14, color: "#64748b" }}>Hasil</div>
              <div style={{ fontSize: 18, fontWeight: 600 }}>{result || "-"}</div>
            </div>

            {matched ? (
              <div
                style={{
                  background: "#ecfeff",
                  border: "1px solid #a5f3fc",
                  borderRadius: 10,
                  padding: 12,
                }}
              >
                <div style={{ fontSize: 14, color: "#0e7490", marginBottom: 6 }}>Detail APAR</div>
                <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", rowGap: 6 }}>
                  <div style={{ color: "#334155" }}>Nomor</div>
                  <div style={{ fontWeight: 600 }}>{matched.nomor}</div>
                  <div style={{ color: "#334155" }}>Lokasi</div>
                  <div style={{ fontWeight: 600 }}>{matched.lokasi}</div>
                  <div style={{ color: "#334155" }}>Kondisi</div>
                  <div style={{ fontWeight: 600 }}>{matched.kondisi}</div>
                  <div style={{ color: "#334155" }}>Tanggal</div>
                  <div style={{ fontWeight: 600 }}>{matched.tanggal}</div>
                </div>
              </div>
            ) : result ? (
              <div style={{ color: "#b45309", background: "#fffbeb", border: "1px solid #facc15", borderRadius: 10, padding: 12 }}>APAR tidak ditemukan untuk nomor tersebut.</div>
            ) : null}
          </div>
          {error && <div style={{ color: "#b91c1c", background: "#fee2e2", border: "1px solid #fecaca", borderRadius: 10, padding: 12, marginTop: 12 }}>{error}</div>}
        </div>
      </div>
    </div>
  );
}
