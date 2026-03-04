"use client";

import { InvoiceData, LineItem, CURRENCIES } from "../types";

interface Props {
  data: InvoiceData;
  onChange: (data: InvoiceData) => void;
}

export default function InvoiceForm({ data, onChange }: Props) {
  const update = (fields: Partial<InvoiceData>) =>
    onChange({ ...data, ...fields });

  const updateItem = (id: string, fields: Partial<LineItem>) => {
    onChange({
      ...data,
      items: data.items.map((item) =>
        item.id === id ? { ...item, ...fields } : item
      ),
    });
  };

  const addItem = () => {
    onChange({
      ...data,
      items: [
        ...data.items,
        { id: crypto.randomUUID(), description: "", quantity: 1, rate: 0 },
      ],
    });
  };

  const removeItem = (id: string) => {
    if (data.items.length <= 1) return;
    onChange({ ...data, items: data.items.filter((item) => item.id !== id) });
  };

  return (
    <div className="space-y-6">
      {/* Business Info */}
      <section>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Your Business
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="Business Name"
            value={data.businessName}
            onChange={(e) => update({ businessName: e.target.value })}
            className="input-field col-span-full"
          />
          <input
            type="email"
            placeholder="Email"
            value={data.businessEmail}
            onChange={(e) => update({ businessEmail: e.target.value })}
            className="input-field"
          />
          <input
            type="tel"
            placeholder="Phone"
            value={data.businessPhone}
            onChange={(e) => update({ businessPhone: e.target.value })}
            className="input-field"
          />
          <textarea
            placeholder="Address"
            value={data.businessAddress}
            onChange={(e) => update({ businessAddress: e.target.value })}
            rows={2}
            className="input-field col-span-full"
          />
        </div>
      </section>

      {/* Client Info */}
      <section>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Bill To
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="Client Name"
            value={data.clientName}
            onChange={(e) => update({ clientName: e.target.value })}
            className="input-field col-span-full"
          />
          <input
            type="email"
            placeholder="Client Email"
            value={data.clientEmail}
            onChange={(e) => update({ clientEmail: e.target.value })}
            className="input-field col-span-full"
          />
          <textarea
            placeholder="Client Address"
            value={data.clientAddress}
            onChange={(e) => update({ clientAddress: e.target.value })}
            rows={2}
            className="input-field col-span-full"
          />
        </div>
      </section>

      {/* Invoice Details */}
      <section>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Invoice Details
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="text"
            placeholder="Invoice #"
            value={data.invoiceNumber}
            onChange={(e) => update({ invoiceNumber: e.target.value })}
            className="input-field"
          />
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Date</label>
            <input
              type="date"
              value={data.invoiceDate}
              onChange={(e) => update({ invoiceDate: e.target.value })}
              className="input-field"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Due Date</label>
            <input
              type="date"
              value={data.dueDate}
              onChange={(e) => update({ dueDate: e.target.value })}
              className="input-field"
            />
          </div>
        </div>
      </section>

      {/* Currency & Tax */}
      <section>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Currency</label>
            <select
              value={data.currency}
              onChange={(e) => update({ currency: e.target.value })}
              className="input-field"
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} ({c.symbol})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Tax Rate (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={data.taxRate}
              onChange={(e) =>
                update({ taxRate: parseFloat(e.target.value) || 0 })
              }
              className="input-field"
            />
          </div>
        </div>
      </section>

      {/* Line Items */}
      <section>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Items
        </h2>
        <div className="space-y-2">
          {data.items.map((item, i) => (
            <div
              key={item.id}
              className="grid grid-cols-[1fr_70px_90px_32px] gap-2 items-start"
            >
              <input
                type="text"
                placeholder={`Item ${i + 1} description`}
                value={item.description}
                onChange={(e) =>
                  updateItem(item.id, { description: e.target.value })
                }
                className="input-field"
              />
              <input
                type="number"
                min="0"
                step="1"
                placeholder="Qty"
                value={item.quantity}
                onChange={(e) =>
                  updateItem(item.id, {
                    quantity: parseFloat(e.target.value) || 0,
                  })
                }
                className="input-field text-right"
              />
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="Rate"
                value={item.rate}
                onChange={(e) =>
                  updateItem(item.id, {
                    rate: parseFloat(e.target.value) || 0,
                  })
                }
                className="input-field text-right"
              />
              <button
                onClick={() => removeItem(item.id)}
                className="h-[38px] text-gray-400 hover:text-red-500 transition-colors text-lg"
                title="Remove item"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={addItem}
          className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          + Add Item
        </button>
      </section>

      {/* Notes */}
      <section>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Notes
        </h2>
        <textarea
          placeholder="Payment terms, thank you note, etc."
          value={data.notes}
          onChange={(e) => update({ notes: e.target.value })}
          rows={3}
          className="input-field"
        />
      </section>
    </div>
  );
}
