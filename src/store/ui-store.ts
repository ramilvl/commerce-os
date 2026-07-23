import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UiState {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (value: boolean) => void;

  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (value: boolean) => void;

  mobileNavOpen: boolean;
  setMobileNavOpen: (value: boolean) => void;

  theme: "light" | "dark" | "system";
  setTheme: (theme: "light" | "dark" | "system") => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setSidebarCollapsed: (value) => set({ sidebarCollapsed: value }),

      commandPaletteOpen: false,
      setCommandPaletteOpen: (value) => set({ commandPaletteOpen: value }),

      mobileNavOpen: false,
      setMobileNavOpen: (value) => set({ mobileNavOpen: value }),

      theme: "light",
      setTheme: (theme) => set({ theme }),
    }),
    { name: "commerceos-ui" }
  )
);
