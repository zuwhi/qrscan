import { useEffect, useMemo, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { fetchAparList } from "../services/sheets";

export default function ScanQR() {
  const [apars, setApars] = useState([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [cameraError, setCameraError] = useState("");
  const [isMobile, setIsMobile] = useState(typeof window !== "undefined" ? window.innerWidth < 900 : true);
  const qrRef = useRef(null);
  const scannerRef = useRef(null);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 900);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

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
    <div style={{ position: "fixed", inset: 0, background: "#000000", color: "#ffffff", zIndex: 50 }}>
      {/* Camera viewport (fills screen) */}
      <div ref={qrRef} style={{ position: "absolute", inset: 0 }}>
        <div id="qr-reader" style={{ width: "100%", height: "100%", background: "#000000" }} />
      </div>

      {/* Error banner if camera fails */}
      {cameraError && (
        <div
          style={{
            position: "absolute",
            top: 16,
            left: 16,
            right: 16,
            padding: 12,
            borderRadius: 8,
            background: "rgba(239,68,68,0.95)",
            color: "#ffffff",
          }}
        >
          {cameraError}
        </div>
      )}

      {/* Bottom overlay for result & details */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          padding: isMobile ? 12 : 16,
          background: "rgba(255,255,255,0.92)",
          color: "#0b1220",
          backdropFilter: "blur(4px)",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h2 style={{ margin: 0, fontSize: isMobile ? 18 : 20, fontWeight: 700, color: "#0b1220" }}>Scan QR</h2>
          <div style={{ marginTop: 8 }}>
            <div style={{ fontSize: 14, color: "#374151" }}>Hasil</div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{result || "-"}</div>
          </div>

          {matched ? (
            <div
              style={{
                marginTop: 12,
                background: "#ffffff",
                border: "1px solid #93c5fd",
                borderRadius: 10,
                padding: 12,
              }}
            >
              <div style={{ fontSize: 14, color: "#1d4ed8", marginBottom: 6 }}>Detail APAR</div>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "120px 1fr", rowGap: 6, columnGap: 12 }}>
                <div>Nomor</div>
                <div style={{ fontWeight: 600 }}>{matched.nomor}</div>
                <div>Lokasi</div>
                <div style={{ fontWeight: 600 }}>{matched.lokasi}</div>
                <div>Kondisi</div>
                <div style={{ fontWeight: 600 }}>{matched.kondisi}</div>
                <div>Tanggal</div>
                <div style={{ fontWeight: 600 }}>{matched.tanggal}</div>
              </div>
            </div>
          ) : result ? (
            <div style={{ marginTop: 12, color: "#0b1220", background: "#eff6ff", border: "1px solid #93c5fd", borderRadius: 10, padding: 12 }}>APAR tidak ditemukan untuk nomor tersebut.</div>
          ) : null}

          {error && <div style={{ marginTop: 12, color: "#ef4444", background: "#fee2e2", border: "1px solid #fecaca", borderRadius: 10, padding: 12 }}>{error}</div>}
        </div>
      </div>
    </div>
  );
}
