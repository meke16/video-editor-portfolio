import React, { useState, useRef } from "react";
import { Volume2, VolumeX } from "lucide-react";

/**
 * Background ambient audio for the full site.
 * Put your audio file (mp3, ogg, etc.) in: public/ambient.mp3
 * You can replace "ambient.mp3" with your own filename.
 */
const AUDIO_SRC = "/ambient.mp3";

const BackgroundAudio = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const audioRef = useRef(null);

  const toggle = () => {
    if (!audioRef.current) return;

    setHasInteracted(true);

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={AUDIO_SRC}
        loop
        preload="metadata"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      {hasInteracted ? (
        <button
          type="button"
          className="background-audio-toggle"
          onClick={toggle}
          aria-label={isPlaying ? "Mute ambient sound" : "Play ambient sound"}
        >
          {isPlaying ? (
            <Volume2 size={20} />
          ) : (
            <VolumeX size={20} className="muted" />
          )}
        </button>
      ) : (
        <button
          type="button"
          className="background-audio-toggle"
          onClick={toggle}
          aria-label="Enable ambient sound"
        >
          <Volume2 size={20} />
          <span>Sound</span>
        </button>
      )}
    </>
  );
};

export default BackgroundAudio;
