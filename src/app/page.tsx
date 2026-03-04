"use client";

import { useState, useCallback } from "react";
import InvoiceForm from "./components/InvoiceForm";
import InvoicePreview, { InvoiceTheme } from "./components/InvoicePreview";
import { useInvoice } from "./hooks";

const THEME_OPTIONS: { id: InvoiceTheme; label: string; color: string }[] = [
  { id: "clean", label: "Clean", color: "#2563eb" },
  { id: "bold", label: "Bold", color: "#0f172a" },
  { id: "minimal", label: "Minimal", color: "#6b7280" },
  { id: "classic", label: "Classic", color: "#991b1b" },
];

export default function Home() {
  const { data, setData, history, saveToHistory, loadFromHistory, newInvoice, loaded } =
    useInvoice();
  const [generating, setGenerating] = useState(false);
  const [theme, setTheme] = useState<InvoiceTheme>("clean");
  const [showHistory, setShowHistory] = useState(false);

  const handleDownloadPDF = useCallback(async () => {
    setGenerating(true);
    try {
      const element = document.getElementById("invoice-preview");
      if (!element) return;

      const html2canvas = (await import("html2canvas-pro")).default;
      const { jsPDF } = await import("jspdf");

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${data.invoiceNumber || "invoice"}.pdf`);

      // Auto-save to history on download
      saveToHistory();
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setGenerating(false);
    }
  }, [data.invoiceNumber, saveToHistory]);

  if (!loaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400 text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Quick<span className="text-blue-600">Invoice</span>
            </h1>
            <p className="text-xs text-gray-400">
              Free invoice generator — no sign-up required
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                saveToHistory();
                newInvoice();
              }}
              className="text-sm text-gray-500 hover:text-gray-700 font-medium px-3 py-2"
            >
              New
            </button>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="text-sm text-gray-500 hover:text-gray-700 font-medium px-3 py-2 relative"
            >
              History
              {history.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-blue-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {history.length}
                </span>
              )}
            </button>
            <button
              onClick={handleDownloadPDF}
              disabled={generating}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium px-5 py-2.5 rounded-lg text-sm transition-colors shadow-sm"
            >
              {generating ? "Generating..." : "Download PDF"}
            </button>
          </div>
        </div>
      </header>

      {/* History Drawer */}
      {showHistory && (
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-700">
                Saved Invoices
              </h3>
              <button
                onClick={() => setShowHistory(false)}
                className="text-xs text-gray-400 hover:text-gray-600"
              >
                Close
              </button>
            </div>
            {history.length === 0 ? (
              <p className="text-xs text-gray-400 py-2">
                No saved invoices yet. Invoices are saved automatically when you
                download.
              </p>
            ) : (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {history.map((entry) => (
                  <button
                    key={entry.id}
                    onClick={() => {
                      loadFromHistory(entry);
                      setShowHistory(false);
                    }}
                    className="flex-shrink-0 text-left bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg px-3 py-2 transition-colors"
                  >
                    <p className="text-sm font-medium text-gray-700 truncate max-w-[200px]">
                      {entry.label}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      {new Date(entry.savedAt).toLocaleDateString()}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Form */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <InvoiceForm data={data} onChange={setData} />
          </div>

          {/* Right: Preview */}
          <div className="lg:sticky lg:top-6 lg:self-start">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Preview
              </h2>
              <div className="flex items-center gap-3">
                {/* Theme Selector */}
                <div className="flex items-center gap-1.5">
                  {THEME_OPTIONS.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTheme(t.id)}
                      className={`w-5 h-5 rounded-full border-2 transition-all ${
                        theme === t.id
                          ? "border-gray-900 scale-110"
                          : "border-transparent hover:border-gray-300"
                      }`}
                      style={{ backgroundColor: t.color }}
                      title={t.label}
                    />
                  ))}
                </div>
                <button
                  onClick={handleDownloadPDF}
                  disabled={generating}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium lg:hidden"
                >
                  {generating ? "Generating..." : "Download PDF"}
                </button>
              </div>
            </div>
            <div className="overflow-auto rounded-lg border border-gray-200">
              <InvoicePreview data={data} theme={theme} />
            </div>
          </div>
        </div>
      </main>

      {/* SEO Footer */}
      <footer className="mt-12 py-8 border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Free Invoice Generator
            </h2>
            <p className="text-sm text-gray-500 max-w-xl mx-auto">
              Create professional invoices in seconds. No sign-up, no watermarks,
              no hidden fees. Fill in your details, preview your invoice, and
              download as PDF — completely free.
            </p>
          </div>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="p-4">
              <h3 className="font-medium text-gray-900 text-sm">No Sign-Up</h3>
              <p className="text-xs text-gray-400 mt-1">
                Start creating invoices immediately. No account needed.
              </p>
            </div>
            <div className="p-4">
              <h3 className="font-medium text-gray-900 text-sm">100% Free</h3>
              <p className="text-xs text-gray-400 mt-1">
                No watermarks, no limits, no hidden costs.
              </p>
            </div>
            <div className="p-4">
              <h3 className="font-medium text-gray-900 text-sm">
                Professional PDFs
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Clean, professional invoices your clients will take seriously.
              </p>
            </div>
          </div>
          <div className="mt-6 text-center">
            <h3 className="font-medium text-gray-900 text-sm mb-2">
              Why QuickInvoice?
            </h3>
            <div className="text-xs text-gray-400 max-w-lg mx-auto space-y-1">
              <p>Multiple professional themes to match your brand.</p>
              <p>Your data stays in your browser — we never store it.</p>
              <p>Auto-saves your work. Come back anytime.</p>
              <p>Invoice history so you never lose track.</p>
            </div>
          </div>
          <p className="text-center text-xs text-gray-300 mt-6">
            QuickInvoice — Free Invoice Generator
          </p>
        </div>
      </footer>
    </div>
  );
}
