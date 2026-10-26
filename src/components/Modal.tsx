import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
export default function Modal({
  children,
  onClose,
  className = "",
}: {
  children: ReactNode;
  onClose: () => void;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement;
    const body = ref.current;
    const focusables = () =>
      Array.from(
        body?.querySelectorAll<HTMLElement>(
          'button,[href],input,select,[tabindex="0"]',
        ) ?? [],
      );
    focusables()[0]?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        const fs = focusables();
        const i = fs.indexOf(document.activeElement as HTMLElement);
        if (e.shiftKey && i <= 0) {
          e.preventDefault();
          fs.at(-1)?.focus();
        } else if (!e.shiftKey && i === fs.length - 1) {
          e.preventDefault();
          fs[0]?.focus();
        }
      }
    };
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("keydown", key);
      previous?.focus();
    };
  }, [onClose]);
  return (
    <div className="scrim">
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label="Information"
        className={`modal ${className}`}
      >
        {children}
      </div>
    </div>
  );
}
