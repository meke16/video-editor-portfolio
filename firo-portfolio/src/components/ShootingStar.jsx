import React, { useEffect, useState, useRef, useCallback } from "react";

const ShootingStar = ({ intervalMs = 12000, minDelay = 3000 }) => {
  const [visible, setVisible] = useState(false);
  const [key, setKey] = useState(0);
  const timeoutRef = useRef(null);

  const showShootingStar = useCallback(() => {
    setVisible(true);
    setKey((k) => k + 1);
    setTimeout(() => setVisible(false), 1800);
  }, []);

  useEffect(() => {
    const scheduleNext = () => {
      const delay =
        minDelay + Math.random() * (intervalMs - minDelay);
      timeoutRef.current = setTimeout(() => {
        showShootingStar();
        scheduleNext();
      }, delay);
    };

    // Shoot immediately on mount (first visit or navigating to home)
    showShootingStar();
    scheduleNext();
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [intervalMs, minDelay, showShootingStar]);

  if (!visible) return null;

  return (
    <div
      key={key}
      className="shooting-star"
      aria-hidden="true"
    >
      <div className="shooting-star-tail" />
      <div className="shooting-star-head" />
    </div>
  );
};

export default ShootingStar;
