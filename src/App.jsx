import { Link, Outlet } from "react-router-dom";

export default function App() {
  return (
    <div
      style={{
        maxWidth: 800,
        margin: "0 auto",
        padding: 20,
        fontFamily: "Arial, sans-serif",
        background: "#f9fafb",
        minHeight: "100vh",
      }}
    >
      <header
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          marginBottom: 24,
          padding: "12px 20px",
          background: "#ffffff",
          borderRadius: 12,
          boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
        }}
      >
        <h1 style={{ marginRight: "auto", fontSize: 20, color: "#1f2937" }}>APAR Manager</h1>
        <nav style={{ display: "flex", gap: 12 }}>
          <Link style={{ textDecoration: "none", color: "#374151" }} to="/">
            Daftar APAR
          </Link>
          <Link style={{ textDecoration: "none", color: "#374151" }} to="/scan">
            Scan QR
          </Link>
          <Link style={{ textDecoration: "none", color: "#374151" }} to="/cetak">
            Cetak QR
          </Link>
        </nav>
      </header>

      <main
        style={{
          background: "#ffffff",
          borderRadius: 12,
          padding: 24,
          boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
        }}
      >
        <Outlet />
      </main>
    </div>
  );
}
