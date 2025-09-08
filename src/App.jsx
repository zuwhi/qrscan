import { Link, Outlet } from "react-router-dom";

export default function App() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#ffffff", color: "#111827", fontFamily: "Arial, sans-serif" }}>
      <header style={{ position: "sticky", top: 0, zIndex: 10, background: "#0b1220", color: "#ffffff", boxShadow: "0 2px 10px rgba(0,0,0,0.2)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "12px 16px", display: "flex", alignItems: "center", gap: 12 }}>
          <h1 style={{ margin: 0, marginRight: "auto", fontSize: 20 }}>GA Express</h1>
          <nav style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link to="/" style={{ color: "#3b82f6", textDecoration: "none" }}>
              Daftar APAR
            </Link>
            <Link to="/scan" style={{ color: "#3b82f6", textDecoration: "none" }}>
              Scan QR
            </Link>
            <Link to="/cetak" style={{ color: "#3b82f6", textDecoration: "none" }}>
              Cetak QR
            </Link>
          </nav>
        </div>
      </header>
      <main style={{ flex: 1 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: 16 }}>
          <div style={{ background: "#ffffff", borderRadius: 12, padding: 16, boxShadow: "0 2px 10px rgba(0,0,0,0.06)", border: "1px solid #dbeafe" }}>
            <Outlet />
          </div>
        </div>
      </main>
      <footer style={{ borderTop: "2px solid #3b82f6", padding: 12, textAlign: "center", color: "#111827", background: "#ffffff" }}>© {new Date().getFullYear()} APAR Manager</footer>
    </div>
  );
}
