export interface TicketAppearance {
  borderColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
}
export const defaultTicketAppearance: TicketAppearance = {
  borderColor: "#ff252c",
  accentColor: "#ff252c",
  backgroundColor: "#ffffff",
  textColor: "#080808",
};
export const ticketVariables = (a: TicketAppearance) => ({
  "--ticket-border": a.borderColor,
  "--ticket-accent": a.accentColor,
  "--ticket-background": a.backgroundColor,
  "--ticket-text": a.textColor,
});

// Upgrade the former blue placeholder while preserving deliberate custom colors.
export function migrateTicketAppearance(
  appearance: TicketAppearance,
): TicketAppearance {
  return appearance.borderColor === "#2563eb" &&
    appearance.accentColor === "#2563eb"
    ? {
        ...appearance,
        borderColor: defaultTicketAppearance.borderColor,
        accentColor: defaultTicketAppearance.accentColor,
      }
    : appearance;
}
