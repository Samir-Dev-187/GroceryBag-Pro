// src/context/UpdatesContext.tsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import useUpdates from '../hooks/useUpdates';

type UpdatesState = {
  suppliers: any[];
  customers: any[];
  purchases: any[];
  sales: any[];
};

type UpdatesContextType = {
  state: UpdatesState;
  mergeUpdates: (data: Partial<UpdatesState>) => void;
};

const defaultState: UpdatesState = { suppliers: [], customers: [], purchases: [], sales: [] };
const UpdatesContext = createContext<UpdatesContextType | undefined>(undefined);

export const UpdatesProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [state, setState] = useState<UpdatesState>(defaultState);

  // lightweight merge helper (unique by id or external id)
  const mergeUnique = useCallback((existing: any[], incoming: any[], key = 'id') => {
    const map = new Map(existing.map((i) => [String(i[key] ?? i.id ?? Math.random()), i]));
    for (const it of incoming || []) {
      const k = String(it[key] ?? it.id ?? Math.random());
      map.set(k, { ...(map.get(k) || {}), ...it });
    }
    return Array.from(map.values());
  }, []);

  const mergeUpdates = useCallback((data: Partial<UpdatesState>) => {
    setState((prev) => ({
      suppliers: data.suppliers?.length ? mergeUnique(prev.suppliers, data.suppliers, 'supplier_id' in (data.suppliers[0] || {}) ? 'supplier_id' : 'id') : prev.suppliers,
      customers: data.customers?.length ? mergeUnique(prev.customers, data.customers, 'customer_id' in (data.customers[0] || {}) ? 'customer_id' : 'id') : prev.customers,
      purchases: data.purchases?.length ? mergeUnique(prev.purchases, data.purchases, 'purchase_id' in (data.purchases[0] || {}) ? 'purchase_id' : 'id') : prev.purchases,
      sales: data.sales?.length ? mergeUnique(prev.sales, data.sales, 'sale_id' in (data.sales[0] || {}) ? 'sale_id' : 'id') : prev.sales,
    }));
  }, [mergeUnique]);

  // mount polling hook and feed data into mergeUpdates
  useUpdates((d) => {
    try { mergeUpdates(d); } catch (e) { console.error('UpdatesProvider merge error', e); }
  }, 10000);

  return <UpdatesContext.Provider value={{ state, mergeUpdates }}>{children}</UpdatesContext.Provider>;
};

export function useUpdatesContext() {
  const ctx = useContext(UpdatesContext);
  if (!ctx) throw new Error('useUpdatesContext must be used inside UpdatesProvider');
  return ctx;
}
