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
    Html5Qrcode.getCameras()
      .then((devices) => {
        const cameraId = devices?.[0]?.id;
        if (!cameraId) throw new Error("Kamera tidak ditemukan");
        return html5QrCode.start(
          cameraId,
          config,
          (decodedText) => {
            setResult(decodedText);
          },
          () => {}
        );
      })
      .catch((err) => setCameraError(err.message || String(err)));
    return () => {
      try {
        html5QrCode.stop().finally(() => html5QrCode.clear());
      } catch {}
    };
  }, []);

  const matched = useMemo(() => {
    if (!result) return null;
    const nomor = String(result).trim();
    return apars.find((a) => String(a.nomor).trim() === nomor) || null;
  }, [result, apars]);

  return (
    <div>
      <h2>Scan QR</h2>
      {cameraError ? (
        <div style={{ color: "red" }}>{cameraError}</div>
      ) : (
        <div ref={qrRef}>
          <div id="qr-reader" style={{ width: 320 }} />
        </div>
      )}

      <div style={{ marginTop: 16 }}>
        <div>Hasil: {result || "-"}</div>
        {matched ? (
          <div style={{ marginTop: 8 }}>
            <div>
              <strong>Nomor:</strong> {matched.nomor}
            </div>
            <div>
              <strong>Lokasi:</strong> {matched.lokasi}
            </div>
            <div>
              <strong>Kondisi:</strong> {matched.kondisi}
            </div>
            <div>
              <strong>Tanggal:</strong> {matched.tanggal}
            </div>
          </div>
        ) : result ? (
          <div style={{ color: "orange" }}>APAR tidak ditemukan untuk nomor tersebut.</div>
        ) : null}
      </div>
      {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
    </div>
  );
}
