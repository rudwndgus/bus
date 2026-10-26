import { useEffect, useState, useCallback } from "react";
import {
  Routes,
  Route,
  useLocation,
  useNavigate,
  NavLink,
} from "react-router-dom";
import { Icon } from "../components/Icon";
import Modal from "../components/Modal";
import { useAppStore } from "../store/useAppStore";
import { systems } from "../services/transit";
import { BuyTickets, SelectTickets } from "../features/tickets/BuyTickets";
import MyTickets from "../features/tickets/MyTickets";
import TicketDetails from "../features/tickets/TicketDetails";
const railText =
  "Special Portal Cutover train schedules will go into effect Sunday, October 11 through Saturday, November 14 on all rail lines except the ACRL. During this time, Midtown Direct customers on the Morristown Line, Gladstone Branch, and Montclair-Boonton Line traveling to Penn Station New York on WEEKDAYS should travel to Hoboken for alternate service to New York. Tap More Info for details.";
const portalText =
  "Due to Amtrak Portal Bridge Cutover work from October 11 through mid November, customers traveling to New York in October and November should purchase their Monthly pass, Weekly pass or FLEXPASS to Hoboken via Newark Broad Street instead of Penn Station New York. Hoboken passes will be accepted for travel to PSNY from October 1 through November 30.";
function StatusBar() {
  return (
    <div className="status-bar" aria-hidden="true">
      <strong>
        9:57 <Icon name="navigation" />
      </strong>
      <div className="island">
        <i />
      </div>
      <span>
        <Icon name="signal" />
        <b>5G</b>
        <Icon name="battery" />
      </span>
    </div>
  );
}
function NewsBanner() {
  return (
    <img
      className="news-banner"
      src={`${import.meta.env.BASE_URL}service-update.svg`}
      alt="Major service update — Portal North Bridge Cutover"
    />
  );
}
function HomeScreen({
  unknown,
  notice,
}: {
  unknown: (s: string) => void;
  notice: () => void;
}) {
  const nav = useNavigate();
  const [slide, setSlide] = useState(0);
  return (
    <div className="home-page">
      <div className="hero">
        <button
          className="menu-button"
          aria-label="Open menu"
          onClick={() => unknown("Main menu")}
        >
          <Icon name="menu" />
        </button>
        <button
          className="brand"
          aria-label="Notifications"
          onClick={() => unknown("Notifications")}
        >
          <span>
            NJ<small>TRANSIT</small>
          </span>
          <Icon name="bell" />
        </button>
        <h1>Good Morning!</h1>
      </div>
      <div className="home-content">
        <button
          className="search-pill"
          onClick={() => unknown("Trip planner search")}
        >
          <Icon name="search" />
          Where are you going?
        </button>
        <div className="news-heading">
          <h2>Breaking News</h2>
          <button onClick={() => unknown("More news")}>
            View More <Icon name="right" />
          </button>
        </div>
        <div className="news-card">
          <NewsBanner />
          <button onClick={notice}>More Info</button>
        </div>
        <div className="carousel">
          <button
            aria-label="Previous news"
            onClick={() => setSlide((v) => 1 - v)}
          >
            <Icon name="left" />
          </button>
          <button
            className={slide === 0 ? "dot selected" : "dot"}
            aria-label="News item 1"
            onClick={() => setSlide(0)}
          />
          <button
            className={slide === 1 ? "dot selected" : "dot"}
            aria-label="News item 2"
            onClick={() => {
              setSlide(1);
              unknown("Second news item");
            }}
          />
          <button
            aria-label="Next news"
            onClick={() => {
              setSlide((v) => 1 - v);
              unknown("Next news item");
            }}
          >
            <Icon name="right" />
          </button>
        </div>
        <h2>Tickets</h2>
        <button className="buy-ticket" onClick={() => nav("/buy")}>
          <Icon name="ticket" />
          <strong>Buy a Ticket</strong>
          <span>Buy</span>
        </button>
        <h2>Departures &amp; Schedules</h2>
        <div className="schedule-buttons">
          {(["train", "bus", "light"] as const).map((m, i) => (
            <button
              key={m}
              onClick={() =>
                unknown(
                  `${["Train", "Bus", "Light Rail"][i]} departures and schedules`,
                )
              }
            >
              <Icon name={m} />
              {["Train", "Bus", "Light Rail"][i]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
function RiderTools({ unknown }: { unknown: (s: string) => void }) {
  return (
    <div className="rider-page">
      <button
        className="rider-banner"
        onClick={() => unknown("Service advisory details")}
      >
        <NewsBanner />
      </button>
      <div className="rider-dots">
        ● <span>● ● ●</span>
      </div>
      <h2>System Status</h2>
      <div className="system-list">
        {systems.map((s, i) => (
          <button key={s} onClick={() => unknown(`${s} service details`)}>
            <span
              className="line-emblem"
              style={{
                color: [
                  "#20417f",
                  "#dba800",
                  "#b94b54",
                  "#12844c",
                  "#008cb1",
                  "#ed3d56",
                  "#8d3775",
                  "#e4772d",
                ][i % 8],
              }}
            >
              <Icon name={i > 8 ? "light" : "train"} />
            </span>
            <strong>{s}</strong>
            {[1, 2, 3, 4, 5, 6, 8].includes(i) && (
              <span className="warning">▲</span>
            )}
            <span className={i === 10 ? "status alert" : "status"}>
              {i === 10 ? "Alert" : "On Time"}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const railSeen = useAppStore((s) => s.railNoticeSeen);
  const portalSeen = useAppStore((s) => s.portalNoticeSeen);
  const setSeen = useAppStore((s) => s.setSeen);
  const [notice, setNotice] = useState<"rail" | "portal" | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [toast, setToast] = useState("");
  const [splash, setSplash] = useState(!sessionStorage.getItem("nj-opened"));
  const isDetail =
    /^\/tickets\/[^/]+$/.test(location.pathname) &&
    location.pathname != "/tickets/select";
  const hideNav = isDetail || location.pathname === "/tickets/select";
  useEffect(() => {
    if (splash) {
      const t = setTimeout(() => {
        setSplash(false);
        sessionStorage.setItem("nj-opened", "1");
      }, 650);
      return () => clearTimeout(t);
    }
  }, [splash]);
  useEffect(() => {
    if (location.pathname === "/" && !railSeen) setNotice("rail");
    if (location.pathname === "/buy" && !portalSeen) setNotice("portal");
  }, [location.pathname, railSeen, portalSeen]);
  useEffect(() => {
    setInfo(null);
    document.querySelector(".screen-content")?.scrollTo(0, 0);
  }, [location.pathname]);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2200);
    return () => clearTimeout(t);
  }, [toast]);
  useEffect(() => {
    if (!syncing) return;
    const t = setTimeout(() => {
      setSyncing(false);
      setToast("Local ticket list refreshed");
    }, 650);
    return () => clearTimeout(t);
  }, [syncing]);
  const closeNotice = useCallback(() => {
    if (notice) setSeen(notice);
    setNotice(null);
  }, [notice, setSeen]);
  const closeInfo = useCallback(() => setInfo(null), []);
  const title =
    location.pathname === "/buy"
      ? "Buy Tickets"
      : location.pathname === "/tickets/select"
        ? "Select Tickets"
        : location.pathname === "/tickets"
          ? "My Tickets"
          : location.pathname === "/tools"
            ? "Rider Tools"
            : isDetail
              ? "One Way Ticket"
              : "NJ TRANSIT";
  const home = location.pathname === "/";
  return (
    <div
      className={`app-shell ${home ? "on-home" : ""} ${isDetail ? "on-detail" : ""} ${location.pathname === "/buy" || location.pathname === "/tickets/select" ? "purchase-screen" : ""}`}
    >
      <StatusBar />
      {!home && (
        <header className="toolbar">
          {(location.pathname === "/buy" ||
            location.pathname === "/tickets/select" ||
            isDetail) && (
            <button
              aria-label="Back"
              className="back"
              onClick={() =>
                navigate(
                  location.pathname === "/buy"
                    ? "/"
                    : location.pathname === "/tickets/select"
                      ? "/buy"
                      : "/tickets",
                )
              }
            >
              <Icon name="left" />
            </button>
          )}
          <h1>{title}</h1>
          {location.pathname === "/tickets" && (
            <button
              aria-label="Refresh tickets"
              className="refresh"
              disabled={syncing}
              onClick={() => setSyncing(true)}
            >
              <Icon name="refresh" />
            </button>
          )}
        </header>
      )}
      <main className={`screen-content ${hideNav ? "no-nav" : ""}`}>
        <Routes>
          <Route
            path="/"
            element={
              <HomeScreen unknown={setInfo} notice={() => setNotice("rail")} />
            }
          />
          <Route path="/buy" element={<BuyTickets unknown={setInfo} />} />
          <Route
            path="/tickets/select"
            element={<SelectTickets unknown={setInfo} />}
          />
          <Route path="/tickets" element={<MyTickets syncing={syncing} />} />
          <Route path="/tickets/:id" element={<TicketDetails />} />
          <Route path="/tools" element={<RiderTools unknown={setInfo} />} />
          <Route
            path="/about"
            element={
              <div className="about">
                <h2>About this project</h2>
                <p>
                  An unofficial educational UI study. This project is not
                  affiliated with, endorsed by, or connected to NJ TRANSIT.
                </p>
                <p>
                  Schedules, fares, service status and ticket records are local
                  fixtures from the supplied recording. No real-time service,
                  payments, tickets or fare credentials are provided.
                </p>
                <button className="primary" onClick={() => navigate("/")}>
                  Home
                </button>
              </div>
            }
          />
          <Route
            path="*"
            element={
              <div className="empty">
                <h2>Page not found</h2>
                <button className="primary" onClick={() => navigate("/")}>
                  Home
                </button>
              </div>
            }
          />
        </Routes>
      </main>
      {!hideNav && (
        <nav className="bottom-nav" aria-label="Primary navigation">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ||
              location.pathname.startsWith("/buy") ||
              location.pathname === "/tickets/select"
                ? "selected"
                : ""
            }
          >
            <Icon name="home" />
            <span>Home</span>
          </NavLink>
          <NavLink
            to="/tools"
            className={({ isActive }) => (isActive ? "selected" : "")}
          >
            <Icon name="route" />
            <span>Rider Tools</span>
          </NavLink>
          <NavLink
            to="/tickets"
            className={({ isActive }) => (isActive ? "selected" : "")}
          >
            <Icon name="ticket" />
            <span>My Tickets</span>
          </NavLink>
        </nav>
      )}
      {notice && !splash && (
        <Modal
          onClose={closeNotice}
          className={notice === "rail" ? "rail-notice" : "portal-notice"}
        >
          <h2>
            {notice === "rail"
              ? "IMPORTANT RAIL SERVICE NOTICE"
              : "IMPORTANT PORTAL CUTOVER NOTICE"}
          </h2>
          {notice === "rail" && <NewsBanner />}
          <p>{notice === "rail" ? railText : portalText}</p>
          <div className="notice-actions">
            {notice === "rail" ? (
              <>
                <button
                  onClick={() => {
                    closeNotice();
                    setInfo("Service notice further information");
                  }}
                >
                  More Info
                </button>
                <button onClick={closeNotice}>OK</button>
              </>
            ) : (
              <>
                <button onClick={closeNotice}>OK</button>
                <button
                  onClick={() => {
                    closeNotice();
                    setInfo("Portal notice further information");
                  }}
                >
                  More Info
                </button>
              </>
            )}
          </div>
        </Modal>
      )}
      {info && (
        <Modal onClose={closeInfo} className="unknown-dialog">
          <Icon name="info" />
          <h2>{info}</h2>
          <p>
            This screen or action was not shown in the recording. Its appearance
            and behavior could not be verified.
          </p>
          <p>No live service or transaction has been performed.</p>
          <button className="primary" onClick={closeInfo}>
            OK
          </button>
          <button
            className="about-link"
            onClick={() => {
              closeInfo();
              navigate("/about");
            }}
          >
            About this project
          </button>
        </Modal>
      )}
      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}
      {splash && (
        <div className="splash">
          <div>
            NJ<span>TRANSIT</span>
          </div>
        </div>
      )}
    </div>
  );
}
