"use client";

import { InvoiceData, formatCurrency } from "../types";

export type InvoiceTheme = "clean" | "bold" | "minimal" | "classic";

interface Props {
  data: InvoiceData;
  theme?: InvoiceTheme;
}

const themes: Record<InvoiceTheme, {
  accent: string;
  accentBg: string;
  headerText: string;
  borderColor: string;
  totalBg: string;
  totalText: string;
}> = {
  clean: {
    accent: "#2563eb",
    accentBg: "#eff6ff",
    headerText: "#1e40af",
    borderColor: "#e5e7eb",
    totalBg: "#1e40af",
    totalText: "#ffffff",
  },
  bold: {
    accent: "#0f172a",
    accentBg: "#f8fafc",
    headerText: "#0f172a",
    borderColor: "#0f172a",
    totalBg: "#0f172a",
    totalText: "#ffffff",
  },
  minimal: {
    accent: "#6b7280",
    accentBg: "#f9fafb",
    headerText: "#374151",
    borderColor: "#f3f4f6",
    totalBg: "#f9fafb",
    totalText: "#111827",
  },
  classic: {
    accent: "#991b1b",
    accentBg: "#fef2f2",
    headerText: "#991b1b",
    borderColor: "#fecaca",
    totalBg: "#991b1b",
    totalText: "#ffffff",
  },
};

export default function InvoicePreview({ data, theme = "clean" }: Props) {
  const t = themes[theme];
  const subtotal = data.items.reduce(
    (sum, item) => sum + item.quantity * item.rate,
    0
  );
  const tax = subtotal * (data.taxRate / 100);
  const total = subtotal + tax;

  return (
    <div
      id="invoice-preview"
      className="bg-white text-gray-900 p-8 sm:p-10 shadow-lg rounded-lg max-w-[210mm] mx-auto"
      style={{ fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif" }}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          {data.logoUrl && (
            <img
              src={data.logoUrl}
              alt="Logo"
              className="h-12 mb-3 object-contain"
            />
          )}
          <h1 className="text-2xl font-bold" style={{ color: t.headerText }}>
            {data.businessName || "Your Business"}
          </h1>
          {data.businessEmail && (
            <p className="text-sm text-gray-500">{data.businessEmail}</p>
          )}
          {data.businessPhone && (
            <p className="text-sm text-gray-500">{data.businessPhone}</p>
          )}
          {data.businessAddress && (
            <p className="text-sm text-gray-500 whitespace-pre-line">
              {data.businessAddress}
            </p>
          )}
        </div>
        <div className="text-right">
          <h2
            className="text-3xl font-bold uppercase tracking-wider"
            style={{ color: t.accent, opacity: 0.3 }}
          >
            Invoice
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            <span className="text-gray-400">#</span> {data.invoiceNumber}
          </p>
        </div>
      </div>

      {/* Bill To + Dates */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <p
            className="text-xs font-semibold uppercase tracking-wider mb-1"
            style={{ color: t.accent }}
          >
            Bill To
          </p>
          <p className="font-semibold text-gray-900">
            {data.clientName || "Client Name"}
          </p>
          {data.clientEmail && (
            <p className="text-sm text-gray-500">{data.clientEmail}</p>
          )}
          {data.clientAddress && (
            <p className="text-sm text-gray-500 whitespace-pre-line">
              {data.clientAddress}
            </p>
          )}
        </div>
        <div className="text-right">
          <div className="mb-2">
            <p
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: t.accent }}
            >
              Invoice Date
            </p>
            <p className="text-sm text-gray-700">
              {data.invoiceDate
                ? new Date(data.invoiceDate + "T00:00:00").toLocaleDateString(
                    "en-US",
                    { year: "numeric", month: "long", day: "numeric" }
                  )
                : "—"}
            </p>
          </div>
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: t.accent }}
            >
              Due Date
            </p>
            <p className="text-sm text-gray-700">
              {data.dueDate
                ? new Date(data.dueDate + "T00:00:00").toLocaleDateString(
                    "en-US",
                    { year: "numeric", month: "long", day: "numeric" }
                  )
                : "—"}
            </p>
          </div>
        </div>
      </div>

      {/* Line Items Table */}
      <table className="w-full mb-6">
        <thead>
          <tr style={{ borderBottom: `2px solid ${t.borderColor}` }}>
            <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider py-2">
              Description
            </th>
            <th className="text-right text-xs font-semibold text-gray-400 uppercase tracking-wider py-2 w-20">
              Qty
            </th>
            <th className="text-right text-xs font-semibold text-gray-400 uppercase tracking-wider py-2 w-24">
              Rate
            </th>
            <th className="text-right text-xs font-semibold text-gray-400 uppercase tracking-wider py-2 w-28">
              Amount
            </th>
          </tr>
        </thead>
        <tbody>
          {data.items.map((item, i) => (
            <tr
              key={item.id}
              style={{
                borderBottom: `1px solid ${t.borderColor}`,
                backgroundColor: i % 2 === 1 ? t.accentBg : "transparent",
              }}
            >
              <td className="py-3 text-sm text-gray-700">
                {item.description || "—"}
              </td>
              <td className="py-3 text-sm text-gray-700 text-right">
                {item.quantity}
              </td>
              <td className="py-3 text-sm text-gray-700 text-right">
                {formatCurrency(item.rate, data.currency)}
              </td>
              <td className="py-3 text-sm text-gray-900 text-right font-medium">
                {formatCurrency(item.quantity * item.rate, data.currency)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="flex justify-end">
        <div className="w-64">
          <div className="flex justify-between py-1">
            <span className="text-sm text-gray-500">Subtotal</span>
            <span className="text-sm text-gray-700">
              {formatCurrency(subtotal, data.currency)}
            </span>
          </div>
          {data.taxRate > 0 && (
            <div className="flex justify-between py-1">
              <span className="text-sm text-gray-500">
                Tax ({data.taxRate}%)
              </span>
              <span className="text-sm text-gray-700">
                {formatCurrency(tax, data.currency)}
              </span>
            </div>
          )}
          <div
            className="flex justify-between py-2 px-3 rounded-md mt-1"
            style={{ backgroundColor: t.totalBg }}
          >
            <span className="font-bold" style={{ color: t.totalText }}>
              Total
            </span>
            <span
              className="font-bold text-lg"
              style={{ color: t.totalText }}
            >
              {formatCurrency(total, data.currency)}
            </span>
          </div>
        </div>
      </div>

      {/* Notes */}
      {data.notes && (
        <div className="mt-8 pt-6 border-t border-gray-100">
          <p
            className="text-xs font-semibold uppercase tracking-wider mb-1"
            style={{ color: t.accent }}
          >
            Notes
          </p>
          <p className="text-sm text-gray-600 whitespace-pre-line">
            {data.notes}
          </p>
        </div>
      )}

      {/* Branding — free tier */}
      <div className="mt-8 pt-4 border-t border-gray-100 text-center">
        <p className="text-xs text-gray-300">
          Created with{" "}
          <a
            href="/"
            className="text-blue-400 hover:text-blue-500"
            target="_blank"
          >
            QuickInvoice
          </a>
        </p>
      </div>
    </div>
  );
}
