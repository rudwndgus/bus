import type { Ticket } from "../features/tickets/ticketTypes";
export const initialTickets: Ticket[] = [
  {
    id: "two",
    zones: 2,
    region: "INTRASTATE",
    route: "119",
    expiry: "NOV 16,2026 11:59:59 PM",
    status: "unused",
  },
  {
    id: "one",
    zones: 1,
    region: "INTRASTATE",
    route: "163",
    expiry: "NOV 21,2026 11:59:59 PM",
    status: "unused",
  },
];
export const historyTickets: Ticket[] = [
  {
    id: "past-1",
    zones: 2,
    region: "INTERSTATE",
    route: "163",
    expiry: "OCT 17,2026 03:58:06 PM",
    status: "used",
  },
  {
    id: "past-2",
    zones: 3,
    region: "INTERSTATE",
    route: "163",
    expiry: "OCT 18,2026 12:18:48 AM",
    status: "used",
  },
  {
    id: "past-3",
    zones: 3,
    region: "INTERSTATE",
    route: "163",
    expiry: "OCT 18,2026 02:27:01 PM",
    status: "used",
  },
];
export const fares = [
  { name: "One Way Adult", price: 3.8 },
  { name: "One Way Child", price: 1.6 },
  { name: "One Way Sr/Dis", price: 1.6 },
  { name: "Round Trip Adult", price: 7.6 },
  { name: "Round Trip Child", price: 3.2 },
  { name: "10 Trip Discount Adult", price: 32 },
];
export const quickBuys = [
  { zones: 3, region: "INTRASTATE", route: "1" },
  { zones: 3, region: "INTERSTATE", route: "163" },
  { zones: 1, region: "INTRASTATE", route: "163" },
  { zones: 2, region: "INTRASTATE", route: "119" },
  { zones: 2, region: "INTERSTATE", route: "163" },
];
export const systems = [
  "Atlantic City",
  "Main-Bergen County",
  "Montclair-Boonton",
  "Morris & Essex",
  "North Jersey Coast",
  "Northeast Corridor",
  "Pascack Valley",
  "Princeton Dinky",
  "Raritan Valley",
  "Hudson-Bergen Light Rail",
  "Newark Light Rail",
  "River Line",
];
export const transitService = {
  getTickets: async () => initialTickets,
  source: "recording-fixture" as const,
  live: false,
};
