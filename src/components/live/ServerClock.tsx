"use client";

import { useEffect, useState } from "react";

const fmt = new Intl.DateTimeFormat("ru-RU", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

/**
 * Ticking server clock in the broadcast chrome. Renders only after mount
 * so server HTML never disagrees with the first client frame; digit
 * updates are not animated (frequency rule).
 */
export function ServerClock() {
  const [now, setNow] = useState<string | null>(null);
  useEffect(() => {
    const tick = () => setNow(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="tnum font-mono text-[12.5px] font-medium text-dim" suppressHydrationWarning>
      {now ?? "--:--:--"}
    </span>
  );
}
