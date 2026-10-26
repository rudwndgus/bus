import { useState } from "react";
import previewQr from "../../assets/ticket-preview-qr.svg";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Icon } from "../../components/Icon";
import Modal from "../../components/Modal";
import { useAppStore } from "../../store/useAppStore";
import { historyTickets } from "../../services/transit";
import { ticketVariables } from "./ticketTheme";
import type { CSSProperties } from "react";
export default function TicketDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const ticket =
    useAppStore((s) => s.tickets.find((t) => t.id === id)) ??
    historyTickets.find((t) => t.id === id);
  const appearance = useAppStore((s) => s.appearance);
  const [searchParams, setSearchParams] = useSearchParams();
  const enlarged = searchParams.get("enlarged") === "1";
  const setEnlarged = (value: boolean) =>
    setSearchParams(value ? { enlarged: "1" } : {}, { replace: true });
  const [instructions, setInstructions] = useState(false);
  if (!ticket)
    return (
      <div className="empty">
        <h2>Ticket not found</h2>
        <button className="primary" onClick={() => navigate("/tickets")}>
          Back to My Tickets
        </button>
      </div>
    );
  return (
    <div
      className={`ticket-detail ${enlarged ? "enlarged" : ""}`}
      style={ticketVariables(appearance) as CSSProperties}
    >
      <article className="ticket-card">
        {enlarged && <h2 className="enlarged-title">One Way Ticket</h2>}
        <button
          className="preview-panel"
          onClick={() => setEnlarged(!enlarged)}
          aria-label={enlarged ? "Reduce ticket QR" : "Enlarge ticket QR"}
        >
          <img src={previewQr} alt="Ticket QR code" />
        </button>
        {!enlarged && <small className="tap">Tap to enlarge</small>}
        <div className="ticket-divider" />
        <div className="ticket-destination">
          <h2>{ticket.region}</h2>
          <strong>{ticket.zones}</strong>
          <h3>ZONE RIDE</h3>
          <p>1 Adult</p>
        </div>
        <div className="preview-footer">
          {enlarged ? (
            <button className="primary" onClick={() => setEnlarged(false)}>
              <Icon name="left" /> Back to ticket
            </button>
          ) : (
            <button
              className="instructions-link"
              onClick={() => setInstructions(true)}
            >
              View Onboard Validator Instructions
            </button>
          )}
        </div>
      </article>
      {!enlarged && <div className="page-dot">•</div>}
      {instructions && (
        <Modal className="instructions" onClose={() => setInstructions(false)}>
          <button
            className="sheet-close"
            onClick={() => setInstructions(false)}
            aria-label="Close validator instructions"
          >
            <Icon name="close" />
          </button>
          <div className="validator-picture">
            <Icon name="phone" />
            <Icon name="right" />
            <div className="validator">
              <img src={previewQr} alt="QR code" />
            </div>
          </div>
          <p>
            Customers boarding buses equipped with validators will be required
            to scan barcode.
          </p>
        </Modal>
      )}
    </div>
  );
}
