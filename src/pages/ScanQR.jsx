import { useEffect, useMemo, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { fetchAparList } from "../services/sheets";

export default function ScanQR() {
  const [apars, setApars] = useState([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [cameraError, setCameraError] = useState("");
  const [isMobile, setIsMobile] = useState(typeof window !== "undefined" ? window.innerWidth < 900 : true);
  const [showResult, setShowResult] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [updateData, setUpdateData] = useState({
    lokasi: "",
    kondisi: "",
    tanggal: "",
  });
  const [isUpdating, setIsUpdating] = useState(false);
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
        (decodedText) => {
          setResult(decodedText);
          setShowResult(true);
        },
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
              (decodedText) => {
                setResult(decodedText);
                setShowResult(true);
              },
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

  const handleUpdateClick = () => {
    if (matched) {
      setUpdateData({
        lokasi: matched.lokasi || "",
        kondisi: matched.kondisi || "",
        tanggal: matched.tanggal || "",
      });
      setShowUpdateForm(true);
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!matched) return;

    setIsUpdating(true);
    try {
      // Simulasi update data - Anda bisa mengganti ini dengan API call yang sebenarnya
      const updatedApars = apars.map((apar) => (apar.nomor === matched.nomor ? { ...apar, ...updateData } : apar));
      setApars(updatedApars);
      setShowUpdateForm(false);
      setError("");
    } catch {
      setError("Gagal mengupdate data APAR");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleInputChange = (field, value) => {
    setUpdateData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

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

          {showResult &&
            (matched ? (
              <div
                style={{
                  marginTop: 12,
                  background: "#ffffff",
                  border: "1px solid #93c5fd",
                  borderRadius: 10,
                  padding: 12,
                  position: "relative",
                }}
              >
                <button
                  onClick={() => setShowResult(false)}
                  style={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    background: "#ef4444",
                    color: "#ffffff",
                    border: 0,
                    borderRadius: 4,
                    padding: "4px 8px",
                    fontSize: 12,
                    cursor: "pointer",
                  }}
                >
                  ✕
                </button>
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
                <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                  <button
                    onClick={handleUpdateClick}
                    style={{
                      background: "#3b82f6",
                      color: "#ffffff",
                      border: 0,
                      borderRadius: 6,
                      padding: "8px 16px",
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: "pointer",
                      flex: 1,
                    }}
                  >
                    Update Data
                  </button>
                </div>
              </div>
            ) : result ? (
              <div style={{ marginTop: 12, color: "#0b1220", background: "#eff6ff", border: "1px solid #93c5fd", borderRadius: 10, padding: 12, position: "relative" }}>
                <button
                  onClick={() => setShowResult(false)}
                  style={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    background: "#ef4444",
                    color: "#ffffff",
                    border: 0,
                    borderRadius: 4,
                    padding: "4px 8px",
                    fontSize: 12,
                    cursor: "pointer",
                  }}
                >
                  ✕
                </button>
                APAR tidak ditemukan untuk nomor tersebut.
              </div>
            ) : null)}

          {error && <div style={{ marginTop: 12, color: "#ef4444", background: "#fee2e2", border: "1px solid #fecaca", borderRadius: 10, padding: 12 }}>{error}</div>}
        </div>
      </div>

      {/* Update Form Modal */}
      {showUpdateForm && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            padding: 16,
          }}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: 12,
              padding: 24,
              width: "100%",
              maxWidth: 500,
              maxHeight: "90vh",
              overflow: "auto",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#0b1220" }}>Update Data APAR</h3>
              <button
                onClick={() => setShowUpdateForm(false)}
                style={{
                  background: "#ef4444",
                  color: "#ffffff",
                  border: 0,
                  borderRadius: 4,
                  padding: "6px 12px",
                  fontSize: 14,
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateSubmit}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", marginBottom: 6, fontSize: 14, fontWeight: 600, color: "#374151" }}>Nomor APAR</label>
                <input
                  type="text"
                  value={matched?.nomor || ""}
                  disabled
                  style={{
                    width: "100%",
                    padding: 10,
                    border: "1px solid #d1d5db",
                    borderRadius: 6,
                    fontSize: 14,
                    background: "#f9fafb",
                    color: "#6b7280",
                  }}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", marginBottom: 6, fontSize: 14, fontWeight: 600, color: "#374151" }}>Lokasi</label>
                <input
                  type="text"
                  value={updateData.lokasi}
                  onChange={(e) => handleInputChange("lokasi", e.target.value)}
                  style={{
                    width: "100%",
                    padding: 10,
                    border: "1px solid #d1d5db",
                    borderRadius: 6,
                    fontSize: 14,
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", marginBottom: 6, fontSize: 14, fontWeight: 600, color: "#374151" }}>Kondisi</label>
                <select
                  value={updateData.kondisi}
                  onChange={(e) => handleInputChange("kondisi", e.target.value)}
                  style={{
                    width: "100%",
                    padding: 10,
                    border: "1px solid #d1d5db",
                    borderRadius: 6,
                    fontSize: 14,
                  }}
                  required
                >
                  <option value="">Pilih kondisi</option>
                  <option value="Baik">Baik</option>
                  <option value="Rusak">Rusak</option>
                  <option value="Perlu Perbaikan">Perlu Perbaikan</option>
                  <option value="Habis">Habis</option>
                </select>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", marginBottom: 6, fontSize: 14, fontWeight: 600, color: "#374151" }}>Tanggal</label>
                <input
                  type="date"
                  value={updateData.tanggal}
                  onChange={(e) => handleInputChange("tanggal", e.target.value)}
                  style={{
                    width: "100%",
                    padding: 10,
                    border: "1px solid #d1d5db",
                    borderRadius: 6,
                    fontSize: 14,
                  }}
                  required
                />
              </div>

              <div style={{ display: "flex", gap: 12 }}>
                <button
                  type="button"
                  onClick={() => setShowUpdateForm(false)}
                  style={{
                    flex: 1,
                    padding: 12,
                    border: "1px solid #d1d5db",
                    borderRadius: 6,
                    fontSize: 14,
                    fontWeight: 600,
                    background: "#ffffff",
                    color: "#374151",
                    cursor: "pointer",
                  }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  style={{
                    flex: 1,
                    padding: 12,
                    border: 0,
                    borderRadius: 6,
                    fontSize: 14,
                    fontWeight: 600,
                    background: isUpdating ? "#9ca3af" : "#3b82f6",
                    color: "#ffffff",
                    cursor: isUpdating ? "not-allowed" : "pointer",
                  }}
                >
                  {isUpdating ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
