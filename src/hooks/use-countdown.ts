"use client";

import { useState, useEffect, useCallback } from "react";
import { CLIENT_REFRESH_INTERVAL } from "@/lib/constants";

export function useCountdown() {
  const [secondsLeft, setSecondsLeft] = useState(
    CLIENT_REFRESH_INTERVAL / 1000
  );

  const reset = useCallback(() => {
    setSecondsLeft(CLIENT_REFRESH_INTERVAL / 1000);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) return CLIENT_REFRESH_INTERVAL / 1000;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return { secondsLeft, reset };
}
