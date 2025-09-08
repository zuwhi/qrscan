import { useEffect, useMemo, useState } from "react";
import { fetchAparList } from "../services/sheets";

export default function DaftarApar() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [apars, setApars] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let mounted = true;
    fetchAparList()
      .then((list) => {
        if (mounted) {
          setApars(list);
          setLoading(false);
        }
      })
      .catch((e) => {
        if (mounted) {
          setError(e.message || "Gagal memuat data");
          setLoading(false);
        }
      });
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return apars;
    return apars.filter((a) => [a.nomor, a.lokasi, a.kondisi, a.tanggal].some((v) => (v || "").toLowerCase().includes(q)));
  }, [apars, query]);

  if (loading) return <div>Memuat...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div>
      <h2>Daftar APAR</h2>
      <input placeholder="Cari nomor/lokasi/kondisi/tanggal" value={query} onChange={(e) => setQuery(e.target.value)} style={{ padding: 8, margin: "8px 0", width: "100%", maxWidth: 420 }} />
      <div style={{ overflowX: "auto" }}>
        <table>
          <thead>
            <tr>
              <th>Nomor</th>
              <th>Lokasi</th>
              <th>Kondisi</th>
              <th>Tanggal</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((a, idx) => (
              <tr key={idx}>
                <td>{a.nomor}</td>
                <td>{a.lokasi}</td>
                <td>{a.kondisi}</td>
                <td>{a.tanggal}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
