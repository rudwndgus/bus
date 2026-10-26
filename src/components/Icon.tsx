import {
  BusFront,
  TrainFront,
  TramFront,
  Ticket,
  Home,
  Route,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Menu,
  Search,
  Bell,
  MapPin,
  Flag,
  Info,
  Tag,
  CheckCircle,
  Plus,
  Minus,
  X,
  Star,
  Ban,
  Smartphone,
} from "lucide-react";
const icons = {
  bus: BusFront,
  train: TrainFront,
  light: TramFront,
  ticket: Ticket,
  home: Home,
  route: Route,
  left: ChevronLeft,
  right: ChevronRight,
  refresh: RefreshCw,
  menu: Menu,
  search: Search,
  bell: Bell,
  pin: MapPin,
  flag: Flag,
  info: Info,
  tag: Tag,
  check: CheckCircle,
  plus: Plus,
  minus: Minus,
  close: X,
  star: Star,
  ban: Ban,
  phone: Smartphone,
};
export function Icon({
  name,
  className = "",
}: {
  name: keyof typeof icons;
  className?: string;
}) {
  const I = icons[name];
  return (
    <I className={`icon ${className}`} aria-hidden="true" strokeWidth={2} />
  );
}
