"use client";

import { useState, useEffect, useCallback } from "react";
import { InvoiceData, createEmptyInvoice } from "./types";

const STORAGE_KEY = "quickinvoice_current";
const HISTORY_KEY = "quickinvoice_history";
const BIZ_KEY = "quickinvoice_business";

export interface SavedInvoice {
  id: string;
  data: InvoiceData;
  savedAt: string;
  label: string;
}

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export function useInvoice() {
  const [data, setData] = useState<InvoiceData>(createEmptyInvoice);
  const [history, setHistory] = useState<SavedInvoice[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = loadFromStorage<InvoiceData | null>(STORAGE_KEY, null);
    const savedHistory = loadFromStorage<SavedInvoice[]>(HISTORY_KEY, []);
    if (saved) setData(saved);
    setHistory(savedHistory);
    setLoaded(true);
  }, []);

  // Auto-save current invoice
  useEffect(() => {
    if (!loaded) return;
    saveToStorage(STORAGE_KEY, data);
  }, [data, loaded]);

  // Remember business info for next invoice
  const saveBusinessInfo = useCallback((d: InvoiceData) => {
    saveToStorage(BIZ_KEY, {
      businessName: d.businessName,
      businessEmail: d.businessEmail,
      businessAddress: d.businessAddress,
      businessPhone: d.businessPhone,
    });
  }, []);

  // Save to history
  const saveToHistory = useCallback(() => {
    const entry: SavedInvoice = {
      id: crypto.randomUUID(),
      data: { ...data },
      savedAt: new Date().toISOString(),
      label: `${data.invoiceNumber} — ${data.clientName || "Draft"}`,
    };
    const updated = [entry, ...history].slice(0, 50);
    setHistory(updated);
    saveToStorage(HISTORY_KEY, updated);
    saveBusinessInfo(data);
  }, [data, history, saveBusinessInfo]);

  // Load from history
  const loadFromHistory = useCallback((entry: SavedInvoice) => {
    setData(entry.data);
  }, []);

  // New invoice (preserves business info)
  const newInvoice = useCallback(() => {
    const biz = loadFromStorage<Partial<InvoiceData> | null>(BIZ_KEY, null);
    const fresh = createEmptyInvoice();
    if (biz) {
      fresh.businessName = biz.businessName || "";
      fresh.businessEmail = biz.businessEmail || "";
      fresh.businessAddress = biz.businessAddress || "";
      fresh.businessPhone = biz.businessPhone || "";
    }
    setData(fresh);
  }, []);

  return { data, setData, history, saveToHistory, loadFromHistory, newInvoice, loaded };
}
