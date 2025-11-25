// src/hooks/useUpdates.ts
import { useEffect, useRef } from "react";

type UpdatesPayload = {
  suppliers: any[];
  customers: any[];
  purchases: any[];
  sales: any[];
};


export default function useUpdates(
  onUpdate?: (data: UpdatesPayload) => void,
  intervalMs = 10000
) {
  const lastRef = useRef<string>(new Date(0).toISOString());

  useEffect(() => {
    let mounted = true;
    let timer: number | undefined;

    async function fetchOnce() {
      try {
        const url = `http://127.0.0.1:5000/updates/recent?since=${encodeURIComponent(
          lastRef.current
        )}`;
        const res = await fetch(url);
        if (!res.ok) {
          // non-fatal: log and return, next interval will retry
          console.error("useUpdates fetch failed", res.status, await res.text());
          return;
        }
        const data = (await res.json()) as UpdatesPayload;

        // update lastRef to now so next poll asks for changes after this time
        lastRef.current = new Date().toISOString();

        if (mounted && typeof onUpdate === "function") {
          try {
            onUpdate(data);
          } catch (cbErr) {
            console.error("useUpdates onUpdate handler error", cbErr);
          }
        }
      } catch (err) {
        console.error("useUpdates poll error", err);
      }
    }

    // run immediately then set interval
    fetchOnce();
    timer = window.setInterval(fetchOnce, intervalMs);

    return () => {
      mounted = false;
      if (timer) window.clearInterval(timer);
    };
  }, [onUpdate, intervalMs]);
}
