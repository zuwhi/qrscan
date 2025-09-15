import { useState } from "react";

export default function TestAppsScript() {
  const [testResult, setTestResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const testAppsScript = async () => {
    setIsLoading(true);
    setTestResult("Testing...");

    try {
      const appsScriptUrl = import.meta.env.VITE_APPS_SCRIPT_URL;

      if (!appsScriptUrl) {
        setTestResult("❌ VITE_APPS_SCRIPT_URL tidak ditemukan di environment variables");
        return;
      }

      setTestResult(`🔍 Testing URL: ${appsScriptUrl}\n`);

      // Test GET request
      const getResponse = await fetch(appsScriptUrl, {
        method: "GET",
        mode: "cors",
      });

      if (getResponse.ok) {
        const getData = await getResponse.json();
        setTestResult((prev) => prev + `✅ GET Test: ${JSON.stringify(getData)}\n`);
      } else {
        setTestResult((prev) => prev + `❌ GET Test failed: ${getResponse.status}\n`);
      }

      // Test POST request
      const testData = {
        nomor: "TEST123",
        lokasi: "Test Lokasi",
        kondisi: "Baik",
        tanggal: "2024-01-01",
      };

      setTestResult((prev) => prev + `🔍 Testing POST with data: ${JSON.stringify(testData)}\n`);

      const postResponse = await fetch(appsScriptUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testData),
        mode: "cors",
      });

      if (postResponse.ok) {
        const postData = await postResponse.json();
        setTestResult((prev) => prev + `✅ POST Test: ${JSON.stringify(postData)}\n`);
      } else {
        const errorText = await postResponse.text();
        setTestResult((prev) => prev + `❌ POST Test failed: ${postResponse.status} - ${errorText}\n`);
      }
    } catch (error) {
      setTestResult((prev) => prev + `❌ Error: ${error.message}\n`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: 20,
        border: "1px solid #ccc",
        borderRadius: 8,
        margin: 20,
        backgroundColor: "#f9f9f9",
      }}
    >
      <h3>Test Google Apps Script</h3>
      <p>Klik tombol di bawah untuk test koneksi ke Apps Script:</p>

      <button
        onClick={testAppsScript}
        disabled={isLoading}
        style={{
          padding: "10px 20px",
          backgroundColor: isLoading ? "#ccc" : "#007bff",
          color: "white",
          border: "none",
          borderRadius: 4,
          cursor: isLoading ? "not-allowed" : "pointer",
        }}
      >
        {isLoading ? "Testing..." : "Test Apps Script"}
      </button>

      {testResult && (
        <div
          style={{
            marginTop: 20,
            padding: 10,
            backgroundColor: "#fff",
            border: "1px solid #ddd",
            borderRadius: 4,
            fontFamily: "monospace",
            whiteSpace: "pre-wrap",
            fontSize: 12,
          }}
        >
          {testResult}
        </div>
      )}

      <div style={{ marginTop: 20, fontSize: 12, color: "#666" }}>
        <strong>Environment Variables:</strong>
        <br />
        VITE_APPS_SCRIPT_URL: {import.meta.env.VITE_APPS_SCRIPT_URL || "❌ Not set"}
      </div>
    </div>
  );
}
