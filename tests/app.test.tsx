import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SelectTickets } from "../src/features/tickets/BuyTickets";
import { useAppStore } from "../src/store/useAppStore";
import { initialTickets } from "../src/services/transit";
import {
  defaultTicketAppearance,
  ticketVariables,
} from "../src/features/tickets/ticketTheme";
describe("verified fare behavior", () => {
  it("updates total, never allows a negative quantity and enables checkout", () => {
    render(<SelectTickets unknown={vi.fn()} />);
    const remove = screen.getByRole("button", { name: "Remove One Way Adult" });
    expect(remove).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Proceed to Checkout" }),
    ).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: "Add One Way Adult" }));
    fireEvent.click(screen.getByRole("button", { name: "Add One Way Child" }));
    expect(screen.getByText("TOTAL $5.40")).toBeInTheDocument();
    fireEvent.click(remove);
    expect(screen.getByText("TOTAL $1.60")).toBeInTheDocument();
    expect(remove).toBeDisabled();
  });
  it("does not invent a checkout transaction", () => {
    const unknown = vi.fn();
    render(<SelectTickets unknown={unknown} />);
    fireEvent.click(screen.getByRole("button", { name: "Add One Way Adult" }));
    fireEvent.click(
      screen.getByRole("button", { name: "Proceed to Checkout" }),
    );
    expect(unknown).toHaveBeenCalledWith("Checkout");
  });
});
describe("persistent local state", () => {
  beforeEach(() => {
    localStorage.clear();
    useAppStore.setState({
      tickets: initialTickets,
      appearance: defaultTicketAppearance,
      favorites: [],
    });
  });
  it("opens only a nonvalid preview and persists it", () => {
    useAppStore.getState().openPreview("two");
    expect(useAppStore.getState().tickets[0].status).toBe("preview");
    expect(localStorage.getItem("nj-ui-study-v1")).toContain("preview");
  });
  it("centralizes and persists ticket appearance", () => {
    useAppStore.getState().setAppearance({ borderColor: "#123456" });
    const a = useAppStore.getState().appearance;
    expect(a.accentColor).toBe(defaultTicketAppearance.accentColor);
    expect(ticketVariables(a)["--ticket-border"]).toBe("#123456");
    expect(localStorage.getItem("nj-ui-study-v1")).toContain("#123456");
  });
  it("adds and removes persistent favorite identifiers without inventing a favorites screen", () => {
    useAppStore.getState().toggleFavorite("119");
    expect(useAppStore.getState().favorites).toEqual(["119"]);
    useAppStore.getState().toggleFavorite("119");
    expect(useAppStore.getState().favorites).toEqual([]);
  });
});
import { migrateTicketAppearance } from "../src/features/tickets/ticketTheme";
describe("appearance upgrade", () => {
  it("replaces the retired blue placeholder with the recorded static border", () => {
    expect(
      migrateTicketAppearance({
        ...defaultTicketAppearance,
        borderColor: "#2563eb",
        accentColor: "#2563eb",
      }).borderColor,
    ).toBe("#ff252c");
  });
  it("preserves deliberate custom border colors", () => {
    const custom = { ...defaultTicketAppearance, borderColor: "#a855f7" };
    expect(migrateTicketAppearance(custom)).toEqual(custom);
  });
});
