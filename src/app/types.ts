export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
}

export interface InvoiceData {
  // Business info
  businessName: string;
  businessEmail: string;
  businessAddress: string;
  businessPhone: string;

  // Client info
  clientName: string;
  clientEmail: string;
  clientAddress: string;

  // Invoice details
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;

  // Line items
  items: LineItem[];

  // Settings
  taxRate: number;
  currency: string;
  notes: string;

  // Premium
  logoUrl: string | null;
}

export const CURRENCIES = [
  { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" },
  { code: "GBP", symbol: "£" },
  { code: "CAD", symbol: "CA$" },
  { code: "AUD", symbol: "A$" },
  { code: "JPY", symbol: "¥" },
  { code: "INR", symbol: "₹" },
  { code: "BRL", symbol: "R$" },
  { code: "MXN", symbol: "MX$" },
] as const;

export function getCurrencySymbol(code: string): string {
  return CURRENCIES.find((c) => c.code === code)?.symbol ?? "$";
}

export function formatCurrency(amount: number, currencyCode: string): string {
  const symbol = getCurrencySymbol(currencyCode);
  return `${symbol}${amount.toFixed(currencyCode === "JPY" ? 0 : 2)}`;
}

export function createEmptyInvoice(): InvoiceData {
  const today = new Date();
  const due = new Date(today);
  due.setDate(due.getDate() + 30);

  return {
    businessName: "",
    businessEmail: "",
    businessAddress: "",
    businessPhone: "",
    clientName: "",
    clientEmail: "",
    clientAddress: "",
    invoiceNumber: `INV-${String(Date.now()).slice(-6)}`,
    invoiceDate: today.toISOString().split("T")[0],
    dueDate: due.toISOString().split("T")[0],
    items: [{ id: crypto.randomUUID(), description: "", quantity: 1, rate: 0 }],
    taxRate: 0,
    currency: "USD",
    notes: "",
    logoUrl: null,
  };
}
