import { create } from "zustand";
import { persist } from "zustand/middleware";

interface VaultState {
  // Set of folder IDs that are expanded in the sidebar tree
  expandedIds: Set<string>;
  toggleFolder: (id: string) => void;
  expandFolder:  (id: string) => void;
  collapseFolder: (id: string) => void;
}

export const useVaultStore = create<VaultState>()(
  persist(
    (set) => ({
      expandedIds: new Set(),

      toggleFolder: (id) =>
        set((s) => {
          const next = new Set(s.expandedIds);
          next.has(id) ? next.delete(id) : next.add(id);
          return { expandedIds: next };
        }),

      expandFolder: (id) =>
        set((s) => ({ expandedIds: new Set([...s.expandedIds, id]) })),

      collapseFolder: (id) =>
        set((s) => {
          const next = new Set(s.expandedIds);
          next.delete(id);
          return { expandedIds: next };
        }),
    }),
    {
      name: "nexussat-vault",
      // Serialize Set for localStorage
      storage: {
        getItem: (key) => {
          const raw = localStorage.getItem(key);
          if (!raw) return null;
          const parsed = JSON.parse(raw);
          return { ...parsed, state: { ...parsed.state, expandedIds: new Set(parsed.state.expandedIds) } };
        },
        setItem: (key, value) => {
          const serialized = { ...value, state: { ...value.state, expandedIds: [...value.state.expandedIds] } };
          localStorage.setItem(key, JSON.stringify(serialized));
        },
        removeItem: (key) => localStorage.removeItem(key),
      },
    }
  )
);
