import React, { useEffect, useState, useRef, useCallback } from "react";

// Generate a subtle whoosh sound using Web Audio API (no external files)
const playShootingStarSound = () => {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    const audioContext = new AudioContextClass();
    const now = audioContext.currentTime;

    // Soft descending sweep - like a distant shooting star
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();

    osc.connect(gain);
    gain.connect(audioContext.destination);

    osc.type = "sine";
    osc.frequency.setValueAtTime(1400, now);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.5);

    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    osc.start(now);
    osc.stop(now + 0.5);
  } catch {
    // Autoplay might be blocked until user interaction
  }
};

// Unlock audio on first user interaction (browsers block autoplay)
const unlockAudio = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === "suspended") ctx.resume();
  } catch {}
};

const ShootingStar = ({ intervalMs = 12000, minDelay = 3000 }) => {
  const [visible, setVisible] = useState(false);
  const [key, setKey] = useState(0);
  const timeoutRef = useRef(null);

  const showShootingStar = useCallback(() => {
    setVisible(true);
    setKey((k) => k + 1);
    playShootingStarSound();

    // Hide after animation (matches CSS duration)
    setTimeout(() => setVisible(false), 1800);
  }, []);

  useEffect(() => {
    const unlock = () => unlockAudio();
    document.addEventListener("click", unlock, { once: true });
    document.addEventListener("touchstart", unlock, { once: true });

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
