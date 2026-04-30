
  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import "./styles/index.css";

  // Add a global handler that marks clicked/tapped buttons as `touched`.
  // This keeps legacy green buttons as-is until the user interacts with them —
  // on interaction we add the `touched` class so CSS can switch them to purple.
  function markTouched(event: PointerEvent | TouchEvent) {
    const target = event.target as Element | null;
    if (!target) return;
    const btn = (target.closest && (target.closest('button, input[type="button"], input[type="submit"], a.btn, .btn') as HTMLElement | null));
    if (btn) {
      btn.classList.add('touched');
    }
  }

  // pointerdown covers mouse/touch/pen; keep a touchstart fallback for older devices
  if (typeof document !== 'undefined') {
    document.addEventListener('pointerdown', markTouched as EventListener, { passive: true });
    document.addEventListener('touchstart', markTouched as EventListener, { passive: true });
  }

  createRoot(document.getElementById("root")!).render(<App />);
  