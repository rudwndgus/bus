export interface TicketAppearance {
  borderColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
}
export const defaultTicketAppearance: TicketAppearance = {
  borderColor: "#2563eb",
  accentColor: "#2563eb",
  backgroundColor: "#ffffff",
  textColor: "#111827",
};
export const ticketVariables = (a: TicketAppearance) => ({
  "--ticket-border": a.borderColor,
  "--ticket-accent": a.accentColor,
  "--ticket-background": a.backgroundColor,
  "--ticket-text": a.textColor,
});
