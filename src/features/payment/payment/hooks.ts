import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { paymentApi } from './api';

export function useHoldStatus(confirmationId: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ['hold-status', confirmationId],
    queryFn: () => paymentApi.getHoldStatus(confirmationId),
    refetchInterval: (query) => {
      // Poll every 3 seconds if status is still pending_payment
      const status = query.state.data?.status;
      if (status === 'pending_payment') {
        return 3000;
      }
      return false; // Stop polling once resolved
    },
    enabled: !!confirmationId && enabled,
  });
}

export function useHoldCountdown(holdExpiresAt: string | null) {
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null); 

  useEffect(() => {
    if (!holdExpiresAt) {
      return;
    }

    const calculateSeconds = () => {
      const expiry = new Date(holdExpiresAt).getTime();
      const now = new Date().getTime();
      const diff = Math.max(0, Math.floor((expiry - now) / 1000));
      setSecondsLeft(diff);
      return diff;
    };

    const initial = calculateSeconds();
    if (initial <= 0) return;

    const interval = setInterval(() => {
      const left = calculateSeconds();
      if (left <= 0) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [holdExpiresAt]);

  const formatted =
    secondsLeft === null
      ? '--:--'
      : `${Math.floor(secondsLeft / 60)}:${String(secondsLeft % 60).padStart(2, '0')}`;

  return { secondsLeft, formatted };
}