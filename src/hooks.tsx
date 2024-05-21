import { useCallback, useRef } from 'react';

const DEFAULT_THROTTLE_MS = 800;

const getRemainingTime = (lastTriggeredTime: number, throttleMs: number) => {
  const elapsedTime = Date.now() - lastTriggeredTime;
  const remainingTime = throttleMs - elapsedTime;

  return (remainingTime < 0) ? 0 : remainingTime;
};

type useThrottleProps = {
  callbackFn: <T, >(args?: T) => any
  throttleMs?: number
};

function useThrottle({
  callbackFn,
  throttleMs = DEFAULT_THROTTLE_MS,
}: useThrottleProps) {
  const lastTriggered = useRef<number>(Date.now());
  const timeoutRef = useRef<NodeJS.Timeout|null>(null);

  return useCallback(<T, >(args?: T) => {
    let remainingTime = getRemainingTime(lastTriggered.current, throttleMs);

    if (remainingTime === 0) {
      lastTriggered.current = Date.now();
      callbackFn(args);
    } else if (!timeoutRef.current) {
      timeoutRef.current = setTimeout(() => {
        remainingTime = getRemainingTime(lastTriggered.current, throttleMs);

        if (remainingTime === 0) {
          lastTriggered.current = Date.now();
          callbackFn(args);
        }
      }, remainingTime);
    }
  }, [callbackFn, throttleMs]);
}

export {
  useThrottle,
};
