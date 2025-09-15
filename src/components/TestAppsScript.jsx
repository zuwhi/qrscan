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
      setTestResult((prev) => prev + `📋 Environment: ${import.meta.env.MODE}\n`);

      // Test GET request
      setTestResult((prev) => prev + `\n🔍 Testing GET request...\n`);
      const getResponse = await fetch(appsScriptUrl, {
        method: "GET",
        mode: "cors",
      });

      setTestResult((prev) => prev + `📊 GET Response Status: ${getResponse.status}\n`);
      setTestResult((prev) => prev + `📊 GET Response Headers: ${JSON.stringify(Object.fromEntries(getResponse.headers.entries()))}\n`);

      if (getResponse.ok) {
        const getData = await getResponse.json();
        setTestResult((prev) => prev + `✅ GET Test: ${JSON.stringify(getData)}\n`);

        // Check if response has new format
        if (getData.success === true) {
          setTestResult((prev) => prev + `✅ Apps Script sudah di-update dengan kode terbaru!\n`);
        } else {
          setTestResult((prev) => prev + `⚠️ Apps Script masih menggunakan kode lama. Perlu di-update!\n`);
        }
      } else {
        const errorText = await getResponse.text();
        setTestResult((prev) => prev + `❌ GET Test failed: ${getResponse.status} - ${errorText}\n`);
      }

      // Test POST request
      const testData = {
        nomor: "TEST123",
        lokasi: "Test Lokasi",
        kondisi: "Baik",
        tanggal: "2024-01-01",
      };

      setTestResult((prev) => prev + `\n🔍 Testing POST request...\n`);
      setTestResult((prev) => prev + `📤 POST Data: ${JSON.stringify(testData)}\n`);

      const postResponse = await fetch(appsScriptUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testData),
        mode: "cors",
        cache: "no-cache",
      });

      setTestResult((prev) => prev + `📊 POST Response Status: ${postResponse.status}\n`);
      setTestResult((prev) => prev + `📊 POST Response Headers: ${JSON.stringify(Object.fromEntries(postResponse.headers.entries()))}\n`);

      if (postResponse.ok) {
        const postData = await postResponse.json();
        setTestResult((prev) => prev + `✅ POST Test: ${JSON.stringify(postData)}\n`);
      } else {
        const errorText = await postResponse.text();
        setTestResult((prev) => prev + `❌ POST Test failed: ${postResponse.status} - ${errorText}\n`);
      }
    } catch (error) {
      setTestResult((prev) => prev + `❌ Error: ${error.message}\n`);
      setTestResult((prev) => prev + `❌ Error Type: ${error.name}\n`);
      setTestResult((prev) => prev + `❌ Error Stack: ${error.stack}\n`);
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
