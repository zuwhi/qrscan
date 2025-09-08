import { Link, Outlet } from "react-router-dom";

export default function App() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#ffffff", color: "#111827", fontFamily: "Arial, sans-serif" }}>
      <header className="sticky top-0 z-10 bg-gradient-to-r from-[#0b1220] via-[#101b33] to-[#0b1220] text-white shadow-lg backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
          <h1 className="text-xl font-bold tracking-wide mr-auto">GA Express</h1>
          <nav className="flex gap-6 flex-wrap">
            <Link to="/" className="text-blue-400 hover:text-blue-300 transition-colors duration-300">
              Daftar APAR
            </Link>
            <Link to="/scan" className="text-blue-400 hover:text-blue-300 transition-colors duration-300">
              Scan QR
            </Link>
            <Link to="/cetak" className="text-blue-400 hover:text-blue-300 transition-colors duration-300">
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
