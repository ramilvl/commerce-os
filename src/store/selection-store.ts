import { create } from "zustand";

interface SelectionState {
  selectedIds: Set<string>;
  toggle: (id: string) => void;
  selectAll: (ids: string[]) => void;
  clear: () => void;
  isSelected: (id: string) => boolean;
}

/** Generic row-selection store usable by any DataTable instance that needs cross-page bulk actions. */
export const useSelectionStore = create<SelectionState>((set, get) => ({
  selectedIds: new Set(),
  toggle: (id) =>
    set((state) => {
      const next = new Set(state.selectedIds);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return { selectedIds: next };
    }),
  selectAll: (ids) => set({ selectedIds: new Set(ids) }),
  clear: () => set({ selectedIds: new Set() }),
  isSelected: (id) => get().selectedIds.has(id),
}));
