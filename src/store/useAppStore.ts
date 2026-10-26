import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  defaultTicketAppearance,
  type TicketAppearance,
} from "../features/tickets/ticketTheme";
import { initialTickets } from "../services/transit";
import type { Ticket } from "../features/tickets/ticketTypes";
interface AppState {
  tickets: Ticket[];
  appearance: TicketAppearance;
  favorites: string[];
  railNoticeSeen: boolean;
  portalNoticeSeen: boolean;
  setSeen: (kind: "rail" | "portal") => void;
  openPreview: (id: string) => void;
  setAppearance: (a: Partial<TicketAppearance>) => void;
  toggleFavorite: (id: string) => void;
}
export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      tickets: initialTickets,
      appearance: defaultTicketAppearance,
      favorites: [],
      railNoticeSeen: false,
      portalNoticeSeen: false,
      setSeen: (kind) =>
        set(
          kind === "rail"
            ? { railNoticeSeen: true }
            : { portalNoticeSeen: true },
        ),
      openPreview: (id) =>
        set((s) => ({
          tickets: s.tickets.map((t) =>
            t.id === id ? { ...t, status: "preview" } : t,
          ),
        })),
      setAppearance: (a) =>
        set((s) => ({ appearance: { ...s.appearance, ...a } })),
      toggleFavorite: (id) =>
        set((s) => ({
          favorites: s.favorites.includes(id)
            ? s.favorites.filter((f) => f !== id)
            : [...s.favorites, id],
        })),
    }),
    { name: "nj-ui-study-v1" },
  ),
);
