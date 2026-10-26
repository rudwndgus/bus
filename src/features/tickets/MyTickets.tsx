import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "../../components/Icon";
import Modal from "../../components/Modal";
import { historyTickets } from "../../services/transit";
import { useAppStore } from "../../store/useAppStore";
import type { Ticket } from "./ticketTypes";
export default function MyTickets({ syncing }: { syncing: boolean }) {
  const tickets = useAppStore((s) => s.tickets);
  const preview = useAppStore((s) => s.openPreview);
  const [all, setAll] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [confirm, setConfirm] = useState(false);
  const [hint, setHint] = useState(true);
  const navigate = useNavigate();
  const active = tickets.filter((t) => t.status === "preview");
  const unused = tickets.filter((t) => t.status === "unused");
  function select(t: Ticket) {
    if (t.status === "preview" || all) {
      navigate(`/tickets/${t.id}`);
      return;
    }
    setSelected((s) =>
      s.includes(t.id) ? s.filter((x) => x !== t.id) : [...s, t.id],
    );
  }
  function row(t: Ticket) {
    return (
      <button
        key={t.id}
        className={`ticket-row ${all ? "history-row" : ""}`}
        onClick={() => select(t)}
        aria-label={`${t.zones} ${t.region} ${t.status === "preview" ? "preview ticket" : "ticket"}`}
        aria-pressed={
          !all && t.status === "unused" ? selected.includes(t.id) : undefined
        }
      >
        <span className="bus-icon">
          <Icon name="bus" />
        </span>
        <span className="ticket-row-text">
          {all ? (
            <>
              <strong>
                {t.zones} {t.zones === 1 ? "Zone" : "Zones"}
              </strong>
              <span>One Way Adult ({t.region})</span>
              <span>
                Exp:{" "}
                {t.status === "preview" ? "Not valid for travel" : t.expiry}
              </span>
              <strong>
                {t.status === "preview"
                  ? "Preview — Not Valid for Travel"
                  : t.status === "used"
                    ? "Used Ticket"
                    : "Non-Active Ticket"}
              </strong>
            </>
          ) : (
            <>
              <strong>
                {t.zones} {t.zones === 1 ? "Zone" : "Zones"} ({t.region})
              </strong>
              <small>One Way Adult; Route Number: {t.route}</small>
              <small>
                {t.status === "preview"
                  ? "Preview — Not valid for travel"
                  : `Exp: ${t.expiry}`}
              </small>
            </>
          )}
        </span>
        {selected.includes(t.id) && <Icon name="check" />}
      </button>
    );
  }
  return (
    <div className="my-tickets">
      <div className="segmented" role="tablist" aria-label="Ticket list">
        <button
          role="tab"
          aria-selected={!all}
          onClick={() => {
            setAll(false);
            setSelected([]);
          }}
        >
          Active/Non-Active
        </button>
        <button
          role="tab"
          aria-selected={all}
          onClick={() => {
            setAll(true);
            setSelected([]);
          }}
        >
          All Tickets
        </button>
      </div>
      {all ? (
        <>
          {hint && (
            <div className="history-hint">
              <Icon name="ticket" />
              <strong>
                Please tap on a ticket to view more ticket details and to refund
                specific tickets.
              </strong>
              <button
                aria-label="Dismiss ticket information"
                onClick={() => setHint(false)}
              >
                <Icon name="close" />
              </button>
            </div>
          )}
          {[...active, ...unused, ...historyTickets].map(row)}
        </>
      ) : (
        <>
          {active.length > 0 && (
            <>
              <h2 className="section-bar">Active Tickets</h2>
              {active.map(row)}
            </>
          )}
          <h2 className="section-bar">Non-Active Tickets</h2>
          {unused.map(row)}
        </>
      )}
      {selected.length > 0 && !all && (
        <div className="ticket-actions">
          <button className="primary" onClick={() => setConfirm(true)}>
            Activate Ticket(s)
          </button>
          <button
            className="primary orange-text"
            onClick={() => setSelected([])}
          >
            Unselect Tickets
          </button>
        </div>
      )}
      {confirm && (
        <Modal className="activation" onClose={() => setConfirm(false)}>
          <Icon name="check" />
          <h2>Activate Ticket</h2>
          <strong>Monday, October 26, 2026 9:57 AM</strong>
          <h3>
            {tickets.find((t) => t.id === selected[0])?.zones} Zones
            (INTRASTATE)
          </h3>
          <p>
            Once activated you will have 30 mins to use for your trip in a
            single direction.
          </p>
          <p className="preview-notice">
            This opens a local preview. Not valid for travel.
          </p>
          <button
            className="primary"
            onClick={() => {
              selected.forEach(preview);
              setConfirm(false);
              setSelected([]);
            }}
          >
            Open Ticket Preview
          </button>
          <button className="cancel" onClick={() => setConfirm(false)}>
            No, Cancel
          </button>
        </Modal>
      )}
      {syncing && (
        <div
          className="loading-overlay"
          role="status"
          aria-label="Refreshing local ticket list"
        >
          <span className="spinner" />
        </div>
      )}
    </div>
  );
}
