import React, { useState } from "react";
import axios from "axios";
import "./Invoice.css";

function InvoicePage() {

  const [form, setForm] = useState({
    to: "",
    gstin: "",
    mobile: "",
    taxInvoice: "",
    date: "",
    orderNo: "",
    dated: "",
    dispatch: "",
    courier: "",
    sgst: "",
    cgst: "",
    igst: ""
  });

  const [items, setItems] = useState([
    { particular: "", qty: "", rate: "", amount: "" }
  ]);

  const [fileName, setFileName] = useState("invoice");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;

    if (field === "qty" || field === "rate") {
      const qty = updated[index].qty || 0;
      const rate = updated[index].rate || 0;
      updated[index].amount = qty * rate;
    }

    setItems(updated);
  };

  const addRow = () => {
    setItems([...items, { particular: "", qty: "", rate: "", amount: "" }]);
  };

  const deleteRow = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const generateText = () => {
    let itemString = items
      .map(item => `${item.particular} Qty ${item.qty} Rate ${item.rate}`)
      .join(", ");

    const finalText =
      `${itemString}, ` +
      `To ${form.to}, ` +
      `Courier ${form.courier}, ` +
      `SGST ${form.sgst} percent, ` +
      `CGST ${form.cgst} percent, ` +
      `IGST ${form.igst} percent, ` +
      `PI NO ${form.taxInvoice}, ` +
      `Date ${form.date}, ` +
      `Order No ${form.orderNo}, ` +
      `Dated ${form.dated}, ` +
      `Dispatch ${form.dispatch}, ` +
      `GSTIN ${form.gstin}, ` +
      `Mobile ${form.mobile}`;

    setText(finalText);
  };

  const handleGenerate = async () => {
    if (!text.trim()) {
      alert("Generate text first!");
      return;
    }

    try {
      setLoading(true);

      console.log("text Passed to API " + text);
      const response = await axios.post(
        "https://texttoinvoice.onrender.com/generate",
        { voiceText: text },
        {
          responseType: "blob",
          timeout: 60000,
          headers: { "Content-Type": "application/json" }
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${fileName}.pdf`);
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

        <h2 className="card-title">Invoice Generator</h2>
        <p className="description">
          Fill details → Generate text → Download PDF
        </p>

        <div className="form-group">
          <label><b>PDF File Name</b></label>
          <input className="file-input"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
          />
        </div>

        <div className="section">
          <div className="section-title">Invoice Details</div>

          <div className="grid">
            <input name="to" placeholder="To" onChange={handleChange} />
            <input name="gstin" placeholder="GSTIN" onChange={handleChange} />
            <input name="mobile" placeholder="Mobile" maxLength={10} onChange={handleChange} />
            <input name="taxInvoice" placeholder="Tax Invoice No" onChange={handleChange} />
            <input name="date" placeholder="Date" onChange={handleChange} />
            <input name="orderNo" placeholder="Order/Enquiry" onChange={handleChange} />
            <input name="dated" placeholder="Dated" onChange={handleChange} />
            <input name="dispatch" placeholder="Dispatch" onChange={handleChange} />
            <input name="courier" placeholder="Courier Charges" onChange={handleChange} />
            <input name="sgst" placeholder="SGST %" onChange={handleChange} />
            <input name="cgst" placeholder="CGST %" onChange={handleChange} />
            <input name="igst" placeholder="IGST %" onChange={handleChange} />
          </div>
        </div>

        <div className="section">
          <div className="section-title">Items</div>

          <div className="item-header">
            <div>Particular</div>
            <div>Qty</div>
            <div>Rate</div>
            <div>Amount</div>
            <div></div>
          </div>

          {items.map((item, index) => (
            <div key={index} className="item-row">
              <input
                placeholder="Particular"
                value={item.particular}
                onChange={(e) =>
                  handleItemChange(index, "particular", e.target.value)
                }
              />
              <input
                type="number"
                placeholder="Qty"
                value={item.qty}
                onChange={(e) =>
                  handleItemChange(index, "qty", e.target.value)
                }
              />
              <input
                type="number"
                placeholder="Rate"
                value={item.rate}
                onChange={(e) =>
                  handleItemChange(index, "rate", e.target.value)
                }
              />
              <input value={item.amount} readOnly />

              <button
                className="delete-btn"
                onClick={() => deleteRow(index)}
              >
                ✕
              </button>
            </div>
          ))}

          <button className="add-button" onClick={addRow}>
            + Add Item
          </button>
        </div>

        <textarea value={text} readOnly />

        <div className="button-group">
          <button className="reset-button" onClick={generateText}>
            Generate Text
          </button>

          <button
            className="generate-button"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? "Generating..." : "Download PDF"}
          </button>
        </div>

      </div>
    </div>
  );
}

export default InvoicePage;