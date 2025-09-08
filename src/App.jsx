import { Link, Outlet } from "react-router-dom";

export default function App() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#f3f4f6", fontFamily: "Arial, sans-serif" }}>
      <header style={{ position: "sticky", top: 0, zIndex: 10, background: "#111827", color: "#fff", boxShadow: "0 2px 10px rgba(0,0,0,0.2)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "12px 16px", display: "flex", alignItems: "center", gap: 12 }}>
          <h1 style={{ margin: 0, marginRight: "auto", fontSize: 20 }}>GA Express</h1>
          <nav style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link to="/" style={{ color: "#e5e7eb", textDecoration: "none" }}>
              Daftar APAR
            </Link>
            <Link to="/scan" style={{ color: "#e5e7eb", textDecoration: "none" }}>
              Scan QR
            </Link>
            <Link to="/cetak" style={{ color: "#e5e7eb", textDecoration: "none" }}>
              Cetak QR
            </Link>
          </nav>
        </div>
      </header>
      <main style={{ flex: 1 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: 16 }}>
          <div style={{ background: "#ffffff", borderRadius: 12, padding: 16, boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}>
            <Outlet />
          </div>
        </div>
      </main>
      <footer style={{ borderTop: "1px solid #e5e7eb", padding: 12, textAlign: "center", color: "#6b7280", background: "#ffffff" }}>© {new Date().getFullYear()} APAR Manager</footer>
    </div>
  );
}
