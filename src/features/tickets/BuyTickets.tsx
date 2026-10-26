import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "../../components/Icon";
import { fares, quickBuys } from "../../services/transit";
export function BuyTickets({ unknown }: { unknown: (s: string) => void }) {
  const navigate = useNavigate();
  return (
    <div className="buy-page">
      <div className="modes">
        {(["train", "bus", "light", "ticket"] as const).map((mode, i) => (
          <button
            className="mode-row"
            key={mode}
            onClick={() =>
              unknown(
                [
                  "Train tickets",
                  "Bus tickets",
                  "Light Rail tickets",
                  "Special Events",
                ][i],
              )
            }
          >
            <Icon name={mode} />
            <strong>
              {["Train", "Bus", "Light Rail", "Special Events"][i]}
            </strong>
            <Icon name="right" />
          </button>
        ))}
      </div>
      <h2>Quick Buy</h2>
      <div className="quick-buys">
        {quickBuys.map((q, i) => (
          <button
            className="quick-row"
            key={i}
            onClick={() =>
              i === 0
                ? navigate("/tickets/select")
                : unknown(`${q.zones} Zones (${q.region}), Route ${q.route}`)
            }
          >
            <span className="bus-icon">
              <Icon name="bus" />
            </span>
            <span>
              <strong>
                {q.zones} {q.zones === 1 ? "Zone" : "Zones"} ({q.region})
              </strong>
              <small>One Way Adult; Route Number: {q.route}</small>
            </span>
            <Icon name="right" />
          </button>
        ))}
      </div>
    </div>
  );
}
export function SelectTickets({ unknown }: { unknown: (s: string) => void }) {
  const [counts, setCounts] = useState(fares.map(() => 0));
  const total = fares.reduce((sum, f, i) => sum + f.price * counts[i], 0);
  function change(i: number, n: number) {
    setCounts((c) =>
      c.map((v, j) => (i === j ? Math.max(0, Math.min(99, v + n)) : v)),
    );
  }
  return (
    <div className="fare-page">
      <div className="journey">
        <div className="journey-icons">
          <Icon name="pin" />
          <span>⋮</span>
          <Icon name="flag" />
        </div>
        <div>
          <button onClick={() => unknown("Origin selector")}>1 - Newark</button>
          <button onClick={() => unknown("Zone selector")}>Zone 3</button>
        </div>
      </div>
      <div className="fare-total">
        <Icon name="tag" />
        <strong aria-live="polite">TOTAL ${total.toFixed(2)}</strong>
        <button
          aria-label="Fare information"
          onClick={() => unknown("Fare information")}
        >
          <Icon name="info" />
        </button>
      </div>
      <div className="fares">
        {fares.map((f, i) => (
          <div className="fare-row" key={f.name}>
            <strong>
              {f.name}
              <br />${f.price.toFixed(2)}
            </strong>
            <div className="stepper">
              <button
                aria-label={`Remove ${f.name}`}
                disabled={!counts[i]}
                onClick={() => change(i, -1)}
              >
                <Icon name="minus" />
              </button>
              <output aria-label={`${f.name} quantity`}>{counts[i]}</output>
              <button
                aria-label={`Add ${f.name}`}
                disabled={counts[i] === 99}
                onClick={() => change(i, 1)}
              >
                <Icon name="plus" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="checkout">
        <button
          className="primary"
          disabled={total === 0}
          onClick={() => unknown("Checkout")}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
