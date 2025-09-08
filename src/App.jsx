import { Link, Outlet } from "react-router-dom";
import "./App.css";

export default function App() {
  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: 16 }}>
      <header style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}>
        <h1 style={{ marginRight: "auto" }}>APAR Manager</h1>
        <nav style={{ display: "flex", gap: 8 }}>
          <Link to="/">Daftar APAR</Link>
          <Link to="/scan">Scan QR</Link>
          <Link to="/cetak">Cetak QR</Link>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
