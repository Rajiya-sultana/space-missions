"use client";

import { useRef, useState } from "react";

type Props = {
  videoUrl: string;
  title: string;
};

export function VideoPlayer({ videoUrl, title }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const handlePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  };

  if (!videoUrl) {
    return (
      <div className="w-full aspect-video rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center gap-3 text-slate-400">
        <span className="text-5xl">🚀</span>
        <p className="text-sm font-medium">Video coming soon — check back shortly!</p>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black group shadow-[0_0_60px_rgba(249,115,22,0.1)]">
      <video
        ref={videoRef}
        src={videoUrl}
        title={title}
        className="w-full h-full object-contain"
        controls
        playsInline
        preload="metadata"
        onPlay={() => { setIsPlaying(true); setHasStarted(true); }}
        onPause={() => setIsPlaying(false)}
      />

      {/* Big play overlay before first interaction */}
      {!hasStarted && (
        <button
          onClick={handlePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity hover:bg-black/30 group-hover:opacity-100"
          aria-label={`Play ${title}`}
        >
          <div className="w-20 h-20 rounded-full bg-orange-500 flex items-center justify-center shadow-[0_0_40px_rgba(249,115,22,0.6)] transition-transform hover:scale-110">
            <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </button>
      )}
    </div>
  );
}
