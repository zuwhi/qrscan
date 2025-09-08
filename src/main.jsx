import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import DaftarApar from "./pages/DaftarApar.jsx";
import ScanQR from "./pages/ScanQR.jsx";
import CetakQR from "./pages/CetakQR.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <DaftarApar /> },
      { path: "scan", element: <ScanQR /> },
      { path: "cetak", element: <CetakQR /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
