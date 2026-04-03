import React, { useState } from "react";
import axios from "axios";
import "./Invoice.css";

function InvoicePage() {

  const defaultText = `Repair DC motor Qty 7 Rate 9000, steor replacement Qty 10 Rate 15500 to Amar Packaging Inc address MIG complex mira road near poonam garden SK stone police chowki Courier Charges 400 SGST 10 percent CGST 12 percent IGST 18 percent Total 9322 PI NO 1234 Date 09122026 ORDER/ENQUIRY 223 Dated 10122026 Dispatch Borivali GSTIN 3837483478349 Mobile 8104868404`;

  const [text, setText] = useState(defaultText);
  const [fileName, setFileName] = useState("invoice");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!text.trim()) {
      alert("Please enter invoice text");
      return;
    }

    try {
      setLoading(true);

     const response = await axios.post(
  "https://texttoinvoice.onrender.com/generate",
  { voiceText: text },
  {
    responseType: "blob",
    timeout: 60000, // 60 sec
    headers: {
      "Content-Type": "application/json"
    }
  }
);

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${fileName || "invoice"}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();

    } catch (error) {
      console.error(error);
      alert("Error generating PDF");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="invoice-container">
      <div className="invoice-card">

        <h2 className="card-title">Text to Invoice</h2>
        <p className="description">
          Convert your text into a professional invoice instantly.
        </p>

        {/* File Name */}
        <div className="form-group">
          <label htmlFor="fileName">PDF File Name</label>
          <input
            id="fileName"
            type="text"
            placeholder="e.g. invoice_001"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
          />
        </div>

        {/* Text Area */}
        <div className="form-group">
          <label htmlFor="invoiceDetails">Invoice Details</label>
          <textarea
            id="invoiceDetails"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="generate-button"
          >
            {loading ? "Generating PDF..." : "Generate Invoice PDF"}
          </button>

          <button
            onClick={() => setText(defaultText)}
            className="reset-button"
          >
            Reset
          </button>
        </div>

      </div>
    </div>
  );
}

export default InvoicePage;